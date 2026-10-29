// 全Discordロールマスターリスト
const MEMBER_API_URL = String(window.ROXYCALL_MEMBER_API_URL || '').replace(/\/+$/, '');
let ALL_DISCORD_ROLES = [
    "深夜帯メンション可⭕", "深夜帯メンション不可❌", "原神民", "FGO民", "ポケモン民",
    "マイクラ民", "モンスト民", "第五人格民", "スタレ民", "雀魂民",
    "プロセカ民", "エンドフィールド民", "シャドバ民", "ゼンゼロ民", "TRPG民",
    "グラブル民", "鳴潮民", "お絵描き民", "アークナイツ民", "Skyの民",
    "DDFFの民", "SAO民", "スプラ民", "ブルアカ民", "APEX民",
    "ガルパ民", "学マス民", "ウマ娘民", "ヘブバン民", "NIKKEの民",
    "ゴッフィ民", "遊戯王民", "PUBGモバイル民", "パズドラ民", "モンハン民",
    "REPO民", "トリッカル民", "スマブラ民", "プリコネ民", "あんスタ民",
    "東方民", "荒野民", "ギルギア民", "VALORANT民", "アズールレーン民",
    "キングダムハーツ民", "フォトナ民", "アモアス民", "ツイステ民", "LoL民",
    "ステラソラ民", "にゃんこ大戦争の民", "スト6の民", "ペルソナ民", "ヒロアカ民",
    "ポーカーの民", "ぷにぷに民", "ピグパ民", "リンバス民", "ARC Raiders民",
    "DRAPLINE民", "パワプロ民", "ハリポタ民", "ドラクエ民", "OW民(オーバーウォッチ)",
    "NTEの民", "ラグナド民", "エレナイ民", "偽りのアリス民", "デュエマ民",
    "オセロニアの民", "ポケツイ・ポケコロ民", "イナイレ民", "艦これ民", "メメントモリ民",
    "グラクロ民", "クッキーランキングダム民", "エイトリ民", "パチスロ民", "ピュアニスタ民",
    "ブロスタ民", "テラリア民", "星の翼民", "放サモ民", "Dbd民",
    "エルデンリング民", "グラセフ民", "朝活の民☀️", "夜活の民🌙", "サブ垢", "壁の教祖","アルチキ民","無限大の民","刀剣乱舞の民"
];

