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

  // On the first run, carry profile comments forward by matching old display names.
  const legacyProfiles = await readLegacyProfiles();
  const profileByName = new Map(legacyProfiles.map(profile => [normalizeName(profile.name), profile]));
  for (const member of guildMembers) {
    const user = member.user;
    if (overrides[user.id]) continue;
    const oldProfile = [
      member.nick,
      user.global_name,
      user.username
    ].map(normalizeName).map(name => profileByName.get(name)).find(Boolean);
    if (oldProfile && oldProfile.comment) {
      overrides[user.id] = { comment: oldProfile.comment };
    }
  }

  const roleNamesById = new Map(roles
    .filter(role => role.name !== '@everyone')
    .map(role => [role.id, role.name]));
  const outputMembers = guildMembers.map(member => {
    const user = member.user;
    return {
      id: user.id,
      name: member.nick || user.global_name || user.username,
      avatar: avatarUrl(member),
      roles: member.roles.map(id => roleNamesById.get(id)).filter(Boolean),
      comment: overrides[user.id]?.comment || ''
    };
  }).sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  await fs.writeFile(overridesPath, JSON.stringify(overrides, null, 2) + '\n');
  await fs.writeFile(path.join(dataDir, 'members.json'), JSON.stringify({
    updatedAt: new Date().toISOString(),
    roles: roles.filter(role => role.name !== '@everyone').sort((a, b) => a.position - b.position).map(role => role.name),
    members: outputMembers
  }, null, 2) + '\n');
  console.log(`Synced ${outputMembers.length} members and ${roles.length - 1} roles.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
