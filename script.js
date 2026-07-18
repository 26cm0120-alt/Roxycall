// 全Discordロールマスターリスト
const ALL_DISCORD_ROLES = [
    "深夜帯メンション可⭕", "深夜帯メンション不可❌", "原神民", "FGO民", "ポケモン民",
    "マイクラ民", "モンスト民", "第5人格民", "スタレ民", "雀魂民",
    "プロセカ民", "エンドフィールド民", "シャドバ民", "ゼンゼロ民", "TRPG民",
    "グラブル民", "鳴潮民", "お絵描き民", "アークナイツ民", "Skyの民",
    "DDFFの民", "SAO民", "スプラ民", "ブルアカ民", "APEX民",
    "ガルパ民", "学マス民", "ウマ娘民", "ヘブバン民", "NIKKEの民",
    "ゴッフィ民", "遊戯王民", "PUBGモバイル民", "パズドラ民", "モンハン民",
    "REPO民", "トリッカル民", "スマブラ民", "プリコネ民", "あんスタ民",
    "東方民", "荒野民", "ギルギア民", "VALORANT民", "アズールレーン民",
    "キングダムハーツ民", "フォトナ民", "アモアス民", "ツイステ民", "LoL民",
    "ステラソラ民", "にゃんこの民", "スト6の民", "ペルソナ民", "ヒロアカ民",
    "ポーカーの民", "ぷにぷに民", "ピグパ民", "リンバス民", "ARC Raiders民",
    "DRAPLINE民", "パワプロ民", "ハリポタ民", "ドラクエ民", "OW民(オーバーウォッチ)",
    "NTEの民", "ラグナド民", "エレナイ民", "偽りのアリス民", "デュエマ民",
    "オセロニアの民", "ポケツイ・ポケコロ民", "イナイレ民", "艦これ民", "メメントモリ民",
    "グラクロ民", "クッキーランキングダム民", "エイトリ民", "パチスロ民", "ピュアニスタ民",
    "ブロスタ民", "テラリア民", "星の翼民", "放サモ民", "Dbd民",
    "エルデンリング民", "グラセフ民", "朝活の民☀️", "夜活の民🌙", "サブ垢", "壁の教祖","アルチキ民"
];

