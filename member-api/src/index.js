const DISCORD_API = 'https://discord.com/api/v10';
const SESSION_LIFETIME_SECONDS = 4 * 60 * 60;
const INTRODUCTION_MAX_LENGTH = 500;
const EXCLUDED_MEMBER_IDS = new Set(["713394116456611932", "633635966275420160"]);
const EXCLUDED_MEMBER_NAMES = new Set(["256です", "ゆるうさ"].map(normalizeMemberName));

function normalizeMemberName(value) {
  return String(value || "").normalize("NFKC").trim().toLocaleLowerCase("ja-JP");
}

function encodeBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

function encodeText(value) {
  return encodeBase64Url(new TextEncoder().encode(value));
}

function decodeText(value) {
  return new TextDecoder().decode(decodeBase64Url(value));
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return encodeBase64Url(new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  ));
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function cookieValue(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) {
      return part.slice(separator + 1).trim();
    }
  }
  return '';
}

function corsHeaders(request, env) {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'Vary': 'Origin'
  });
  const origin = request.headers.get('Origin');
  if (origin && origin === env.SITE_ORIGIN) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    headers.set('Access-Control-Max-Age', '600');
  }
  return headers;
}

function jsonResponse(request, env, body, status) {
  const headers = corsHeaders(request, env);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(body), { status: status || 200, headers });
}

function requireAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin');
  return !origin || origin === env.SITE_ORIGIN;
}

function randomToken(byteLength) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return encodeBase64Url(bytes);
}

function redirectUri(request) {
  return new URL('/auth/callback', new URL(request.url).origin).toString();
}

function popupResponse(env, result, clearStateCookie) {
  const targetOrigin = JSON.stringify(env.SITE_ORIGIN).replace(/</g, '\\u003c');
  const message = JSON.stringify(result).replace(/</g, '\\u003c');
  const html = '<!doctype html><html lang="ja"><meta charset="utf-8"><title>Discordログイン</title>' +
    '<body><p>Discord認証を処理しています。この画面は自動で閉じます。</p><script>' +
    'if(window.opener){window.opener.postMessage(' + message + ',' + targetOrigin + ');window.close();}' +
    '</script></body></html>';
  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"
  });
  if (clearStateCookie) {
    headers.append('Set-Cookie', 'roxycall_oauth_state=; Path=/auth/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  }
  return new Response(html, { status: 200, headers });
}

async function createSignedSession(userId, env) {
  const now = Math.floor(Date.now() / 1000);
  const payload = encodeText(JSON.stringify({
    sub: userId,
    iat: now,
    exp: now + SESSION_LIFETIME_SECONDS
  }));
  return payload + '.' + await hmac(env.SESSION_SECRET, payload);
}

async function readSession(request, env) {
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) return null;
  const token = authorization.slice(7);
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const expected = await hmac(env.SESSION_SECRET, parts[0]);
  if (!constantTimeEqual(expected, parts[1])) return null;
  try {
    const payload = JSON.parse(decodeText(parts[0]));
    if (!/^\d{17,20}$/.test(payload.sub) || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return { userId: payload.sub };
  } catch {
    return null;
  }
}

async function checkGuildMembership(userId, env) {
  if (EXCLUDED_MEMBER_IDS.has(userId)) return false;
  const headers = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN };
  const memberResponse = await fetch(
    DISCORD_API + '/guilds/' + env.DISCORD_GUILD_ID + '/members/' + userId,
    { headers }
  );
  if (memberResponse.status === 404) return false;
  if (!memberResponse.ok) throw new Error('Discord membership check failed.');
  const member = await memberResponse.json();
  const memberNames = [member.nick, member.user?.global_name, member.user?.username]
    .map(normalizeMemberName);
  if (memberNames.some(name => [...EXCLUDED_MEMBER_NAMES].some(excludedName => name.includes(excludedName)))) return false;

  const rolesResponse = await fetch(
    DISCORD_API + '/guilds/' + env.DISCORD_GUILD_ID + '/roles',
    { headers }
  );
  if (!rolesResponse.ok) throw new Error('Discord role check failed.');
  const roles = await rolesResponse.json();
  const privateRoleIds = new Set(
    roles.filter(role => role.name === 'サブ垢').map(role => role.id)
  );
  return !member.roles.some(roleId => privateRoleIds.has(roleId));
}

