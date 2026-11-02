# Roxycall コミュニティポータル

ゲームコミュニティ「ネトゲ廃人ロキシーコール」の公式ポータルです。ギルドルール、ニュース、活動記録、Discordメンバーのプロフィールを掲載しています。

**サイト:** [https://26cm0120-alt.github.io](https://26cm0120-alt.github.io)

## サイトでできること

- コミュニティのルール、ニュース、活動記録を確認
- Discordのメンバーをサーバー参加日順に表示し、ロールで絞り込み
- Discordログイン後、自分の表示名・自己紹介文・プロフィール画像を編集
- プロフィール画像をPNG、JPG、WebP形式でアップロード（2MB以下）

## 掲載情報と削除依頼

メンバー一覧と公開データには、DiscordユーザーID、サーバー表示名、プロフィール画像、サーバー参加日、ロールが含まれます。本人が設定した表示名、自己紹介文、アップロード画像も公開されます。

掲載停止や情報の修正を希望する本人は、Discordでギルドマスターの **@takken4649** へDMしてください。対象アカウントと希望内容をお知らせください。確認後、メンバー一覧からの除外または情報の修正を行います。

## 仕組み

| サービス | 役割 |
| --- | --- |
| GitHub Pages | HTML、CSS、JavaScriptで作られたサイトを配信 |
| GitHub Actions | Discordのメンバーとロールを定期・手動同期 |
| Cloudflare Workers | Discordログイン、メンバー確認、プロフィールAPI |
| Cloudflare D1 | 自己紹介文、表示名、アップロード画像の更新情報を保存 |
| Cloudflare R2 | アップロードされたプロフィール画像を保存 |

フロントエンドはフレームワークを使わない静的サイトです。Discord Botトークン、OAuth Client Secret、セッション鍵はCloudflare WorkerのSecretとして管理し、ブラウザーには渡しません。

## データと同期

- `data/members.json` はDiscordから同期した公開メンバー・ロール情報です。プロフィール画像はDiscordのアバターを使います。
- `data/member-overrides.json` はDiscordユーザーIDごとの既存紹介文を引き継ぐためのデータです。表示順の管理には使いません。
- 本人がサイトで変更した表示名、自己紹介文、プロフィール画像はCloudflare D1/R2に保存され、公開一覧へ反映されます。
- 自己紹介文が未入力のメンバーには「自己紹介は準備中です。」と表示します。これは本人の経歴や好みを推測した文章ではありません。
- APIは現在の公開メンバーに含まれるユーザーだけにプロフィール情報を返します。公開対象から外れたメンバーのD1情報は、追加された個別マイグレーションで削除します。
- Botアカウント、サブ垢ロールが付いたメンバー、および設定されたDiscordユーザーIDは同期対象から除外します。名前の部分一致では除外しません。
- ロールやニックネームの更新は毎日の同期後に反映されます。本人が行うプロフィール変更は保存後すぐ反映されます。
- 同期が成功しても内容に差分がなければ、不要なデータ更新やコミットは行いません。

## ファイル構成

| パス | 内容 |
| --- | --- |
| `index.html` | ページ構造、掲載情報、プロフィール編集フォーム、Content Security Policy |
| `style.css` | デザインとレスポンシブ表示 |
| `script.js` | ページ切り替え、メンバー表示、検索、プロフィール編集 |
| `member-api-config.js` | Cloudflare Workerの接続先 |
| `data/members.json` | Discordと同期した公開メンバー・ロール情報 |
| `data/member-overrides.json` | DiscordユーザーIDごとの既存紹介文 |
| `scripts/sync-roles.js` | Discordのメンバー・ロールを取得してJSONを更新 |
| `.github/workflows/sync-discord.yml` | Discord同期の定期・手動実行設定 |
| `member-api/` | Cloudflare Worker、D1マイグレーション、Wrangler設定 |
| `images/`・`videos/` | サイト内で使う画像・動画 |

## ローカルで表示する

Python 3がインストールされた環境で、リポジトリのルートから実行します。

```powershell
python -m http.server 8000
```

ブラウザーで [http://localhost:8000](http://localhost:8000) を開きます。静的ページの表示にはNode.jsやパッケージのインストールは不要です。プロフィールAPIは本番サイトのOriginに制限されているため、ログインやプロフィール保存は公開サイトで確認してください。

## Discordメンバー同期の設定

GitHub Actionsは毎日 **18:17 UTC（日本時間 翌日03:17）** に同期します。GitHub Actions画面からの手動実行にも対応しています。また、指定された同期関連ファイルが `main` に更新された場合も実行されます。

### BotとGitHub Actions

1. Discord Developer PortalでBotを作成し、Bot設定の **SERVER MEMBERS INTENT** を有効にします。
2. Botを対象サーバーへ追加します。対象サーバーIDは `1387350967628075101` です。
3. GitHubリポジトリの **Settings → Secrets and variables → Actions** でRepository secret `GG` にBotトークンを登録します。トークンは公開しないでください。
4. 同じ画面でRepository secret `EXCLUDED_MEMBER_IDS` を作成し、同期から除外するDiscordユーザーIDをカンマ区切りで登録します。値が空・不正の場合、同期スクリプトは停止して除外対象が再掲載されるのを防ぎます。
5. GitHubの **Actions → Sync Discord members and roles → Run workflow** から手動同期できます。

同期結果は `data/members.json` に保存され、差分があればGitHub Actionsがコミットします。自己紹介文の初期データは `data/member-overrides.json` で引き継がれます。その後、本人がサイトで編集した内容はD1に保存されます。

## Cloudflare Workerの初期設定

すでに設定済みの環境を更新する場合は、「Workerの更新」へ進んでください。初回構築時は、リポジトリのルートからPowerShellでWorkerのディレクトリへ移動します。

```powershell
cd $env:USERPROFILE\Documents\Roxycall
cd member-api
```

1. Wranglerにログインします。

   ```powershell
   npx.cmd wrangler@latest login
   ```

2. R2バケットがまだない場合に限り、作成します。

   ```powershell
   npx.cmd wrangler@latest r2 bucket create roxycall-member-avatars
   ```

3. WorkerにSecretを登録します。各コマンド実行後に表示される入力欄へ値を貼り付けます。

   ```powershell
   npx.cmd wrangler@latest secret put DISCORD_CLIENT_SECRET
   npx.cmd wrangler@latest secret put DISCORD_BOT_TOKEN
   npx.cmd wrangler@latest secret put SESSION_SECRET
   ```

   - `DISCORD_CLIENT_SECRET`: Discord Developer PortalのOAuth2 Client Secret
   - `DISCORD_BOT_TOKEN`: Discord Botのトークン
   - `SESSION_SECRET`: 32文字以上のランダムな鍵

4. D1のマイグレーションを適用します。

   ```powershell
   npx.cmd wrangler@latest d1 migrations apply roxycall-member-introductions --remote
   ```

5. Discord Developer PortalのOAuth2設定に、次のRedirect URIを登録します。

   ```
   https://roxycall-member-api.roxycall261020.workers.dev/auth/callback
   ```

6. `member-api-config.js` と `member-api/wrangler.toml` のWorker URL、Client ID、Guild IDを確認します。

## Workerの更新

GitHubから最新コードを取得し、Workerディレクトリでデプロイします。

```powershell
cd $env:USERPROFILE\Documents\Roxycall
git pull
cd member-api
npx.cmd wrangler@latest deploy
```

PowerShellでは実行ポリシーの影響を避けるため、`npx` の代わりに `npx.cmd` を使います。新しいD1マイグレーションが追加された場合は、デプロイ前にリモートへ適用してください。今回追加した `0004_remove_stale_profile.sql` も、次のコマンドで適用します。

```powershell
npx.cmd wrangler@latest d1 migrations apply roxycall-member-introductions --remote
```

このマイグレーションは一覧外の該当プロフィールの自己紹介文、表示名、R2アバター管理行を削除します。R2オブジェクト自体が存在する場合は、Cloudflare R2の `roxycall-member-avatars` バケットで `avatars/<DiscordユーザーID>` を削除してください。Worker更新後は一覧外の画像はAPIから配信されません。

Worker URLを変更した場合は、Discord OAuth2 Redirect URI、`member-api-config.js`、`member-api/wrangler.toml`、`index.html` のContent Security Policy（CSP）許可先を合わせて更新します。
