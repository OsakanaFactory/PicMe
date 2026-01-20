# PicMe（ぴくみー）🎨

**イラストレーターのための簡単ポートフォリオサイト作成サービス**

---

## 📖 プロジェクト概要

PicMeは、イラストレーターが簡単に自分のポートフォリオサイトを作成できるWebサービスです。プログラミングスキルがなくても、魅力的で個性的なプロフィールページを誰でも作成できます。

### コンセプト
- **Twitterプロフィールのビジュアル拡張版**
- ノーコードで簡単にサイト作成
- 作品の魅力を最大限に引き出すデザイン
- SNSとシームレスに連携

### ターゲットユーザー
- イラストを描くスキルはあるが、プログラミングスキルはない人
- SNSで活動しているイラストレーター（初心者〜プロまで）
- 自分の作品紹介サイトが欲しい人

---

## 📚 ドキュメント

### 設計書（確定版 - v1.1）

| ドキュメント | 説明 | リンク |
|------------|------|--------|
| **📋 要件定義書** | プロジェクトの目的、ターゲット、主要機能、MVP、プラン詳細 | [docs/要件定義書.md](./docs/要件定義書.md) ⭐ |
| **🏗️ 基本設計書** | システムアーキテクチャ、データベース設計、API設計 | [docs/基本設計書.md](./docs/基本設計書.md) |
| **📐 詳細設計書** | 画面設計、API詳細仕様、エラー処理、テストケース | [docs/詳細設計書.md](./docs/詳細設計書.md) |
| **✅ 進捗管理（タスク）** | 実装タスクリスト、フェーズ別進捗管理 | [docs/進捗管理（タスク）.md](./docs/進捗管理（タスク）.md) 🚀 |

### 主な決定事項

- **プラン構成**: 4段階フリーミアム（Free / Starter / Pro / Studio）
- **収益モデル**: サブスクリプション + Google AdSense（Freeプランのみ）
- **技術スタック**: Next.js 15 + Spring Boot 3.x + PostgreSQL 15
- **インフラ**: Vercel（フロント） + Railway（バックエンド・DB） + Cloudinary（画像）

---

## ✨ 主要機能

### MVP機能（Phase 1）
- ✅ ユーザー認証（メール+パスワード、Twitter/Google OAuth）
- ✅ 基本プロフィール編集（名前、アイコン、自己紹介）
- ✅ 画像ギャラリー（作品のアップロード・表示）
- ✅ SNSリンク管理
- ✅ 公開ページ（username.picme.com）

### Phase 2以降
- お知らせ・ブログ機能
- テーマ・デザインカスタマイズ
- サブスクリプション機能（有料プラン）
- アクセス解析
- 独自ドメイン接続

---

## 🛠️ 技術スタック

### フロントエンド（推奨）
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**

### バックエンド（確定）
- **Spring Boot 3.x**
- **Spring Security**
- **Spring Data JPA**
- **PostgreSQL**

### インフラ（推奨）
- **Vercel** (フロントエンド)
- **Railway** (バックエンド + DB)
- **Cloudinary** (画像ストレージ)

### 外部サービス
- **Stripe** (決済)
- **Twitter API** (OAuth)
- **Google OAuth**

---

## 💎 収益モデル

### 2段階プラン（初期リリース）

| プラン | 価格 | 主な機能 |
|-------|------|---------|
| **Free** | 無料 | 基本機能、画像15枚、SNSリンク3個、広告表示 |
| **Pro** | ¥680/月 or ¥6,800/年 | 広告非表示、画像・リンク無制限、カスタマイズ、アクセス解析 |

詳細は [monetization-strategy.md](./monetization-strategy.md) を参照。
（旧版: [premium-features-proposal.md](./premium-features-proposal.md)）

---

## 📅 開発スケジュール（目安）

```
2026年1月: Phase 0（事前準備）
2026年2月〜3月: Phase 1（MVP開発）
2026年4月: Phase 2（追加機能）
2026年5月: Phase 3（有料機能）
2026年6月: Phase 4（β版公開）
2026年7月: Phase 5（正式リリース）
```

---

## 🎯 KPI・目標

### β版リリース時
- 登録ユーザー: 100人
- アクティブユーザー: 50人

### 正式リリース後3ヶ月
- 登録ユーザー: 1,000人
- アクティブユーザー: 500人
- 有料プラン転換率: 10%
- 月間収益: ¥50,000

---

## 🚀 はじめに

### 1. 📋 まず決定事項サマリーを読む

プロジェクトの全体像を素早く把握するには、まずこちらを読んでください：

**⭐ [decisions-summary.md](./decisions-summary.md)** - 確定した技術スタック・プラン・戦略のまとめ

### 2. 📚 詳細ドキュメントを読む

さらに詳しく知りたい場合は、以下を順番に読んでください：

1. [requirements.md](./requirements.md) - 要件定義
2. [monetization-strategy.md](./monetization-strategy.md) - マネタイゼーション戦略
3. [infrastructure-comparison.md](./infrastructure-comparison.md) - インフラ詳細比較
4. [system-architecture.md](./system-architecture.md) - システム設計
5. [next-steps.md](./next-steps.md) - 次のアクション

### 3. 競合分析を実施する

