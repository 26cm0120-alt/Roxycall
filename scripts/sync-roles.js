#!/usr/bin/env node
// Pull public guild roles and members into the static site's JSON data.
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const guildId = (process.env.DISCORD_GUILD_ID || '').trim();
const token = process.env.DISCORD_BOT_TOKEN;
const excludedMemberIdsRaw = (process.env.EXCLUDED_MEMBER_IDS || '').trim();
if (!excludedMemberIdsRaw) {
  throw new Error('EXCLUDED_MEMBER_IDS is missing. Add the comma-separated IDs as a GitHub Actions secret.');
}
const excludedMemberIds = excludedMemberIdsRaw.split(/[\s,]+/).filter(Boolean);
if (excludedMemberIds.some(id => !/^\d{17,20}$/.test(id))) {
  throw new Error('EXCLUDED_MEMBER_IDS must contain only comma-separated Discord snowflakes.');
}
const excludedMemberIdSet = new Set(excludedMemberIds);
if (excludedMemberIdSet.size !== excludedMemberIds.length) {
  throw new Error('EXCLUDED_MEMBER_IDS contains duplicate IDs.');
}

if (!guildId) {
  throw new Error('DISCORD_GUILD_ID is missing from the workflow environment.');
}
if (!/^\d{17,20}$/.test(guildId)) {
  throw new Error('DISCORD_GUILD_ID must contain only 17–20 digits.');
}
if (!token) throw new Error('DISCORD_BOT_TOKEN is required.');

async function discord(pathname) {
  const response = await fetch(`https://discord.com/api/v10${pathname}`, {
    headers: {
      Authorization: `Bot ${token}`,
      'User-Agent': 'DiscordBot (https://26cm0120-alt.github.io/Roxycall, 1.0)'
    }
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Discord API ${response.status}: ${detail.slice(0, 400)}`);
  }
  return response.json();
}

function defaultAvatarUrl(user) {
  const index = Number((BigInt(user.id) >> 22n) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

function avatarUrl(member) {
  const user = member.user;
  if (member.avatar) {
    const format = member.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/avatars/${member.avatar}.${format}?size=128`;
  }
  if (user.avatar) {
    const format = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=128`;
  }
  return defaultAvatarUrl(user);
}

async function readMembers() {
  const members = [];
  let after = '0';
  while (true) {
    const page = await discord(`/guilds/${guildId}/members?limit=1000&after=${after}`);
    if (!Array.isArray(page)) throw new Error('Discord returned an invalid member page.');
    members.push(...page);
    if (page.length < 1000) break;
    after = page[page.length - 1].user.id;
  }
  return members.filter(member => member.user);
}

async function writeFileIfChanged(filePath, content) {
  try {
    if (await fs.readFile(filePath, 'utf8') === content) return false;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await fs.writeFile(filePath, content);
  return true;
}

async function main() {
  await fs.mkdir(dataDir, { recursive: true });
  const roles = await discord(`/guilds/${guildId}/roles`);
  if (!Array.isArray(roles)) throw new Error('Discord returned an invalid role list.');
  const allGuildMembers = await readMembers();
  const guildMembers = allGuildMembers.filter(member => !member.user.bot);

  const overridesPath = path.join(dataDir, 'member-overrides.json');
  let overrides = {};
  try {
    overrides = JSON.parse(await fs.readFile(overridesPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  for (const profile of Object.values(overrides)) {
    if (profile && typeof profile === 'object') delete profile.order;
  }

  const hiddenRoleIds = new Set(roles.filter(role => role.name === 'サブ垢').map(role => role.id));
  const keptMembers = [];
  let removedOverrideCount = 0;

  guildMembers.forEach(member => {
    const user = member.user;
    if (
      excludedMemberIdSet.has(user.id) ||
      member.roles.some(id => hiddenRoleIds.has(id))
    ) {
      if (Object.hasOwn(overrides, user.id)) {
        delete overrides[user.id];
        removedOverrideCount += 1;
      }
      return;
    }

    if (!Object.hasOwn(overrides, user.id)) overrides[user.id] = {};
    keptMembers.push(member);
  });

  const humanRoleIds = new Set(keptMembers.flatMap(member => member.roles));
  const roleNamesById = new Map(roles
    .filter(role => role.name !== '@everyone' && role.name !== 'サブ垢' && !role.managed && humanRoleIds.has(role.id))
    .map(role => [role.id, role.name]));
  const outputMembers = keptMembers.map(member => {
    const user = member.user;
    return {
      id: user.id,
      name: member.nick || user.global_name || user.username,
      avatar: avatarUrl(member),
      roles: member.roles.map(id => roleNamesById.get(id)).filter(Boolean),
      comment: overrides[user.id]?.comment || '自己紹介は準備中です。',
      joinedAt: member.joined_at || null
    };
  }).sort((a, b) => {
    const aTime = Date.parse(a.joinedAt || '');
    const bTime = Date.parse(b.joinedAt || '');
    const aHasDate = Number.isFinite(aTime);
    const bHasDate = Number.isFinite(bTime);
    if (aHasDate && bHasDate && aTime !== bTime) return aTime - bTime;
    if (aHasDate !== bHasDate) return aHasDate ? -1 : 1;
    return BigInt(a.id) < BigInt(b.id) ? -1 : BigInt(a.id) > BigInt(b.id) ? 1 : 0;
  });
  const publishedRoles = roles
    .filter(role => role.name !== '@everyone' && role.name !== 'サブ垢' && !role.managed && humanRoleIds.has(role.id))
    .sort((a, b) => a.position - b.position)
    .map(role => role.name);

  const membersPath = path.join(dataDir, 'members.json');
  let previousPayload = null;
  try {
    previousPayload = JSON.parse(await fs.readFile(membersPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const dataChanged = !previousPayload ||
    JSON.stringify(previousPayload.roles) !== JSON.stringify(publishedRoles) ||
    JSON.stringify(previousPayload.members) !== JSON.stringify(outputMembers);
  const updatedAt = dataChanged || !previousPayload.updatedAt
    ? new Date().toISOString()
    : previousPayload.updatedAt;
  const membersContent = JSON.stringify({
    updatedAt,
    roles: publishedRoles,
    members: outputMembers
  }, null, 2) + '\n';

  await writeFileIfChanged(overridesPath, JSON.stringify(overrides, null, 2) + '\n');
  const membersChanged = await writeFileIfChanged(membersPath, membersContent);
  console.log(`Synced ${outputMembers.length} members and ${publishedRoles.length} roles.`);
  if (removedOverrideCount) {
    console.warn(`Removed saved profile data for ${removedOverrideCount} excluded member(s). If this was unintended, restore it from Git history.`);
  }
  if (!membersChanged) console.log('Member data is unchanged; kept its previous updatedAt value.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