async function handleLogin(request, env) {
  const state = randomToken(32);
  const statePayload = encodeText(JSON.stringify({
    state,
    expiresAt: Date.now() + 10 * 60 * 1000
  }));
  const signature = await hmac(env.SESSION_SECRET, statePayload);
  const authorizeUrl = new URL('https://discord.com/oauth2/authorize');
  authorizeUrl.searchParams.set('client_id', env.DISCORD_CLIENT_ID);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri(request));
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', 'identify');
  authorizeUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      'Location': authorizeUrl.toString(),
      'Set-Cookie': 'roxycall_oauth_state=' + statePayload + '.' + signature +
        '; Path=/auth/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600',
      'Cache-Control': 'no-store'
    }
  });
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const stateParts = cookieValue(request, 'roxycall_oauth_state').split('.');
  if (!code || !returnedState || stateParts.length !== 2) {
    return popupResponse(env, { type: 'roxycall-discord-auth', error: 'ログインを確認できませんでした。もう一度お試しください。' }, true);
  }

  const expectedSignature = await hmac(env.SESSION_SECRET, stateParts[0]);
  if (!constantTimeEqual(expectedSignature, stateParts[1])) {
    return popupResponse(env, { type: 'roxycall-discord-auth', error: 'ログインの確認に失敗しました。もう一度お試しください。' }, true);
  }

  let savedState;
  try {
    savedState = JSON.parse(decodeText(stateParts[0]));
  } catch {
    return popupResponse(env, { type: 'roxycall-discord-auth', error: 'ログイン状態を確認できませんでした。' }, true);
  }
  if (savedState.state !== returnedState || savedState.expiresAt < Date.now()) {
    return popupResponse(env, { type: 'roxycall-discord-auth', error: 'ログインの有効期限が切れました。もう一度お試しください。' }, true);
  }

  try {
    const clientCredentials = btoa(env.DISCORD_CLIENT_ID + ':' + env.DISCORD_CLIENT_SECRET);
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + clientCredentials,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri(request)
      })
    });
    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.json().catch(() => ({}));
      const errorCode = typeof tokenError.error === 'string' && /^[a-z_]+$/.test(tokenError.error)
        ? tokenError.error
        : String(tokenResponse.status);
      const message = errorCode === 'invalid_client'
        ? 'DiscordのOAuth Client IDまたはClient Secretが拒否されました（invalid_client）。'
        : errorCode === 'invalid_grant'
          ? '認証コードまたはRedirect URIが一致しません（invalid_grant）。'
          : 'Discord OAuthでエラーが返りました（' + errorCode + '）。';
      return popupResponse(env, { type: 'roxycall-discord-auth', error: message }, true);
    }
    const tokenData = await tokenResponse.json();
    const userResponse = await fetch(DISCORD_API + '/users/@me', {
      headers: { Authorization: 'Bearer ' + tokenData.access_token }
    });
    if (!userResponse.ok) {
      return popupResponse(env, { type: 'roxycall-discord-auth', error: 'Discordアカウントを確認できませんでした。' }, true);
    }
    const user = await userResponse.json();
    const isMember = await checkGuildMembership(user.id, env);
    if (!isMember) {
      return popupResponse(env, { type: 'roxycall-discord-auth', error: '対象サーバーの対象メンバーのみ自己紹介を編集できます。' }, true);
    }

    const sessionToken = await createSignedSession(user.id, env);
    return popupResponse(env, {
      type: 'roxycall-discord-auth',
      token: sessionToken
    }, true);
  } catch (error) {
    console.error('Discord OAuth callback failed.');
    return popupResponse(env, { type: 'roxycall-discord-auth', error: 'Discordへの接続に失敗しました。時間をおいて再度お試しください。' }, true);
  }
}

