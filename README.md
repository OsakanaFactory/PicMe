# PicMe�E��Eくみー�E�🎨

**イラストレーターのための簡単�Eートフォリオサイト作�Eサービス**

---

## 📖 プロジェクト概要E
PicMeは、イラストレーターが簡単に自刁E�Eポ�Eトフォリオサイトを作�EできるWebサービスです。�Eログラミングスキルがなくても、E��E��皁E��個性皁E��プロフィールペ�Eジを誰でも作�Eできます、E
### コンセプト
- **Twitterプロフィールのビジュアル拡張牁E*
- ノ�Eコードで簡単にサイト作�E
- 作品の魁E��を最大限に引き出すデザイン
- SNSとシームレスに連携

### ターゲチE��ユーザー
- イラストを描くスキルはあるが、�EログラミングスキルはなぁE��
- SNSで活動してぁE��イラストレーター�E��E忁E��E���Eロまで�E�E- 自刁E�E作品紹介サイトが欲しい人

---

## 📚 ドキュメンチE
### 設計書�E�確定版 - v1.1�E�E
| ドキュメンチE| 説昁E| リンク |
|------------|------|--------|
| **📋 要件定義書** | プロジェクト�E目皁E��ターゲチE��、主要機�E、MVP、�Eラン詳細 | [docs/要件定義書.md](./docs/要件定義書.md) ⭁E|
| **🏗�E�E基本設計書** | シスチE��アーキチE��チャ、データベ�Eス設計、API設訁E| [docs/基本設計書.md](./docs/基本設計書.md) |
| **📐 詳細設計書** | 画面設計、API詳細仕様、エラー処琁E��テストケース | [docs/詳細設計書.md](./docs/詳細設計書.md) |
| **✁E進捗管琁E��タスク�E�E* | 実裁E��スクリスト、フェーズ別進捗管琁E| [docs/進捗管琁E��タスク�E�Emd](./docs/進捗管琁E��タスク�E�Emd) 🚀 |

### 主な決定事頁E
- **プラン構�E**: 4段階フリーミアム�E�Eree / Starter / Pro / Studio�E�E- **収益モチE��**: サブスクリプション + Google AdSense�E�Ereeプランのみ�E�E- **技術スタチE��**: Next.js 15 + Spring Boot 3.x + PostgreSQL 15
- **インフラ**: Vercel�E�フロント！E+ Railway�E�バチE��エンド�EDB�E�E+ Cloudinary�E�画像！E
---

## ✨ 主要機�E

### MVP機�E�E�Ehase 1�E�E- ✁Eユーザー認証�E�メール+パスワード、Twitter/Google OAuth�E�E- ✁E基本プロフィール編雁E��名前、アイコン、�E己紹介！E- ✁E画像ギャラリー�E�作品のアチE�Eロード�E表示�E�E- ✁ESNSリンク管琁E- ✁E公開�Eージ�E�Esername.picme.com�E�E
### Phase 2以陁E- お知らせ・ブログ機�E
- チE�Eマ�EチE��インカスタマイズ
- サブスクリプション機�E�E�有料�Eラン�E�E- アクセス解极E- 独自ドメイン接綁E
---

## 🛠�E�E技術スタチE��

### フロントエンド（推奨�E�E- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**

### バックエンド（確定！E- **Spring Boot 3.x**
- **Spring Security**
- **Spring Data JPA**
- **PostgreSQL**

### インフラ�E�推奨�E�E- **Vercel** (フロントエンチE
- **Railway** (バックエンチE+ DB)
- **Cloudinary** (画像ストレージ)

