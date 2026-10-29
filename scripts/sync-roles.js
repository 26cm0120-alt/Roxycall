#!/usr/bin/env node
// Pull public guild roles and members into the static site's JSON data.
const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const guildId = (process.env.DISCORD_GUILD_ID || '').trim();
const token = process.env.DISCORD_BOT_TOKEN;

if (!guildId) {
  throw new Error('DISCORD_GUILD_ID is missing from the workflow environment.');
}
if (!/^\d{17,20}$/.test(guildId)) {
  throw new Error('DISCORD_GUILD_ID must contain only 17–20 digits.');
}
if (!token) throw new Error('DISCORD_BOT_TOKEN is required.');

async function discord(pathname) {
  const response = await fetch(`https://discord.com/api/v10${pathname}`, {
    headers: { Authorization: `Bot ${token}` }
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Discord API ${response.status}: ${detail.slice(0, 400)}`);
  }
  return response.json();
}

function normalizeName(value) {
  return String(value || '').normalize('NFKC').trim().toLocaleLowerCase('ja-JP');
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

async function readLegacyProfiles() {
  const source = await fs.readFile(path.join(root, 'script.js'), 'utf8');
  const match = source.match(/(?:const|let) members\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!match) return [];
  return vm.runInNewContext(`(${match[1]})`);
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
  return members.filter(member => member.user && !member.user.bot);
}

const EXCLUDED_MEMBER_IDS = new Set([
  '713394116456611932',
  '633635966275420160'
]);

async function main() {
  await fs.mkdir(dataDir, { recursive: true });
  const roles = await discord(`/guilds/${guildId}/roles`);
  if (!Array.isArray(roles)) throw new Error('Discord returned an invalid role list.');
  const guildMembers = await readMembers();

  const overridesPath = path.join(dataDir, 'member-overrides.json');
  let overrides = {};
  try {
    overrides = JSON.parse(await fs.readFile(overridesPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const legacyProfiles = await readLegacyProfiles();
  const profileByName = new Map();
  const profileOrderByName = new Map();
  legacyProfiles.forEach((profile, index) => {
    const key = normalizeName(profile.name);
    if (!profileByName.has(key)) profileByName.set(key, profile);
    if (!profileOrderByName.has(key)) profileOrderByName.set(key, index);
  });
  const hiddenRoleIds = new Set(roles.filter(role => role.name === 'サブ垢').map(role => role.id));
  const apiOrderById = new Map([...guildMembers]
    .sort((a, b) => BigInt(a.user.id) < BigInt(b.user.id) ? -1 : BigInt(a.user.id) > BigInt(b.user.id) ? 1 : 0)
    .map((member, index) => [member.user.id, index]));
  const keptMembers = [];

  guildMembers.forEach(member => {
    const user = member.user;
    if (EXCLUDED_MEMBER_IDS.has(user.id) || member.roles.some(id => hiddenRoleIds.has(id))) {
      delete overrides[user.id];
      return;
    }

    const names = [member.nick, user.global_name, user.username].map(normalizeName);
    const oldProfile = names.map(name => profileByName.get(name)).find(Boolean);
    const oldOrder = names.map(name => profileOrderByName.get(name)).find(Number.isInteger);
    const alreadyHasOverride = Object.hasOwn(overrides, user.id);
    const saved = overrides[user.id] || (overrides[user.id] = {});
    if (!alreadyHasOverride && oldProfile && oldProfile.comment) saved.comment = oldProfile.comment;
    if (!Number.isInteger(saved.order)) {
      saved.order = oldOrder !== undefined ? oldOrder : legacyProfiles.length + apiOrderById.get(user.id);
    }
    keptMembers.push(member);
  });

  const roleNamesById = new Map(roles
    .filter(role => role.name !== '@everyone' && role.name !== 'サブ垢')
    .map(role => [role.id, role.name]));
  const outputMembers = keptMembers.map(member => {
    const user = member.user;
    return {
      id: user.id,
      name: member.nick || user.global_name || user.username,
      avatar: avatarUrl(member),
      roles: member.roles.map(id => roleNamesById.get(id)).filter(Boolean),
      comment: overrides[user.id]?.comment || '',
      order: overrides[user.id].order
    };
  }).sort((a, b) => a.order - b.order).map(({ order, ...member }) => member);
  const publishedRoles = roles
    .filter(role => role.name !== '@everyone' && role.name !== 'サブ垢')
    .sort((a, b) => a.position - b.position)
    .map(role => role.name);

  await fs.writeFile(overridesPath, JSON.stringify(overrides, null, 2) + '\n');
  await fs.writeFile(path.join(dataDir, 'members.json'), JSON.stringify({
    updatedAt: new Date().toISOString(),
    roles: publishedRoles,
    members: outputMembers
  }, null, 2) + '\n');
  console.log(`Synced ${outputMembers.length} members and ${publishedRoles.length} roles.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