const members = [
    { name: "たっけん", image: "images/IMG_0626.PNG", roles: ["深夜帯メンション可⭕", "原神民", "ポケモン民","マイクラ民","REPO民","FGO民","モンスト民","アークナイツ民","スプラ民","モンハン民","ガルパ民","雀魂民","アルチキ民","SAO民","鳴潮民","トリッカル民","PUBGモバイルの民","にゃんこの民","お絵描き民","夜活の民🌙"], comment: "コンパスが絶望的に下手なギルマスです！🎋" },
    { name: "はとぽっち", image: "images/Hatopo.webp", roles: ["深夜帯メンション不可❌", "原神民", "学マス民","FGO民", "夜活の民🌙"], comment: "ドリフトチーちゃんで相手を翻弄！🏍️" },
    { name: "エアプハイトラル", image: "images/eapuDeru.webp", roles: ["深夜帯メンション可⭕", "アークナイツ民","TRPG民","リンバス民","お絵描き民", "DRAPLINE民", "マイクラ民"], comment: "お前をエアプにしてやるペルねえ！🪶👹" },
    { name: "レダー", image: "images/reda.webp", roles: ["深夜帯メンション可⭕", "ブルアカ民", "マイクラ民", "プロセカ民", "ポケモン民","アークナイツ民","Skyの民","ヘブバン民","グラクロ民","朝活の民☀️"], comment: "ポータルキーは私に媚びたらあげる❤️ れだお" },
    { name: "シャルル", image: "images/sharuu.webp", roles: ["深夜帯メンション不可❌","原神民","FGO民","モンスト民", "スタレ民","ポケモン民","プロセカ民","ゼンゼロ民","夜活の民🌙"], comment: "敵にまわしたら誰も勝てないギルドの最後の砦⛩️" },
    { name: "サナトリウム", image: "images/sana.webp", roles: ["深夜帯メンション不可❌", "FGO民", "ポケモン民","プロセカ民","グラブル民","お絵描き民","ゴッフィ民","モンハン民","東方民"], comment: "鋭いツッコミとキレのあるプレイングで勝ち筋が決まる！🗡️" },
    { name: "shinoji", image: "images/shinoji.webp", roles: ["深夜帯メンション可⭕", "原神民","マイクラ民","第5人格民", "スタレ民","ポケモン民","雀魂民","SAO民","REPO民", "スプラ民","APEX民","ガルパ民","ウマ娘民","NIKKE民", "ゴッフィ民","遊戯王民","PUBGモバイル民","スマブラ民","プリコネ民", "あんスタ民","フォトナ民","スト6の民","アルチキ民","パワプロ民","イナイレ民", "艦これ民", "朝活の民☀️","夜活の民🌙"], comment: "" },
    { name: "アスパラゴボウ", image: "images/asupara.PNG", roles: ["深夜帯メンション不可❌", "FGO民", "モンスト民","スタレ民"], comment: "" },
    { name: "桃鍋を許すな", image: "images/momonabe.webp", roles: ["深夜帯メンション不可❌", "TRPG民", "LoL民","メメントモリ民","朝活の民☀️","夜活の民🌙"], comment: "" },
    { name: "如月アハト", image: "images/Ahato.webp", roles: ["深夜帯メンション可⭕", "FGO民","ポケモン民","モンスト民", "エンドフィールド民","グラブル民","鳴潮民","DDFFの民","SAO民","朝活の民☀️","夜活の民🌙"], comment: "" },
    { name: "きり/ちえる", image: "images/chikawa.webp", roles: ["深夜帯メンション可⭕", "原神民","マイクラ民","FGO民", "モンスト民","APEX民","ガルパ民","ウマ娘民","ヘブバン民", "パズドラ民","モンハン民","プリコネ民","東方民","ドラクエ民", "OW民(オーバーウォッチ)","朝活の民☀️"], comment: "" },
    { name: "じろう", image: "images/jiro.PNG", roles: ["深夜帯メンション可⭕","ポケモン民","マイクラ民","Skyの民","REPO民","APEX民","ゴッフィ民","PUBGモバイル民", "アモアス民","シャドバ民","雀魂民","ドラクエ民","第5人格民","夜活の民🌙"], comment: "🎵" },
    { name: "ティタノマキア", image: "images/makia.PNG", roles: ["深夜帯メンション可⭕", "FGO民","ポケモン民","エンドフィールド民", "ブルアカ民","ステラソラ民"], comment: "" },
    { name: "うに", image: "images/uni.webp", roles: ["深夜帯メンション可⭕", "原神民","マイクラ民","第5人格民", "スタレ民","プロセカ民","ゼンゼロ民","鳴潮民","お絵描き民", "Skyの民","スプラ民","学マス民","ヘブバン民","ゴッフィ民", "NTEの民","ペルソナ民","朝活の民☀️","夜活の民🌙"], comment: "" },
    { name: "みかんせいみかん", image: "images/mikan.PNG", roles: ["マイクラ民", "プロセカ民", "シャドバ民","TRPG民","遊戯王民"], comment: "" },
    { name: "らり", image: "images/rari.webp", roles: ["第5人格民", "エンドフィールド民", "Skyの民","あんスタ民"], comment: "" },
    { name: "さとつん", image: "images/sato.webp", roles: ["深夜帯メンション可⭕", "FGO民", "雀魂民","グラブル民"
    ], comment: "キャラへの愛と火力は誰にも負けません！設定やストーリー考察を語り合いたいな愛" },
    { name: "壁の教祖", image: "images/kyouso.webp", roles: ["深夜帯メンション可⭕", "原神民", "スタレ民","雀魂民", "お絵描き民","DDFFの民", "SAO民", "ブルアカ民","ハリポタ民", "ドラクエ民", "エレナイ民", "朝活の民☀️","壁の教祖"], comment: "" },
    { name: "Melon", image: "images/melon.webp", roles: ["深夜帯メンション可⭕", "原神民", "第5人格民","ゼンゼロ民", "スプラ民", "スマブラ民"], comment: "" },
    { name: "もち", image: "images/moti.webp", roles: ["深夜帯メンション可⭕", "原神民","マイクラ民","第5人格民","スタレ民", "エンドフィールド民","ゼンゼロ民","グラブル民","鳴潮民","アークナイツ民", "REPO民","APEX民","学マス民","ウマ娘民","VARORANT民", "アズールレーン民", "夜活の民🌙"], comment: "" },
    { name: "かよゆ", image: "images/kayoyu.webp", roles: ["深夜帯メンション可⭕","原神民","Skyの民", "スタレ民","スプラ民","ツイステ民","リンバス民","朝活の民☀️","夜活の民🌙"], comment: "" },
    { name: "れいん", image: "images/rein.webp", roles: ["深夜帯メンション可⭕"], comment: "" },
    { name: "來狂", image: "images/airu.webp", roles: ["深夜帯メンション可⭕", "ポケモン民", "NTEの民","スマブラ民"], comment: "" },
    { name: "でんぷん酸", image: "images/denpun.webp", roles: ["TRPG民", "アークナイツ民", "偽りのアリス民"], comment: "" },
    { name: "かれん", image: "images/karen.webp", roles: ["FGO民", "ポケモン民", "マイクラ民","お絵描き民"], comment: ""},
    { name: "しぐちゃん", image: "images/sigu.webp", roles: ["深夜帯メンション不可❌","FGO民","ポケモン民", "マイクラ民","モンスト民","雀魂民","TRPG民"], comment: "" },
    { name: "もっち〜", image: "images/mottii.webp", roles: ["深夜帯メンション可⭕", "ポケモン民", "シャドバ民", "TRPG民", "SAO民"], comment: ""},
    { name: "かべ(kabe)", image: "images/kabe.webp", roles: ["深夜帯メンション可⭕", "マイクラ民", "モンスト民","スタレ民", "シャドバ民","Skyの民", "DDFFの民","トリッカル民","NTEの民","オセロニアの民",], comment: ""},
    { name: "ケバブ大明神", image: "images/kebabu.webp", roles: ["深夜帯メンション可⭕", "ポケモン民","雀魂民", "マイクラ民","プロセカ民","にゃんこの民"], comment: ""},
    { name: "ューちゃ", image: "images/yucha.webp", roles: ["深夜帯メンション可⭕", "マイクラ民", "モンスト民","エンドフィールド民", "アークナイツ民", "REPO民","アルチキ民","学マス民", "NIKKEの民", "荒野民", "夜活の民🌙"], comment: ""},
    { name: "お宇佐", image: "images/ousa.webp", roles: ["深夜帯メンション可⭕", "FGO民", "ポケモン民","ゼンゼロ民", "グラブル民","ブルアカ民", "遊戯王民","ドラクエ民"], comment: ""},
    { name: "紅海", image: "images/koukai.webp", roles: ["原神民","FGO民", "ポケモン民","お絵描き民","アークナイツ民","DDFFの民","PUBGモバイル民","ギルギア民"], comment: ""},
    { name: "けいた", image: "images/keita.webp", roles: ["原神民","マイクラ民","ブルアカ民", "ウマ娘民","NIKKEの民"], comment: ""},
    { name: "mezian", image: "images/mezian.PNG", roles: ["FGO民","スタレ民", "シャドバ民","ゼンゼロ民","鳴潮民","APEX民","ヘブバン民","NIKKEの民", "遊戯王民","トリッカル民", "スマブラ民","ギルギア民","フォトナ民", "ARC Raider民", "夜活の民🌙"], comment: ""},
    { name: "さるさる", image: "images/sarusaru.webp", roles: ["ポケモン民", "モンスト民", "パズドラ民"], comment: ""},
    { name: "れ！", image: "images/re.webp", roles: ["深夜帯メンション不可❌", "原神民", "ポケモン民"], comment: ""},
    { name: "コッペパァァァァァン！", image: "images/kope.webp", roles: ["深夜帯メンション可⭕","原神民","マイクラ民","モンスト民", "エンドフィールド民","ゼンゼロ民", "ガルパ民","パズドラ民","プリコネ民","アズールレーン民", "ぷにぷに民", "夜活の民🌙"], comment: ""},
    { name: "八神", image: "images/yagami.webp", roles: ["深夜帯メンション不可❌", "原神民","スタレ民","エンドフィールド民" ,"ゼンゼロ民", "DDFFの民","SAO民","スプラ民","モンハン民", "キングダムハーツ民"], comment: ""},
    { name: "つぶまる", image: "images/tubu.webp", roles: ["マイクラ民", "第5人格民", "TRPG民","グラブル民","VALORANT民"], comment: ""},
    { name: "アラサー太郎5歳", image: "images/arasa.webp", roles: ["深夜帯メンション可⭕", "プロセカ民", "Skyの民","ピグパ民", "ラグナド民", "ポケツイ・ポケコロ民"], comment: ""},
    { name: "セナ", image: "images/sena.webp", roles: ["深夜帯メンション可⭕", "原神民","スタレ民","鳴潮民", "あんスタ民","朝活の民☀️","夜活の民🌙"], comment: ""},
    { name: "いいむ", image: "images/hime.webp", roles: ["深夜帯メンション可⭕", "FGO民", "DDFFの民","刀剣乱舞の民","エイトリ民", "あんスタ民",], comment: ""},
    { name: "ゆた", image: "images/yuta.webp", roles: ["深夜帯メンション可⭕", "ポケモン民", "第5人格民","夜活の民🌙"], comment: "},
    { name: "カルマ", image: "images/karma.webp", roles: ["第5人格民", "雀魂民"], comment: ""},
    { name: "龍馬", image: "images/ryuma.webp", roles: ["原神民", "雀魂民"], comment: ""},
    { name: "たまお", image: "images/tamao.webp", roles: ["ポケモン民", "第5人格民", "ガルパ民"], comment: ""},
    { name: "殺生", image: "images/settesyou.webp", roles: ["深夜帯メンション不可❌", "原神民", "学マス民"], comment: ""},
    { name: "しるむ", image: "images/sirumu.webp", roles: ["原神民", "シャドバ民"], comment: "},
    { name: "Rise", image: "images/Rise.webp", roles: ["ポケモン民", "モンスト民", "お絵描き民","デュエマ民"], comment: ""},
    { name: "ツバキ", image: "images/tubaki.webp", roles: ["FGO民", "プロセカ民"], comment: ""},
    { name: "グスタフ抱いて♡", image: "images/kotoha.webp", roles: ["原神民", "ポケモン民","第5人格民","シャドバ民"], comment: ""},
    { name: "静寂の月夜", image: "images/seizaku.webp", roles: ["DDFFの民", "夜活の民🌙"], comment: ""},
    { name: "ふあああああ！？", image: "images/fuaaaa.webp", roles: ["深夜帯メンション可⭕", "モンスト民", "第5人格民","プロセカ民"], comment: ""},
    { name: "のん", image: "images/non.webp", roles: ["モンスト民", "スタレ民", "シャドバ民","パズドラ民"], comment: ""},
    { name: "カイザ", image: "images/kaiza.webp", roles: ["原神民", "スタレ民", "プロセカ民"], comment: ""},
    { name: "はる", image: "images/ouse.webp", roles: ["深夜帯メンション不可❌", "マイクラ民", "雀魂民","夜活の民🌙"], comment: ""},
    { name: "まろ", image: "images/ouse.webp", roles: ["深夜帯メンション可⭕", "APEX民", "雀魂民"], comment: ""},
    { name: "510", image: "images/ouse.webp", roles: ["深夜帯メンション可⭕", "マイクラ民", "ペルソナ民","アルチキ民","夜活の民🌙"], comment: ""},
    { name: "テルテラ", image: "images/ouse.webp", roles: ["深夜帯メンション可⭕", "FGO民"], comment: ""},
];

let currentFilter = "ALL";

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

function switchPage(pageId, element) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    element.classList.add('active');
    document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');
}

function generateFilterButtons() {
    const btnContainer = document.getElementById('filterButtons');
    if (!btnContainer) return;
    const activeRoles = new Set();
    members.forEach(m => m.roles.forEach(r => activeRoles.add(r)));
    const roleCounts = getRoleMemberCounts();
    let html = '<button class="btn' + (currentFilter === 'ALL' ? ' active' : '') + '" onclick="filterGame(\'ALL\', this)">すべて <span class=\"role-user-count\">' + members.length + '</span></button>';
    ALL_DISCORD_ROLES.forEach(role => {
        if (activeRoles.has(role)) {
            html += '<button class="btn' + (currentFilter === role ? ' active' : '') + '" onclick="filterGame(\'' + role.replace(/'/g, "\\'") + '\', this)">' + role + ' <span class="role-user-count">' + roleCounts[role] + '人</span></button>';
        }
    });
    btnContainer.innerHTML = html;
}

function createCardHTML(member, index) {
    const tags = member.roles.map(r => '<span class="tag">' + r + '</span>').join('');
    const colorIndex = index % 10;
    const comment = member.comment ? '<div class="member-comment" style="margin-top: 12px; font-size: 13px; color: #ffffff; font-style: italic; line-height: 1.4; border-top: 1px dashed #4a4d52; padding-top: 8px;">' + member.comment + '</div>' : '';
    const imgSrc = member.image || 'images/IMG_0626.png';
    return '<div class="card color-' + colorIndex + '"><div class="card-content"><div class="member-avatar"><img src="' + imgSrc + '" alt="' + member.name + '" loading="lazy" decoding="async" width="100" height="100"></div><div class="card-text"><div class="member-name colorful">' + member.name + '</div><div class="tags">' + tags + '</div>' + comment + '</div></div></div>';
}

function displayMembers() {
    const container = document.getElementById('memberList');
    if (!container) return;
    const filtered = members.filter(m => currentFilter === 'ALL' || m.roles.includes(currentFilter));
    container.innerHTML = '';
    for (let i = 0; i < filtered.length; i++) {
        container.innerHTML += createCardHTML(filtered[i], i);
    }
}

function displayAllMembersPage() {
    const container = document.getElementById('allMemberList');
    if (!container) return;
    container.innerHTML = '';
    members.forEach((member, index) => {
        container.innerHTML += createCardHTML(member, index);
    });
}

function displayRoleStats() {
    const countEl = document.getElementById('totalRoleCount');
    if (countEl) countEl.innerText = ALL_DISCORD_ROLES.length;
    const gridEl = document.getElementById('allRolesGrid');
    if (gridEl) {
        const counts = getRoleMemberCounts();
        gridEl.innerHTML = ALL_DISCORD_ROLES.map(r => '<span class="tag">' + r + ' <span class="role-user-count">' + counts[r] + '</span></span>').join('');
    }
}

function filterGame(roleName, buttonElement) {
    currentFilter = roleName;
    generateFilterButtons();
    displayMembers();
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
            iframe.src = 'https://www.youtube.com/embed/' + id + '?rel=0&modestbranding=1';
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

generateFilterButtons();
displayMembers();
displayAllMembersPage();
displayRoleStats();
initYouTubeIframes();
