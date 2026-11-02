// Discord roster data is loaded from data/members.json.
const MEMBER_API_URL = String(window.ROXYCALL_MEMBER_API_URL || '').replace(/\/+$/, '');
let ALL_DISCORD_ROLES = [];
let members = [];

let currentFilter = "ALL";

// HTML特殊文字をエスケープ（名前・コメントなど可変テキストをinnerHTMLに入れる前に必ず通す）
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getRoleMemberCounts() {
    const counts = {};
    ALL_DISCORD_ROLES.forEach(role => counts[role] = 0);
    members.forEach(member => {
        member.roles.forEach(role => {
            if (counts[role] !== undefined) counts[role]++;
        });
    });
    return counts;
}

function switchPage(pageId, element, updateHash) {
    const targetPage = document.getElementById('page-' + pageId);
    if (!targetPage) return;

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const link = element || document.querySelector('.nav-link[data-page="' + pageId + '"]');
    if (link) link.classList.add('active');

    document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
    targetPage.classList.add('active');

    // URLに反映しておくと、ブラウザの戻る/進むやページ単体の共有ができる
    if (updateHash !== false && window.location.hash !== '#' + pageId) {
        window.location.hash = pageId;
    }
}

function generateFilterButtons() {
    const btnContainer = document.getElementById('filterButtons');
    if (!btnContainer) return;
    const activeRoles = new Set();
    members.forEach(m => m.roles.forEach(r => activeRoles.add(r)));
    const roleCounts = getRoleMemberCounts();
    let html = '<button class="btn' + (currentFilter === 'ALL' ? ' active' : '') + '" data-role="ALL">すべて <span class="role-user-count">' + members.length + '</span></button>';
    ALL_DISCORD_ROLES.forEach(role => {
        if (activeRoles.has(role)) {
            html += '<button class="btn' + (currentFilter === role ? ' active' : '') + '" data-role="' + escapeHtml(role) + '">' + escapeHtml(role) + ' <span class="role-user-count">' + (roleCounts[role] || 0) + '人</span></button>';
        }
    });
    btnContainer.innerHTML = html;
    btnContainer.querySelectorAll('button[data-role]').forEach(button => {
        button.addEventListener('click', () => filterGame(button.dataset.role, button));
    });
}

function createCardHTML(member, index) {
    const safeName = escapeHtml(member.displayName || member.name);
    const tags = member.roles.map(r => '<span class="tag">' + escapeHtml(r) + '</span>').join('');
    const colorIndex = index % 10;
    const comment = member.comment ? '<div class="member-comment">' + escapeHtml(member.comment) + '</div>' : '';
    const imgSrc = escapeHtml(member.image || 'images/IMG_0626.png');
    return '<div class="card color-' + colorIndex + '"><div class="card-content"><div class="member-avatar"><img src="' + imgSrc + '" alt="' + safeName + '" loading="lazy" decoding="async" width="100" height="100"></div><div class="card-text"><div class="member-name colorful">' + safeName + '</div><div class="tags">' + tags + '</div>' + comment + '</div></div></div>';
}

function displayMembers() {
    const container = document.getElementById('memberList');
    if (!container) return;
    const filtered = members.filter(m => currentFilter === 'ALL' || m.roles.includes(currentFilter));
    // 1件ずつinnerHTML+=すると毎回再パースが走るため、配列にためて最後に一度だけ書き込む
    container.innerHTML = filtered.map((m, i) => createCardHTML(m, i)).join('');
}

function displayAllMembersPage() {
    const container = document.getElementById('allMemberList');
    if (!container) return;
    container.innerHTML = members.map((m, i) => createCardHTML(m, i)).join('');
}

function displayRoleStats() {
    const countEl = document.getElementById('totalRoleCount');
    // innerTextは非表示要素(display:none)には書き込めないため、常に書き込めるtextContentを使う
    // (「ロール」ページは初期状態で非表示なので、innerTextのままだと初期表示が空欄になるバグがあった)
    if (countEl) countEl.textContent = ALL_DISCORD_ROLES.length;
    const gridEl = document.getElementById('allRolesGrid');
    if (gridEl) {
        const counts = getRoleMemberCounts();
        gridEl.innerHTML = ALL_DISCORD_ROLES.map(r => '<span class="tag">' + escapeHtml(r) + ' <span class="role-user-count">' + (counts[r] || 0) + '</span></span>').join('');
    }
}