let members = [
    { name: "たっけん", image: "images/IMG_0626.PNG", roles: ["深夜帯メンション可⭕", "原神民", "ポケモン民","マイクラ民","REPO民","FGO民","モンスト民","アークナイツ民","スプラ民","モンハン民","ガルパ民","雀魂民","アルチキ民","SAO民","鳴潮民","トリッカル民","PUBGモバイル民","にゃんこ大戦争の民","無限大の民","お絵描き民","夜活の民🌙"], comment: "コンパスが絶望的に下手なギルマスです！🎋" },
    { name: "はとぽっち", image: "images/Hatopo.webp", roles: ["深夜帯メンション不可❌", "原神民", "学マス民","FGO民", "夜活の民🌙"], comment: "ドリフトチーちゃんで相手を翻弄！🏍️" },
    { name: "エアプハイトラル", image: "images/eapuDeru.webp", roles: ["深夜帯メンション可⭕", "アークナイツ民","TRPG民","リンバス民","お絵描き民", "DRAPLINE民", "マイクラ民"], comment: "お前をエアプにしてやるペルねえ！🪶👹" },
    { name: "レダー", image: "images/reda.webp", roles: ["深夜帯メンション可⭕", "ブルアカ民", "マイクラ民", "プロセカ民", "ポケモン民","アークナイツ民","Skyの民","ヘブバン民","グラクロ民","朝活の民☀️"], comment: "ポータルキーは私に媚びたらあげる❤️ れだお" },
    { name: "シャルル", image: "images/sharuu.webp", roles: ["深夜帯メンション不可❌","原神民","FGO民","モンスト民", "スタレ民","ポケモン民","プロセカ民","ゼンゼロ民","夜活の民🌙"], comment: "敵にまわしたら誰も勝てないギルドの最後の砦⛩️" },
    { name: "サナトリウム", image: "images/sana.webp", roles: ["深夜帯メンション不可❌", "FGO民", "ポケモン民","プロセカ民","グラブル民","お絵描き民","ゴッフィ民","モンハン民","東方民"], comment: "鋭いツッコミとキレのあるプレイングで勝ち筋が決まる！🗡️" },
    { name: "shinoji", image: "images/shinoji.webp", roles: ["深夜帯メンション可⭕", "原神民","マイクラ民","第五人格民", "スタレ民","ポケモン民","雀魂民","SAO民","REPO民", "スプラ民","APEX民","ガルパ民","ウマ娘民","NIKKEの民", "ゴッフィ民","遊戯王民","PUBGモバイル民","スマブラ民","プリコネ民", "あんスタ民","フォトナ民","スト6の民","アルチキ民","パワプロ民","イナイレ民", "艦これ民", "朝活の民☀️","夜活の民🌙"], comment: "別ゲーの知識が攻略サイト並です🤩" },
    { name: "アスパラゴボウ", image: "images/asupara.PNG", roles: ["深夜帯メンション不可❌", "FGO民", "モンスト民","スタレ民"], comment: "オイっ！オイっ！リアイベで幕張の空気を吸わないと死ぬう！☠️" },
    { name: "桃鍋を許すな", image: "images/momonabe.webp", roles: ["深夜帯メンション不可❌", "TRPG民", "LoL民","メメントモリ民","朝活の民☀️","夜活の民🌙"], comment: "桃鍋を使われたら地の果てまでDAします🔪" },
    { name: "如月アハト", image: "images/Ahato.webp", roles: ["深夜帯メンション可⭕", "FGO民","ポケモン民","モンスト民", "エンドフィールド民","グラブル民","鳴潮民","DDFFの民","SAO民","朝活の民☀️","夜活の民🌙"], comment: "鳴潮ガチです。配信もやってます！✨" },
    { name: "きり/ちえる", image: "images/chikawa.webp", roles: ["深夜帯メンション可⭕", "原神民","マイクラ民","FGO民", "モンスト民","APEX民","ガルパ民","ウマ娘民","ヘブバン民", "パズドラ民","モンハン民","プリコネ民","東方民","ドラクエ民", "OW民(オーバーウォッチ)","朝活の民☀️"], comment: "百合は俺の性域😘" },
    { name: "じろう", image: "images/jiro.PNG", roles: ["深夜帯メンション可⭕","ポケモン民","マイクラ民","Skyの民","REPO民","APEX民","ゴッフィ民","PUBGモバイル民", "アモアス民","シャドバ民","雀魂民","ドラクエ民","第五人格民","夜活の民🌙"], comment: "能ある鷹はFランク🈴" },
    { name: "ティタノマキア", image: "images/makia.PNG", roles: ["深夜帯メンション可⭕", "FGO民","ポケモン民","エンドフィールド民", "ブルアカ民","ステラソラ民"], comment: "低音ヴォイスで敵を沈める🎤" },
    { name: "うに", image: "images/uni.webp", roles: ["深夜帯メンション可⭕", "原神民","マイクラ民","第五人格民", "スタレ民","プロセカ民","ゼンゼロ民","鳴潮民","お絵描き民", "Skyの民","スプラ民","学マス民","ヘブバン民","ゴッフィ民", "NTEの民","ペルソナ民","朝活の民☀️","夜活の民🌙"], comment: "天性のガキンチョ✹" },
    { name: "みかんせいみかん", image: "images/mikan.PNG", roles: ["マイクラ民", "プロセカ民", "シャドバ民","TRPG民","遊戯王民"], comment: "雑多に色々やってます！KP可能なシナリオは数知れず🔥" },
    { name: "らり", image: "images/rari.webp", roles: ["第五人格民", "エンドフィールド民", "Skyの民","あんスタ民"], comment: "推し活がやめられない！❤️‍🔥" },
    { name: "壁の教祖", image: "images/kyouso.webp", roles: ["深夜帯メンション可⭕", "原神民", "スタレ民","雀魂民", "お絵描き民","DDFFの民", "SAO民", "ブルアカ民","ハリポタ民", "ドラクエ民", "エレナイ民", "朝活の民☀️","壁の教祖"], comment: "壁を愛し壁に愛された教祖👼" },
    { name: "Melon", image: "images/melon.webp", roles: ["深夜帯メンション可⭕", "原神民", "第五人格民","ゼンゼロ民", "スプラ民", "スマブラ民"], comment: "まさか、、フルカノなのか？？？俺はアングリフめぐめぐだ👨‍🦲"},
    { name: "もち", image: "images/moti.webp", roles: ["深夜帯メンション可⭕", "原神民","マイクラ民","第五人格民","スタレ民", "エンドフィールド民","ゼンゼロ民","グラブル民","鳴潮民","アークナイツ民", "REPO民","APEX民","学マス民","ウマ娘民","VALORANT民", "アズールレーン民","モンハン民", "夜活の民🌙"], comment: "アリスとポデンコと莉波を愛するネトゲ廃人　餅食えば運が増すなり確定引き👍" },
    { name: "かよゆ", image: "images/kayoyu.webp", roles: ["深夜帯メンション可⭕","原神民","Skyの民", "スタレ民","スプラ民","ツイステ民","リンバス民","朝活の民☀️","夜活の民🌙"], comment: "Discordの住人🪐イケメンなアダムはいませんか？☺️" },
    { name: "れいん", image: "images/rein.webp", roles: ["深夜帯メンション可⭕"], comment: "出戻り勢の万年初心者🔰助けてくださーーい" },
    { name: "來狂", image: "images/airu.webp", roles: ["深夜帯メンション可⭕", "ポケモン民", "NTEの民","スマブラ民","お絵描き民"], comment: "無課金勢です！課金目指して頑張る💰" },
    { name: "かれん", image: "images/karen.webp", roles: ["FGO民", "ポケモン民", "マイクラ民","お絵描き民"], comment: "お絵描きやコスプレ、ハンドメイドなど多才なメグメグ使い！🔫"},
    { name: "しぐちゃん", image: "images/sigu.webp", roles: ["深夜帯メンション不可❌","FGO民","ポケモン民", "マイクラ民","モンスト民","雀魂民","TRPG民"], comment: "ゲーム実況や動画投稿などやってます！特技はガブリエルを7年出さないことです😱" },
    { name: "もっち〜", image: "images/mottii.webp", roles: ["深夜帯メンション可⭕", "ポケモン民", "シャドバ民", "TRPG民", "SAO民"], comment: "ボイちゃん使ってます！SAO大好きユウキ推しです！🌟"},
    { name: "かべ(kabe)", image: "images/kabe.webp", roles: ["深夜帯メンション可⭕", "マイクラ民", "モンスト民","スタレ民", "シャドバ民","Skyの民", "DDFFの民","トリッカル民","NTEの民","オセロニアの民","お絵描き民"], comment: "Discord苦戦中　お手柔らかに〜🙇"},
    { name: "ケバブ大明神", image: "images/kebabu.webp", roles: ["深夜帯メンション可⭕", "ポケモン民","雀魂民", "マイクラ民","プロセカ民","にゃんこ大戦争の民"], comment: "ウンディーネはガチ🏅"},
    { name: "ューちゃ", image: "images/yucha.webp", roles: ["深夜帯メンション可⭕", "マイクラ民", "モンスト民","エンドフィールド民", "アークナイツ民", "REPO民","アルチキ民","学マス民", "NIKKEの民", "荒野民", "夜活の民🌙"], comment: "うんちぶりグスタフ・臣使い　運と気合いとセンスと勘🔥"},
    { name: "お宇佐", image: "images/ousa.webp", roles: ["深夜帯メンション可⭕", "FGO民", "ポケモン民","ゼンゼロ民", "グラブル民","ブルアカ民", "遊戯王民","ドラクエ民"], comment: "この自己紹介カードは特殊召喚できない。🚫"},
    { name: "紅海", image: "images/koukai.webp", roles: ["原神民","FGO民", "ポケモン民","お絵描き民","アークナイツ民","DDFFの民","PUBGモバイル民","ギルギア民"], comment: "ギルマスと固定する度後悔します。😞"},
    { name: "けいた", image: "images/keita.webp", roles: ["原神民","マイクラ民","ブルアカ民", "ウマ娘民","NIKKEの民"], comment: "おやおや うまぴょいして差し上げますよ🐎"},
    { name: "mezian", image: "images/mezian.PNG", roles: ["FGO民","スタレ民", "シャドバ民","ゼンゼロ民","鳴潮民","APEX民","ヘブバン民","NIKKEの民", "遊戯王民","トリッカル民", "スマブラ民","ギルギア民","フォトナ民", "ARC Raiders民", "夜活の民🌙"], comment: "どんなゲームも聖杯の力で解決します💸"},
    { name: "さるさる", image: "images/sarusaru.webp", roles: ["ポケモン民", "モンスト民", "パズドラ民"], comment: "勉強などで忙しいですが頑張ります！💪"},
    { name: "れ！", image: "images/re.webp", roles: ["深夜帯メンション不可❌", "原神民", "ポケモン民"], comment: "コンパス始めたての初心者！みんなの応援で銅アイコンを目指してます！(嘘）🥺"},
    { name: "コッペパァァァァァン！", image: "images/kope.webp", roles: ["深夜帯メンション可⭕","原神民","マイクラ民","モンスト民", "エンドフィールド民","ゼンゼロ民", "ガルパ民","パズドラ民","プリコネ民","アズールレーン民", "ぷにぷに民", "夜活の民🌙"], comment: "おっぱいは正義！ロリコッペパンです🦸‍♂️"},
    { name: "八神", image: "images/yagami.webp", roles: ["深夜帯メンション不可❌", "原神民","スタレ民","エンドフィールド民" ,"ゼンゼロ民", "DDFFの民","SAO民","スプラ民","モンハン民","無限大の民", "キングダムハーツ民"], comment: "悪いな　ここは通行止めだ🗡️ｷﾘｯ"},
    { name: "つぶまる", image: "images/tubu.webp", roles: ["マイクラ民", "第五人格民", "TRPG民","グラブル民","VALORANT民"], comment: "コンパスは浮上してませんが、別ゲーなど広く浅くやってます！😽"},
    { name: "アラサー太郎5歳", image: "images/arasa.webp", roles: ["深夜帯メンション可⭕", "プロセカ民", "Skyの民","ピグパ民", "ラグナド民", "ポケツイ・ポケコロ民"], comment: "零夜使いのｺﾞﾁｬｲのアラサーです👶"},
    { name: "セナ", image: "images/sena.webp", roles: ["深夜帯メンション可⭕", "原神民","スタレ民","鳴潮民", "あんスタ民","朝活の民☀️","夜活の民🌙"], comment: "コンパスやアニメグッズガチ勢　誰か会いましょう🥰"},
    { name: "いいむ", image: "images/hime.webp", roles: ["深夜帯メンション可⭕", "FGO民", "DDFFの民","刀剣乱舞の民","エイトリ民", "あんスタ民"], comment: "イケメンをプロデュースしてます💖"},
    { name: "カルマ", image: "images/karma.webp", roles: ["第五人格民", "雀魂民"], comment: "人生経験豊かなネトゲ廃人　雑談したい！☺︎"},
    { name: "龍馬", image: "images/ryuma.webp", roles: ["原神民", "雀魂民"], comment: "カノーネ難民すぎて、大変です　頑張ります🙃"},
    { name: "しるむ", image: "images/sirumu.webp", roles: ["原神民", "シャドバ民"], comment: "ホヨバゲーなど色々なもの通ってきてます　よろしくお願いします🍊"},
    { name: "Rise", image: "images/Rise.webp", roles: ["ポケモン民", "モンスト民", "お絵描き民","デュエマ民"], comment: "ゲームは1日24時間　睡眠時間は無限大♾️"},
    { name: "ツバキ", image: "images/tubaki.webp", roles: ["FGO民", "プロセカ民"], comment: "色々なキャラを使ってます！Discordにクリップもあげるので是非見てね😆"},
    { name: "グスタフ抱いて♡", image: "images/kotoha.webp", roles: ["原神民", "ポケモン民","第五人格民","シャドバ民"], comment: "限界看護学生🪽グスタフ最高うう"},
    { name: "静寂の月夜", image: "images/seizaku.webp", roles: ["DDFFの民", "夜活の民🌙"], comment: "ステリアさん大好き🥰カスタム好きなエンジョイ勢です！🦯"},
    { name: "ふあああああ！？", image: "images/fuaaaa.webp", roles: ["深夜帯メンション可⭕", "モンスト民", "第五人格民","プロセカ民"], comment: "アタッカーメインでやってます！デルミンやクーシーなど！😊"},
    { name: "のん", image: "images/non.webp", roles: ["モンスト民", "スタレ民", "シャドバ民","パズドラ民"], comment: "深夜帯の浮上多め⭐️星穹列車に乗りたい！🚃"},
    { name: "カイザ", image: "images/kaiza.webp", roles: ["原神民", "スタレ民", "プロセカ民"], comment: "ローミクLove マジミラとかも行きます！39😄"},
    { name: "はる", image: "images/haru.webp", roles: ["深夜帯メンション不可❌", "マイクラ民", "雀魂民","夜活の民🌙"], comment: "本当に初心者です！😭仲良くしてください！"},
    { name: "アロマリカリス", image: "images/maro.webp", roles: ["深夜帯メンション可⭕", "APEX民", "雀魂民"], comment: "雑食ゲーマーです。社畜にならないようにドロンします！🥷"},
    { name: "テルテラ", image: "images/terutera.webp", roles: ["深夜帯メンション可⭕", "FGO民"], comment: "ゆるふわな雰囲気でゲームしてます！よろしくお願いします！（^人^）"},
    { name: "赤ずきんの傭兵", image: "images/akazukin.webp", roles: ["深夜帯メンション不可❌", "ポケモン民","アークナイツ民","エンドフィールド民","グラブル民","リンバス民"], comment: "リンバスやアークナイツなど！他鯖での活動メインですが、こちらでもよろしくお願いします！🙏"},
    { name: "もしーん", image: "images/moshin.webp", roles: ["深夜帯メンション可⭕","モンスト民","第五人格民"], comment: "下手くそですが暖かく見守ってください。よろしくお願いします！🙏"},
    { name: "ゆー★", image: "images/yu-.webp", roles: ["深夜帯メンション可⭕","原神民", "ポケモン民"], comment: "んはあルチアーノで帯電デルミン並の火力！🔥自鯖運営もしてます！仲良くしてください！"},
    { name: "未元物質ニキ", image: "images/migenn.webp", roles: ["深夜帯メンション不可❌","原神民", "ポケモン民","マイクラ民", "FGO民","雀魂民","プロセカ民","お絵描き民","ゼンゼロ民","モンハン民","SAO民","東方民","リンバス民","ペルソナ民","にゃんこ大戦争の民","星の翼民"], comment: ""},
    { name: "猫音", image: "images/nyaon.webp", roles: ["深夜帯メンション可⭕","原神民", "ポケモン民","スタレ民","ゼンゼロ民","学マス民","スプラ民","ゴッフィ民","ペルソナ民","ヒロアカ民","OW民(オーバーウォッチ)","モンハン民","夜活の民🌙"], comment: ""},
    { name: "炸裂あんこ餅", image: "images/annko.webp", roles: ["深夜帯メンション不可❌"], comment: ""},
    { name: "桐生・E・シオン", image: "images/sion.webp", roles: ["深夜帯メンション不可❌", "マイクラ民", "NTEの民"], comment: ""},
    { name: "すずや", image: "images/suzu.webp", roles: ["深夜帯メンション可⭕","雀魂民"], comment: ""},
    { name: "ヌケニn", image: "images/nuke.webp", roles: ["深夜帯メンション可⭕","雀魂民","ウマ娘民"], comment: ""},
    { name: "カール・センナ", image: "images/curl.webp", roles: ["深夜帯メンション可⭕","原神民","マイクラ民","APEX民","フォトナ民"], comment: ""},
    { name: "ぽち", image: "images/poti.webp", roles: ["深夜帯メンション可⭕","原神民","ポケモン民","モンスト民","マイクラ民","ポケモン民","雀魂民","モンハン民","モンハン民","ゴッフィ民","ドラクエ民","ブルアカ民 ","にゃんこ大戦争の民","アモアス民","にゃんこ大戦争の民","ポーカーの民","OW民（オーバーウォッチ）","Dbd民"], comment: ""}
];
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
    const safeName = escapeHtml(member.name);
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
    if (requestOptions.body) headers.set('Content-Type', 'application/json');
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
    let currentUserId = '';
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
            roles: Array.isArray(member.roles) ? member.roles : [],
            comment: member.comment || ''
        }));
        ALL_DISCORD_ROLES = payload.roles;
    } catch (error) {
        // Keep the bundled profile list available when opening the site offline.
        console.info('Discord member data is unavailable; using the bundled member list.');
    }
}

loadSyncedMembers().then(async () => {
    await loadSavedIntroductions();
    generateFilterButtons();
    displayMembers();
    displayAllMembersPage();
    displayRoleStats();
    initializeMemberIntroEditor();
});
initYouTubeIframes();
initNews();
applyPageFromHash();