Linktree、lit.link、Carrd等の競合サービスを分析し、差別化ポイントを明確にします。

### 4. インフラの最終確認

推奨構成（Vercel + Railway + Cloudinary）で良いか最終確認します。
詳細は [infrastructure-comparison.md](./infrastructure-comparison.md) を参照。

### 5. 開発環境をセットアップする

[next-steps.md](./next-steps.md) の「Phase 0: 事前準備」を参照し、開発環境を構築します。

### 6. MVP開発を開始する

[next-steps.md](./next-steps.md) の「Phase 1: MVP開発」を参照し、開発を進めます。

---

## 📦 リポジトリ構成

```
PicMe/
├── frontend/              # Next.js 15 フロントエンド
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # Reactコンポーネント
│   │   └── lib/          # ユーティリティ
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── backend/               # Spring Boot 3.x バックエンド
│   ├── src/main/java/com/picme/backend/
│   │   ├── config/       # 設定クラス
│   │   ├── controller/   # コントローラー
│   │   ├── service/      # サービス層
│   │   ├── repository/   # リポジトリ層
│   │   ├── model/        # エンティティ
│   │   ├── dto/          # データ転送オブジェクト
│   │   ├── security/     # セキュリティ
│   │   └── exception/    # 例外処理
│   ├── Dockerfile
│   └── pom.xml
├── docs/                  # ドキュメント
│   ├── 要件定義書.md
│   ├── 基本設計書.md
│   ├── 詳細設計書.md
│   └── 進捗管理（タスク）.md
├── docker-compose.yml     # Docker Compose設定
├── .gitignore
└── README.md
```

---

## 🚀 開発環境セットアップ

### 前提条件

以下のソフトウェアがインストールされている必要があります：

- **Docker Desktop** (最新版)
- **Git**

### セットアップ手順

#### 1. リポジトリのクローン

```bash
git clone https://github.com/OsakanaFactory/PicMe.git
cd PicMe
```

#### 2. Docker Composeで環境を起動

```bash
docker-compose up -d
```

これにより、以下のサービスが起動します：

- **PostgreSQL**: `localhost:5432`
- **Spring Boot Backend**: `localhost:8080`
- **Next.js Frontend**: `localhost:3000`

#### 3. 動作確認

##### バックエンドのヘルスチェック
```bash
curl http://localhost:8080/api/health
```

期待されるレスポンス：
```json
{
  "status": "UP",
  "service": "PicMe Backend",
  "version": "0.0.1-SNAPSHOT",
  "database": "Connected",
  "databaseUrl": "jdbc:postgresql://postgres:5432/picme_db"
}
```

##### フロントエンドの確認
ブラウザで `http://localhost:3000` を開く

#### 4. ログの確認

```bash
# すべてのサービスのログを表示
docker-compose logs -f

# 特定のサービスのログを表示
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

#### 5. 停止・再起動

```bash
# 停止
docker-compose down

# 再起動
docker-compose restart

# データベースを含めて完全に削除
docker-compose down -v
```

### トラブルシューティング

#### ポートが既に使用されている場合

`docker-compose.yml`のポート番号を変更してください：

```yaml
ports:
  - "3001:3000"  # フロントエンド
  - "8081:8080"  # バックエンド
  - "5433:5432"  # PostgreSQL
```

#### コンテナがビルドできない場合

```bash
# キャッシュをクリアして再ビルド
docker-compose build --no-cache
docker-compose up -d
```

#### データベース接続エラーの場合

```bash
# PostgreSQLコンテナに接続して確認
docker-compose exec postgres psql -U picme_user -d picme_db

# テーブル一覧を表示
\dt
```

---

## 🤝 貢献

現在は個人プロジェクトとして開発中です。

---

## 📄 ライセンス

TBD

---

## 📞 お問い合わせ

- プロジェクトに関する質問: （後で追加）
- バグ報告: （後で追加）

---

## 🎉 ステータス

**現在のフェーズ**: Phase 1（MVP開発準備完了）

### Phase 0 完了タスク ✅
- ✅ 要件定義
- ✅ 技術スタック提案
- ✅ 技術スタック確定（Next.js + Spring Boot + PostgreSQL）
- ✅ インフラ詳細比較（Vercel + Railway + Cloudinary推奨）
- ✅ 有料プラン設計（Free + Pro 2段階）
- ✅ マネタイゼーション戦略（課金促進の心理学的手法）
- ✅ システムアーキテクチャ設計
- ✅ 開発計画策定
- ✅ **Gitリポジトリ初期化・GitHub接続**
- ✅ **Docker Compose環境構築**
- ✅ **Spring Boot 3.x プロジェクト作成（Maven）**
- ✅ **Next.js 15 プロジェクト作成（TailwindCSS）**
- ✅ **PostgreSQL環境構築**
- ✅ **開発環境セットアップ手順追加**

### 次のタスク（Phase 1）
- [ ] ユーザー認証機能の実装
- [ ] プロフィール機能の実装
- [ ] 作品ギャラリー機能の実装
- [ ] SNSリンク管理機能の実装
- [ ] 公開ページ機能の実装

詳細は [docs/進捗管理（タスク）.md](./docs/進捗管理（タスク）.md) を参照してください。

---

**Let's build something amazing! 🚀**
