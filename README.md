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