function filterGame(roleName, buttonElement) {
    currentFilter = roleName;
    generateFilterButtons();
    displayMembers();
}

function initNews() {
    const newsPage = document.getElementById('page-news');
    if (!newsPage) return;

    const cards = newsPage.querySelectorAll('.news-card');
    cards.forEach(function(card) {
        const body = card.querySelector('.news-body');
        if (!body) return;

        const isImportant = card.classList.contains('important');
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'news-toggle';
        toggle.setAttribute('aria-expanded', String(isImportant));
        toggle.textContent = isImportant ? '本文を閉じる' : '続きを読む';
        card.appendChild(toggle);
        card.classList.toggle('is-expanded', isImportant);

        toggle.addEventListener('click', function() {
            const expanded = card.classList.toggle('is-expanded');
            toggle.setAttribute('aria-expanded', String(expanded));
            toggle.textContent = expanded ? '本文を閉じる' : '続きを読む';
        });
    });

    newsPage.querySelectorAll('.news-filter-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            const filter = button.dataset.newsFilter;
            newsPage.querySelectorAll('.news-filter-btn').forEach(function(filterButton) {
                filterButton.classList.toggle('active', filterButton === button);
            });
            cards.forEach(function(card) {
                const badge = card.querySelector('.news-badge');
                const category = badge ? Array.from(badge.classList).find(function(className) {
                    return ['emergency', 'recruitment', 'event'].includes(className);
                }) : '';
                const matches = filter === 'all' || category === filter;
                card.hidden = !matches;
            });
        });
    });
}

// YouTube iframe lazy loading
function initYouTubeIframes() {
    document.querySelectorAll('iframe.youtube-iframe').forEach(function(iframe){
        var src = iframe.getAttribute('data-src') || '';
        var id = null;
        var m = null;
        m = src.match(/[?&]v=([A-Za-z0-9_-]{11})/);
        if (m) id = m[1];
        if (!id) { m = src.match(/(?:shorts|embed)\/([A-Za-z0-9_-]{11})/); if (m) id = m[1]; }
        if (!id) { m = src.match(/^([A-Za-z0-9_-]{11})$/); if (m) id = m[1]; }
        if (id) {
            const embedParams = new URLSearchParams({
                rel: '0',
                modestbranding: '1'
            });
            if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
                embedParams.set('origin', window.location.origin);
            }
            iframe.src = 'https://www.youtube.com/embed/' + id + '?' + embedParams.toString();
        }
    });
}

// ハンバーガーメニュー切替
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navList = document.getElementById('navList');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu(open) {
    const isOpen = (open !== undefined) ? open : !navList.classList.contains('open');
    navList.classList.toggle('open', isOpen);
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    navOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburgerBtn.addEventListener('click', function() {
    toggleMenu();
});

navOverlay.addEventListener('click', function() {
    toggleMenu(false);
});

// メニュー内リンクをクリックしたら自動で閉じる
document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        switchPage(this.getAttribute('data-page'), this);
        toggleMenu(false);
    });
});

// ブラウザの戻る/進むボタンやハッシュ付きURL（例: ページ名#news）での直接アクセスに対応
const VALID_PAGES = ['home', 'rule', 'news', 'activity', 'member', 'role'];
function applyPageFromHash() {
    const pageId = VALID_PAGES.includes(window.location.hash.slice(1))
        ? window.location.hash.slice(1)
        : 'home';
    switchPage(pageId, null, false);
}
window.addEventListener('hashchange', applyPageFromHash);