### 外部サービス
- **Stripe** (決渁E
- **Twitter API** (OAuth)
- **Google OAuth**

---

## 💎 収益モチE��

### 2段階�Eラン�E��E期リリース�E�E
| プラン | 価格 | 主な機�E |
|-------|------|---------|
| **Free** | 無斁E| 基本機�E、画僁E5枚、SNSリンク3個、庁E��表示 |
| **Pro** | ¥680/朁Eor ¥6,800/年 | 庁E��非表示、画像�Eリンク無制限、カスタマイズ、アクセス解极E|

詳細は [monetization-strategy.md](./monetization-strategy.md) を参照、E�E�旧牁E [premium-features-proposal.md](./premium-features-proposal.md)�E�E
---

## 📅 開発スケジュール�E�目安！E
```
2026年1朁E Phase 0�E�事前準備�E�E2026年2月、E朁E Phase 1�E�EVP開発�E�E2026年4朁E Phase 2�E�追加機�E�E�E2026年5朁E Phase 3�E�有料機�E�E�E2026年6朁E Phase 4�E�β版�E開！E2026年7朁E Phase 5�E�正式リリース�E�E```

---

## 🎯 KPI・目樁E
### β版リリース晁E- 登録ユーザー: 100人
- アクチE��ブユーザー: 50人

### 正式リリース征Eヶ朁E- 登録ユーザー: 1,000人
- アクチE��ブユーザー: 500人
- 有料プラン転換率: 10%
- 月間収益: ¥50,000

---

## 🚀 はじめに

### 1. 📋 まず決定事頁E��マリーを読む

プロジェクト�E全体像を素早く把握するには、まずこちらを読んでください�E�E
**⭁E[decisions-summary.md](./decisions-summary.md)** - 確定した技術スタチE��・プラン・戦略のまとめE
### 2. 📚 詳細ドキュメントを読む

さらに詳しく知りたぁE��合�E、以下を頁E��に読んでください�E�E
1. [requirements.md](./requirements.md) - 要件定義
2. [monetization-strategy.md](./monetization-strategy.md) - マネタイゼーション戦略
3. [infrastructure-comparison.md](./infrastructure-comparison.md) - インフラ詳細比輁E4. [system-architecture.md](./system-architecture.md) - シスチE��設訁E5. [next-steps.md](./next-steps.md) - 次のアクション

### 3. 競合�E析を実施する

Linktree、lit.link、Carrd等�E競合サービスを�E析し、差別化�Eイントを明確にします、E
### 4. インフラの最終確誁E
推奨構�E�E�Eercel + Railway + Cloudinary�E�で良ぁE��最終確認します、E詳細は [infrastructure-comparison.md](./infrastructure-comparison.md) を参照、E
### 5. 開発環墁E��セチE��アチE�Eする

[next-steps.md](./next-steps.md) の「Phase 0: 事前準備」を参�Eし、E��発環墁E��構築します、E
### 6. MVP開発を開始すめE
[next-steps.md](./next-steps.md) の「Phase 1: MVP開発」を参�Eし、E��発を進めます、E
---

## 📦 リポジトリ構�E

```
PicMe/
├── frontend/              # Next.js 15 フロントエンチE━E  ├── src/
━E  ━E  ├── app/          # Next.js App Router
━E  ━E  ├── components/   # Reactコンポ�EネンチE━E  ━E  └── lib/          # ユーチE��リチE��
━E  ├── Dockerfile
━E  ├── package.json
━E  └── tsconfig.json
├── backend/               # Spring Boot 3.x バックエンチE━E  ├── src/main/java/com/picme/backend/
━E  ━E  ├── config/       # 設定クラス
━E  ━E  ├── controller/   # コントローラー
━E  ━E  ├── service/      # サービス層
━E  ━E  ├── repository/   # リポジトリ層
━E  ━E  ├── model/        # エンチE��チE��
━E  ━E  ├── dto/          # チE�Eタ転送オブジェクチE━E  ━E  ├── security/     # セキュリチE��
━E  ━E  └── exception/    # 例外�E琁E━E  ├── Dockerfile
━E  └── pom.xml
├── docs/                  # ドキュメンチE━E  ├── 要件定義書.md
━E  ├── 基本設計書.md
━E  ├── 詳細設計書.md
━E  └── 進捗管琁E��タスク�E�Emd
├── docker-compose.yml     # Docker Compose設宁E├── .gitignore
└── README.md
```

---

## 🚀 開発環墁E��チE��アチE�E

### 前提条件

以下�Eソフトウェアがインスト�EルされてぁE��忁E��があります！E
- **Docker Desktop** (最新牁E
- **Git**

### セチE��アチE�E手頁E
#### 1. リポジトリのクローン

```bash
git clone https://github.com/OsakanaFactory/PicMe.git
cd PicMe
```

#### 2. Docker Composeで環墁E��起勁E
```bash
docker-compose up -d
```

これにより、以下�Eサービスが起動します！E
- **PostgreSQL**: `localhost:5432`
- **Spring Boot Backend**: `localhost:8080`
- **Next.js Frontend**: `localhost:3001`

#### 3. 動作確誁E
##### バックエンド�EヘルスチェチE��
```bash
curl http://localhost:8080/api/health
```

期征E��れるレスポンス�E�E```json
{
  "status": "UP",
  "service": "PicMe Backend",
  "version": "0.0.1-SNAPSHOT",
  "database": "Connected",
  "databaseUrl": "jdbc:postgresql://postgres:5432/picme_db"
}
```

##### フロントエンド�E確誁Eブラウザで `http://localhost:3001` を開ぁE
#### 4. ログの確誁E
```bash
# すべてのサービスのログを表示
docker-compose logs -f

# 特定�Eサービスのログを表示
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

#### 5. 停止・再起勁E
```bash
# 停止
docker-compose down

# 再起勁Edocker-compose restart

# チE�Eタベ�Eスを含めて完�Eに削除
docker-compose down -v
```

### トラブルシューチE��ング

#### ポ�Eトが既に使用されてぁE��場吁E
`docker-compose.yml`のポ�Eト番号を変更してください�E�E
```yaml
ports:
  - "3001:3001"  # フロントエンチE  - "8081:8080"  # バックエンチE  - "5433:5432"  # PostgreSQL
```

#### コンチE��がビルドできなぁE��吁E
```bash
# キャチE��ュをクリアして再ビルチEdocker-compose build --no-cache
docker-compose up -d
```

#### チE�Eタベ�Eス接続エラーの場吁E
```bash
# PostgreSQLコンチE��に接続して確誁Edocker-compose exec postgres psql -U picme_user -d picme_db

# チE�Eブル一覧を表示
\dt
```

---

## 🤁E貢献

現在は個人プロジェクトとして開発中です、E
---

## 📄 ライセンス

TBD

---

## 📞 お問ぁE��わせ

- プロジェクトに関する質啁E �E�後で追加�E�E- バグ報呁E �E�後で追加�E�E
---

## 🎉 スチE�Eタス

**現在のフェーズ**: Phase 1�E�EVP開発準備完亁E��E
### Phase 0 完亁E��スク ✁E- ✁E要件定義
- ✁E技術スタチE��提桁E- ✁E技術スタチE��確定！Eext.js + Spring Boot + PostgreSQL�E�E- ✁Eインフラ詳細比輁E��Eercel + Railway + Cloudinary推奨�E�E- ✁E有料プラン設計！Eree + Pro 2段階！E- ✁Eマネタイゼーション戦略�E�課金俁E��の忁E��学皁E��法！E- ✁EシスチE��アーキチE��チャ設訁E- ✁E開発計画策宁E- ✁E**Gitリポジトリ初期化�EGitHub接綁E*
- ✁E**Docker Compose環墁E��篁E*
- ✁E**Spring Boot 3.x プロジェクト作�E�E�Eaven�E�E*
- ✁E**Next.js 15 プロジェクト作�E�E�EailwindCSS�E�E*
- ✁E**PostgreSQL環墁E��篁E*
- ✁E**開発環墁E��チE��アチE�E手頁E��加**

### 次のタスク�E�Ehase 1�E�E- [ ] ユーザー認証機�Eの実裁E- [ ] プロフィール機�Eの実裁E- [ ] 作品ギャラリー機�Eの実裁E- [ ] SNSリンク管琁E���Eの実裁E- [ ] 公開�Eージ機�Eの実裁E
詳細は [docs/進捗管琁E��タスク�E�Emd](./docs/進捗管琁E��タスク�E�Emd) を参照してください、E
---

**Let's build something amazing! 🚀**
