# HazyRoom

> **「繋がりが残らない、だから今を刻めるSNS」**

一時的なコミュニティのためのリアルタイムチャットアプリ。  
ハッカソン・大学のグループワーク・イベントなど、「その場限りの交流」を濃密にするために作られました。  
チャットルームには必ず期限があり、期限が切れると新規投稿は停止。会話の流れだけが記録として残ります。

🔗 **[https://hazyroom.vercel.app](https://hazyroom.vercel.app)**

---

## 機能

- **期限付きチャットルーム** — 作成時に有効期限を設定。残り時間をカウントダウン表示
- **Memory Mode** — 期限終了後は投稿不可になり、ログの閲覧専用モードに自動移行
- **招待コード + QR招待** — URLとQRコードでその場で即参加。招待コードなしでは入室不可
- **リアルタイムチャット** — Supabase Realtime による遅延のないメッセージ同期
- **DM（ダイレクトメッセージ）** — ルーム内メンバーとの個別チャット
- **認証** — メールアドレスによるサインアップ／ログイン
- **PWA対応** — スマートフォンのホーム画面に追加してアプリとして利用可能

---

## セットアップ

### 必要なもの

- Node.js 20 以上

### 手順

```bash
# リポジトリをクローン
git clone <repo-url>
cd three-universities-hackason-2026/client

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を記載

# 開発サーバーを起動
npm run dev
```

Supabase のテーブル・RLS・関数は `docs/database.md` の SQL を Supabase の SQL Editor で実行してください。

---

## 技術スタック

| 種別 | 技術 |
|---|---|
| フロントエンド | Next.js 16 / React 19 / TypeScript |
| スタイリング | Tailwind CSS v4 |
| バックエンド | Supabase（Auth / PostgreSQL / Realtime / RLS） |
| PWA | @ducanh2912/next-pwa / Workbox |
| QRコード | react-qr-code |
| デプロイ | Vercel |

---

## デプロイ

本番環境は Vercel にデプロイしています。

**[https://hazyroom.vercel.app](https://hazyroom.vercel.app)**

in 3大学合同ハッカソン2026