async function loadUploadedAvatarOverrides() {
    if (!MEMBER_API_URL) return;
    const memberIds = members.map(member => member.id).filter(Boolean);
    if (!memberIds.length) return;
    try {
        const response = await fetch(MEMBER_API_URL + '/api/avatar-overrides?ids=' + encodeURIComponent(memberIds.join(',')), { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        members.forEach(member => {
            if (!member.id) return;
            if (payload.avatars && Object.prototype.hasOwnProperty.call(payload.avatars, member.id)) {
                member.image = MEMBER_API_URL + payload.avatars[member.id];
                member.hasUploadedAvatar = true;
            }
            if (payload.displayNames && Object.prototype.hasOwnProperty.call(payload.displayNames, member.id)) {
                member.displayName = payload.displayNames[member.id];
            }
        });
    } catch (error) {
        console.info('Member avatar overrides are temporarily unavailable.');
    }
}

async function loadSavedIntroductions() {
    if (!MEMBER_API_URL) return;
    const memberIds = members.map(member => member.id).filter(Boolean);
    if (!memberIds.length) return;
    try {
        const response = await fetch(MEMBER_API_URL + '/api/intros?ids=' + encodeURIComponent(memberIds.join(',')), { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        if (!payload.introductions || typeof payload.introductions !== 'object') return;
        members.forEach(member => {
            if (member.id && Object.prototype.hasOwnProperty.call(payload.introductions, member.id)) {
                member.comment = payload.introductions[member.id];
            }
        });
    } catch (error) {
        console.info('Member introductions are temporarily unavailable.');
    }
}

function memberSessionToken() {
    try {
        return sessionStorage.getItem('roxycall_member_session') || '';
    } catch {
        return '';
    }
}

function clearMemberSession() {
    try {
        sessionStorage.removeItem('roxycall_member_session');
    } catch {}
}

async function memberApiRequest(path, options) {
    const requestOptions = options || {};
    const headers = new Headers(requestOptions.headers || {});
    const token = memberSessionToken();
    if (token) headers.set('Authorization', 'Bearer ' + token);
    if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    return fetch(MEMBER_API_URL + path, { ...requestOptions, headers, cache: 'no-store' });
}

function initializeMemberIntroEditor() {
    const panel = document.getElementById('memberSelfEdit');
    if (!panel) return;
    const loginButton = document.getElementById('discordIntroLogin');
    const form = document.getElementById('discordIntroForm');
    const textArea = document.getElementById('discordIntroText');
    const saveButton = document.getElementById('discordIntroSave');
    const logoutButton = document.getElementById('discordIntroLogout');
    const status = document.getElementById('discordIntroStatus');
    const avatarFile = document.getElementById('discordAvatarFile');
    const avatarPreview = document.getElementById('discordAvatarPreview');
    const avatarUploadButton = document.getElementById('discordAvatarUpload');
    const avatarRemoveButton = document.getElementById('discordAvatarRemove');
    const displayNameInput = document.getElementById('discordDisplayName');
    const displayNameSaveButton = document.getElementById('discordDisplayNameSave');
    let currentUserId = '';
    let previewObjectUrl = '';
    let loginPopup = null;

    const setStatus = message => { status.textContent = message; };
    if (!MEMBER_API_URL) {
        loginButton.disabled = true;
        setStatus('オンライン編集の保存先がまだ設定されていません。');
        return;
    }

    async function loadOwnIntroduction() {
        const meResponse = await memberApiRequest('/api/me');
        if (!meResponse.ok) {
            clearMemberSession();
            form.hidden = true;
            loginButton.hidden = false;
            setStatus('Discordに再ログインしてください。');
            return;
        }
        const me = await meResponse.json();
        currentUserId = me.userId;
        displayNameInput.value = me.displayName || '';
        const introResponse = await memberApiRequest('/api/me/introduction');
        if (!introResponse.ok) {
            clearMemberSession();
            form.hidden = true;
            loginButton.hidden = false;
            setStatus('自己紹介文を読み込めませんでした。再ログインしてください。');
            return;
        }
        const saved = await introResponse.json();
        textArea.value = saved.introduction || '';
        const ownMember = members.find(member => member.id === currentUserId);
        avatarPreview.src = ownMember?.image || ownMember?.discordAvatar || '';
        avatarPreview.hidden = !avatarPreview.src;
        avatarRemoveButton.hidden = !ownMember?.hasUploadedAvatar;
        avatarFile.value = '';
        avatarUploadButton.disabled = true;
        loginButton.hidden = true;
        form.hidden = false;
        setStatus('ログイン中です。保存した内容はすぐにページへ反映されます。');
    }

    window.addEventListener('message', async event => {
        if (event.origin !== new URL(MEMBER_API_URL).origin || event.source !== loginPopup) return;
        if (!event.data || event.data.type !== 'roxycall-discord-auth') return;
        loginPopup = null;
        if (event.data.error) {
            setStatus(event.data.error);
            return;
        }
        if (!event.data.token) {
            setStatus('Discordログインに失敗しました。もう一度お試しください。');
            return;
        }
        try {
            sessionStorage.setItem('roxycall_member_session', event.data.token);
            await loadOwnIntroduction();
        } catch {
            clearMemberSession();
            setStatus('ログイン情報を保存できませんでした。このブラウザーの設定を確認してください。');
        }
    });

    loginButton.addEventListener('click', () => {
        loginPopup = window.open(MEMBER_API_URL + '/auth/login', 'roxycall-discord-login', 'popup,width=520,height=720');
        if (!loginPopup) setStatus('ポップアップがブロックされました。許可してからもう一度お試しください。');
        else setStatus('Discordログインを開いています。');
    });

    avatarFile.addEventListener('change', () => {
        const file = avatarFile.files && avatarFile.files[0];
        avatarUploadButton.disabled = !file;
        if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = '';
        if (file) {
            previewObjectUrl = URL.createObjectURL(file);
            avatarPreview.src = previewObjectUrl;
            avatarPreview.hidden = false;
        }
    });

    avatarUploadButton.addEventListener('click', async () => {
        const file = avatarFile.files && avatarFile.files[0];
        if (!file) return;
        avatarUploadButton.disabled = true;
        setStatus('画像をアップロードしています…');
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const response = await memberApiRequest('/api/me/avatar', {
                method: 'PUT',
                body: formData
            });
            const payload = await response.json();
            if (response.status === 401) {
                clearMemberSession();
                form.hidden = true;
                loginButton.hidden = false;
                setStatus('ログインの有効期限が切れました。もう一度ログインしてください。');
                return;
            }
            if (!response.ok) {
                setStatus(payload.error || '画像をアップロードできませんでした。');
                return;
            }
            const ownMember = members.find(member => member.id === currentUserId);
            if (ownMember) {
                ownMember.image = MEMBER_API_URL + payload.avatarUrl;
                ownMember.hasUploadedAvatar = true;
            }
            avatarFile.value = '';
            avatarPreview.src = ownMember?.image || '';
            avatarPreview.hidden = !avatarPreview.src;
            avatarRemoveButton.hidden = false;
            displayMembers();
            displayAllMembersPage();
            setStatus('プロフィール画像を更新しました。');
        } catch {
            setStatus('画像の保存先に接続できませんでした。時間をおいて再度お試しください。');
        } finally {
            avatarUploadButton.disabled = !(avatarFile.files && avatarFile.files[0]);
        }
    });

    avatarRemoveButton.addEventListener('click', async () => {
        avatarRemoveButton.disabled = true;
        setStatus('プロフィール画像を削除しています…');
        try {
            const response = await memberApiRequest('/api/me/avatar', { method: 'DELETE' });
            const payload = await response.json();
            if (!response.ok) {
                setStatus(payload.error || 'プロフィール画像を削除できませんでした。');
                return;
            }
            const ownMember = members.find(member => member.id === currentUserId);
            if (ownMember) {
                ownMember.image = ownMember.discordAvatar || '';
                ownMember.hasUploadedAvatar = false;
            }
            avatarFile.value = '';
            avatarPreview.src = ownMember?.image || '';
            avatarPreview.hidden = !avatarPreview.src;
            avatarRemoveButton.hidden = true;
            displayMembers();
            displayAllMembersPage();
            setStatus('Discordのプロフィール画像に戻しました。');
        } catch {
            setStatus('画像の保存先に接続できませんでした。時間をおいて再度お試しください。');
        } finally {
            avatarRemoveButton.disabled = false;
        }
    });

    displayNameSaveButton.addEventListener('click', async () => {
        displayNameSaveButton.disabled = true;
        setStatus('表示名を保存しています…');
        try {
            const response = await memberApiRequest('/api/me/display-name', {
                method: 'PUT',
                body: JSON.stringify({ displayName: displayNameInput.value })
            });
            const payload = await response.json();
            if (response.status === 401) {
                clearMemberSession();
                form.hidden = true;
                loginButton.hidden = false;
                setStatus('ログインの有効期限が切れました。もう一度ログインしてください。');
                return;
            }
            if (!response.ok) {
                setStatus(payload.error || '表示名を保存できませんでした。');
                return;
            }
            const ownMember = members.find(member => member.id === currentUserId);
            if (ownMember) ownMember.displayName = payload.displayName;
            displayNameInput.value = payload.displayName;
            displayMembers();
            displayAllMembersPage();
            setStatus(payload.displayName ? '表示名を更新しました。' : 'Discordの名前に戻しました。');
        } catch {
            setStatus('保存先に接続できませんでした。時間をおいて再度お試しください。');
        } finally {
            displayNameSaveButton.disabled = false;
        }
    });

    saveButton.addEventListener('click', async () => {
        saveButton.disabled = true;
        setStatus('保存しています…');
        try {
            const response = await memberApiRequest('/api/me/introduction', {
                method: 'PUT',
                body: JSON.stringify({ introduction: textArea.value })
            });
            const payload = await response.json();
            if (response.status === 401) {
                clearMemberSession();
                form.hidden = true;
                loginButton.hidden = false;
                setStatus('ログインの有効期限が切れました。もう一度ログインしてください。');
                return;
            }
            if (!response.ok) {
                setStatus(payload.error || '保存できませんでした。');
                return;
            }
            const ownMember = members.find(member => member.id === currentUserId);
            if (ownMember) ownMember.comment = payload.introduction;
            displayMembers();
            displayAllMembersPage();
            setStatus(payload.introduction ? '保存しました。自己紹介文を公開しました。' : '自己紹介文を削除しました。');
        } catch {
            setStatus('保存先に接続できませんでした。時間をおいて再度お試しください。');
        } finally {
            saveButton.disabled = false;
        }
    });

    logoutButton.addEventListener('click', () => {
        clearMemberSession();
        currentUserId = '';
        textArea.value = '';
        form.hidden = true;
        loginButton.hidden = false;
        setStatus('ログアウトしました。');
    });

    if (memberSessionToken()) {
        loginButton.hidden = true;
        loadOwnIntroduction().catch(() => {
            clearMemberSession();
            loginButton.hidden = false;
            setStatus('Discordログインを確認できませんでした。もう一度ログインしてください。');
        });
    }
}

async function loadSyncedMembers() {
    try {
        const response = await fetch('data/members.json', { cache: 'no-cache' });
        if (!response.ok) return;
        const payload = await response.json();
        if (!Array.isArray(payload.members) || !Array.isArray(payload.roles)) return;
        members = payload.members.map(member => ({
            id: member.id,
            name: member.name,
            image: member.avatar,
            discordAvatar: member.avatar,
            roles: Array.isArray(member.roles) ? member.roles : [],
            comment: member.comment || '',
            joinedAt: member.joinedAt || null
        })).sort((a, b) => {
            const aTime = Date.parse(a.joinedAt || '');
            const bTime = Date.parse(b.joinedAt || '');
            const aHasDate = Number.isFinite(aTime);
            const bHasDate = Number.isFinite(bTime);
            if (aHasDate && bHasDate && aTime !== bTime) return aTime - bTime;
            if (aHasDate !== bHasDate) return aHasDate ? -1 : 1;
            return String(a.id).localeCompare(String(b.id));
        });
        ALL_DISCORD_ROLES = payload.roles;
    } catch (error) {
        // Keep the bundled profile list available when opening the site offline.
        console.info('Discord member data is unavailable; using the bundled member list.');
    }
}

loadSyncedMembers().then(async () => {
    await loadSavedIntroductions();
    await loadUploadedAvatarOverrides();
    generateFilterButtons();
    displayMembers();
    displayAllMembersPage();
    displayRoleStats();
    initializeMemberIntroEditor();
});
initYouTubeIframes();
initNews();
applyPageFromHash();