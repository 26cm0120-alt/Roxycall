# Roxycall コミュニティポータル

ゲームコミュニティ「ネトゲ廃人ロキシーコール」の公式ポータルです。コミュニティのルール、ニュース、活動記録、メンバー情報を掲載しています。

**サイト:** [https://26cm0120-alt.github.io](https://26cm0120-alt.github.io)

## サイトでできること

- コミュニティのルールやニュースを確認
- 画像・動画で活動記録を閲覧
- メンバーをDiscord参加日順に確認し、ロールで検索
- Discordログイン後、自分の表示名・自己紹介文・プロフィール画像を編集
- プロフィール画像はPNG / JPG / WebP、2MB以下

## 掲載情報と削除依頼

メンバー一覧と公開データには、DiscordユーザーID、サーバー表示名、プロフィール画像、サーバー参加日、ロールが含まれます。本人が設定した表示名・自己紹介文・アップロード画像も公開されます。

掲載停止や情報の修正を希望する本人は、Discordでギルドマスターの **@takken4649** へDMしてください。対象アカウントと希望内容をお知らせください。確認後、メンバー一覧からの除外または情報の修正を行います。

## 仕組み

| サービス | 役割 |
| --- | --- |
| GitHub Pages | HTML・CSS・JavaScriptで作られたサイトを配信 |
| GitHub Actions | Discordのメンバー情報とロールを定期同期 |
| Cloudflare Workers | Discordログインとプロフィール更新API |
| Cloudflare D1 | 自己紹介文、表示名、プロフィール画像情報を保存 |
| Cloudflare R2 | アップロードされたプロフィール画像を保存 |

フロントエンドはフレームワークを使わない静的サイトです。DiscordのBotトークンやOAuth Client SecretはWorkerのSecretに保存し、ブラウザーには渡しません。

## ファイル構成

| パス | 内容 |
| --- | --- |
| `index.html` | ページ構造、ニュース、活動紹介、メンバー編集フォーム |
| `style.css` | デザインとレスポンシブ表示 |
| `script.js` | 画面切り替え、メンバー表示、検索、プロフィール編集 |
| `member-api-config.js` | Cloudflare Workerの接続先 |
| `data/members.json` | Discordから同期した公開メンバー・ロール情報 |
| `data/member-overrides.json` | 旧プロフィールから引き継ぐ紹介文や表示順 |
| `scripts/sync-roles.js` | Discordのメンバー・ロールを取得してJSONを更新 |
| `.github/workflows/sync-discord.yml` | Discord同期を定期・手動実行するワークフロー |
| `member-api/` | Cloudflare Worker、D1マイグレーション、設定 |
| `images/`・`videos/` | サイトで使用する画像・動画 |

## ローカルで表示する

Python 3をインストールした環境で、リポジトリのルートから実行します。

```powershell
python -m http.server 8000
```

ブラウザーで [http://localhost:8000](http://localhost:8000) を開きます。サイトの表示にNode.jsやパッケージのインストールは不要です。Discordログインやプロフィール保存は、設定済みのCloudflare Workerへ接続します。

## Discordメンバー同期

GitHub Actionsは毎日 **18:17 UTC（日本時間 翌日03:17）** に同期します。また、コード変更時と手動実行時にも起動します。

同期対象からはBotアカウント、サブ垢ロールが付いたメンバー、設定されたDiscordユーザーIDが除外されます。名前による除外は行いません。

### BotとGitHub Actionsの設定

1. Discord Developer PortalでBotを作成し、Bot設定の **SERVER MEMBERS INTENT** を有効にします。
2. Botを対象サーバーへ追加します。サーバーIDは `1387350967628075101` です。
3. GitHubリポジトリの **Settings → Secrets and variables → Actions** でRepository secret `GG` にBotトークンを登録します。トークンは公開しないでください。
4. GitHubの **Actions → Sync Discord members and roles → Run workflow** から手動同期できます。

同期結果は `data/members.json` に保存されます。プロフィールの自己紹介文と表示名はD1に保存され、本人がページから更新できます。古いプロフィール情報を手作業で調整する場合は `data/member-overrides.json` を編集します。

## Cloudflare Workerの設定・デプロイ

Cloudflareの既存環境を更新する場合は、PowerShellでリポジトリを最新にしてからWorkerのディレクトリへ移動します。

```powershell
cd $env:USERPROFILE\Documents\Roxycall
git pull
cd member-api
```

### 初回のみ

1. Wranglerにログインします。

   ```powershell
   npx.cmd wrangler@latest login
   ```

2. R2バケットがまだない場合に限り、作成します。

   ```powershell
   npx.cmd wrangler@latest r2 bucket create roxycall-member-avatars
   ```

3. Workerに必要なSecretを登録します。コマンド実行後の入力欄に値を貼り付けます。

   ```powershell
   npx.cmd wrangler@latest secret put DISCORD_CLIENT_SECRET
   npx.cmd wrangler@latest secret put DISCORD_BOT_TOKEN
   npx.cmd wrangler@latest secret put SESSION_SECRET
   ```

   - `DISCORD_CLIENT_SECRET`: Discord Developer PortalのOAuth2 Client Secret
   - `DISCORD_BOT_TOKEN`: Discord Botのトークン
   - `SESSION_SECRET`: 32文字以上のランダムな鍵

4. D1マイグレーションを適用します。

   ```powershell
   npx.cmd wrangler@latest d1 migrations apply roxycall-member-introductions --remote
   ```

5. Discord Developer Portalの **OAuth2 → General** に次のRedirect URIを登録します。

   ```
   https://roxycall-member-api.roxycall261020.workers.dev/auth/callback
   ```

6. `member-api-config.js` にWorker URLが設定されていることを確認します。WorkerのURLを変更した場合は、このファイルとOAuth Redirect URIを更新します。

### Workerの更新

`member-api/` ディレクトリで実行します。

```powershell
npx.cmd wrangler@latest deploy
```

PowerShellでは実行ポリシーの影響を避けるため、`npx` の代わりに `npx.cmd` を使います。新しいD1マイグレーションが追加された場合は、デプロイ前にマイグレーションを適用してください。

### 設定値

現在のWorker設定は `member-api/wrangler.toml` にあります。GitHub PagesのOriginは `https://26cm0120-alt.github.io`、D1とR2のバインディングも設定済みです。サイトのドメインを変更する場合は、`SITE_ORIGIN` とOAuth Redirect URIも合わせて変更してください。