async function handleApi(request, env, url) {
  if (!requireAllowedOrigin(request, env)) {
    return jsonResponse(request, env, { error: 'Origin is not allowed.' }, 403);
  }
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }

  if (request.method === 'GET' && url.pathname === '/api/intros') {
    const ids = (url.searchParams.get('ids') || '').split(',').filter(Boolean);
    if (!ids.length || ids.length > 100 || ids.some(id => !/^\d{17,20}$/.test(id))) {
      return jsonResponse(request, env, { error: 'Provide between 1 and 100 valid member IDs.' }, 400);
    }
    const placeholders = ids.map(() => '?').join(',');
    const result = await env.DB.prepare(
      'SELECT user_id, introduction FROM member_introductions WHERE user_id IN (' + placeholders + ')'
    ).bind(...ids).all();
    const introductions = {};
    for (const row of result.results || []) introductions[row.user_id] = row.introduction;
    return jsonResponse(request, env, { introductions }, 200);
  }

  if (url.pathname === '/api/me' && request.method === 'GET') {
    const session = await readSession(request, env);
    if (!session) return jsonResponse(request, env, { error: 'Please sign in again.' }, 401);
    return jsonResponse(request, env, { userId: session.userId }, 200);
  }

  if (url.pathname === '/api/me/introduction' && request.method === 'GET') {
    const session = await readSession(request, env);
    if (!session) return jsonResponse(request, env, { error: 'Please sign in again.' }, 401);
    const row = await env.DB.prepare(
      'SELECT introduction FROM member_introductions WHERE user_id = ?'
    ).bind(session.userId).first();
    return jsonResponse(request, env, { introduction: row ? row.introduction : '' }, 200);
  }

  if (url.pathname === '/api/me/introduction' && request.method === 'PUT') {
    const session = await readSession(request, env);
    if (!session) return jsonResponse(request, env, { error: 'Please sign in again.' }, 401);
    const isMember = await checkGuildMembership(session.userId, env);
    if (!isMember) return jsonResponse(request, env, { error: '対象サーバーのメンバーのみ編集できます。' }, 403);

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(request, env, { error: '入力内容を読み取れませんでした。' }, 400);
    }
    const introduction = typeof body.introduction === 'string' ? body.introduction.trim() : null;
    if (introduction === null || Array.from(introduction).length > INTRODUCTION_MAX_LENGTH) {
      return jsonResponse(request, env, { error: '自己紹介文は500文字以内で入力してください。' }, 400);
    }

    if (!introduction) {
      await env.DB.prepare('DELETE FROM member_introductions WHERE user_id = ?')
        .bind(session.userId).run();
      return jsonResponse(request, env, { introduction: '' }, 200);
    }

    await env.DB.prepare(
      'INSERT INTO member_introductions (user_id, introduction, updated_at) VALUES (?, ?, ?) ' +
      'ON CONFLICT(user_id) DO UPDATE SET introduction = excluded.introduction, updated_at = excluded.updated_at'
    ).bind(session.userId, introduction, new Date().toISOString()).run();
    return jsonResponse(request, env, { introduction }, 200);
  }

  return jsonResponse(request, env, { error: 'Not found.' }, 404);
}

export default {
  async fetch(request, env) {
    if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
      return new Response('Worker is not configured.', { status: 503 });
    }
    const url = new URL(request.url);
    if (url.pathname === '/healthz' && request.method === 'GET') {
      return new Response('ok', { headers: { 'Cache-Control': 'no-store' } });
    }
    if (url.pathname === '/auth/login' && request.method === 'GET') {
      return handleLogin(request, env);
    }
    if (url.pathname === '/auth/callback' && request.method === 'GET') {
      return handleCallback(request, env);
    }
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env, url);
      } catch {
        console.error('Member API request failed.');
        return jsonResponse(request, env, { error: 'Server error.' }, 500);
      }
    }
    return new Response('Not found.', { status: 404 });
  }
};
