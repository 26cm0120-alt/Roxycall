# Roxycall｜コミュニティポータル

ゲームコミュニティ「ネトゲ廃人ロキシーコール」の情報をまとめたWebサイトです。ルールや活動記録の確認、一緒に遊ぶメンバー探しをスマートフォン・PCから行えます。

## 主な機能

- コミュニティのルール・マナー案内
- ニュースのカテゴリ絞り込みと本文の開閉
- 画像・動画による活動紹介
- メンバーのプロフィール表示
- ゲームや活動時間帯などのロール別メンバー検索

## 使用技術

HTML / CSS / JavaScript（フレームワーク不使用）

バックエンドやデータベースを使わない静的サイトです。

## 実装の工夫

- メンバー情報を配列で管理し、カード表示と検索に共通利用
- URLのハッシュによる画面切り替えと、戻る・進むへの対応
- レスポンシブレイアウトとハンバーガーメニュー
- 画像の遅延読み込みとサイズ指定
- 動的に表示するメンバー名・コメントのHTMLエスケープ

## ファイル構成

| ファイル | 役割 |
| --- | --- |
| index.html | ページ構造・ニュース・活動内容 |
| style.css | デザイン・レスポンシブ対応 |
| script.js | メンバーデータ・検索・画面切り替え |
| images/・videos/ | 掲載画像・動画 |

## 起動方法

Python 3がある環境で、プロジェクトフォルダ内から
`python3 -m http.server 8000` を実行し、
ブラウザで `http://localhost:8000` を開きます。

パッケージのインストールやビルドは不要です。

## Discord同期の設定

GitHub Actionsが1日1回（UTC 18:17、JST 03:17）と手動実行時に、Discordのメンバー名・アバター・ロールを静的JSONへ反映します。

1. Discord Developer PortalでBotを作成し、Bot設定の **SERVER MEMBERS INTENT** を有効にします。
2. Botを対象サーバー（ID: `1387350967628075101`）へ追加します。Botトークンは公開しないでください。
3. GitHubリポジトリの **Settings → Secrets and variables → Actions** にRepository secret `GG`（Bot token）を登録します。サーバーID `1387350967628075101` はワークフローに設定済みです。
4. **Actions → Sync Discord members and roles → Run workflow** を一度実行します。

同期データは `data/members.json`、コメントのID別管理は `data/member-overrides.json` に保存されます。初回同期時は現在のプロフィール名とDiscordのサーバーニックネーム／表示名が一致した場合にコメントを引き継ぎ、その後はDiscordユーザーIDで紐づけます。コメントを編集する場合は `data/member-overrides.json` の該当IDの `comment` を変更してください。アバター画像はDiscordのCDN URLを使います。Bot tokenはActions内でのみ使われ、サイトへ送信されません。

## Discordログインで自己紹介文を即時編集

メンバー紹介ページからDiscordでログインすると、本人の自己紹介文を編集できます。変更はCloudflare D1へ保存され、すぐに公開プロフィールへ反映されます。編集できるのは対象サーバーの本人の紹介文だけです。対象サーバーにいないアカウント、非掲載アカウント、「サブ垢」ロールのアカウントは編集できません。自己紹介文は公開情報として表示されます。

### Cloudflare Workerの初回設定

1. Cloudflareアカウントでログインできる環境から `npx wrangler@latest login` を実行します。
2. `member-api/` へ移動し、`npx wrangler@latest d1 create roxycall-member-introductions` を実行します。表示されたDatabase IDを `member-api/wrangler.toml` の `database_id` に設定します。
3. D1へテーブルを作成します: `npx wrangler@latest d1 migrations apply roxycall-member-introductions --remote`
4. WorkerのSecretを登録します。各コマンドの入力欄へDiscord Developer PortalのOAuth2 Client Secret、既存のBot Token、32文字以上のランダムなセッション鍵を入力します。
   - `npx wrangler@latest secret put DISCORD_CLIENT_SECRET`
   - `npx wrangler@latest secret put DISCORD_BOT_TOKEN`
   - `npx wrangler@latest secret put SESSION_SECRET`
5. `npx wrangler@latest deploy` でWorkerを公開します。表示されたWorker URLを使って次の設定を行います。
6. Discord Developer Portalの **OAuth2 → General** にRedirect URI `https://<Workerのホスト>/auth/callback` を登録します。
7. `member-api-config.js` の空欄をWorker URL（例: `https://roxycall-member-api.<アカウント>.workers.dev`）に置き換えてコミットします。

GitHub PagesのOriginは `https://26cm0120-alt.github.io` に設定済みです。独自ドメインに変更する場合は `member-api/wrangler.toml` の `SITE_ORIGIN` も同じOriginへ変更してください。DiscordのBot TokenとOAuth Client SecretはWorkerのSecretだけに保存し、ブラウザーへは渡しません。OAuthは `identify` のみを要求し、Worker側でBot APIを使ってサーバー所属を確認します。
