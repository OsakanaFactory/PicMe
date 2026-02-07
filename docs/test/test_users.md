# テストユーザー一覧

**作成日**: 2026-02-02
**最終更新日**: 2026-02-02

---

## 概要

開発・テスト環境で使用するテストユーザーの一覧です。
アプリケーション起動時に自動作成されます（本番環境除く）。

---

## テストユーザー

### 一般ユーザー

| ユーザー名 | メールアドレス | パスワード | プラン | 権限 |
|-----------|---------------|-----------|--------|------|
| testuser | testuser@example.com | Test1234! | FREE | ROLE_USER |
| starter_user | starter@example.com | Test1234! | STARTER | ROLE_USER |
| pro_user | pro@example.com | Test1234! | PRO | ROLE_USER |
| studio_user | studio@example.com | Test1234! | STUDIO | ROLE_USER |

### 管理者ユーザー

| ユーザー名 | メールアドレス | パスワード | プラン | 権限 |
|-----------|---------------|-----------|--------|------|
| admin | admin@example.com | Admin1234! | STUDIO | ROLE_ADMIN |

---

## プラン別制限

| 項目 | FREE | STARTER | PRO | STUDIO |
|-----|------|---------|-----|--------|
| ギャラリー画像 | 5枚 | 20枚 | 50枚 | 200枚 |
| SNSリンク | 2個 | 5個 | 10個 | 無制限 |
| お知らせ投稿 | 1件 | 5件 | 20件 | 無制限 |
| カテゴリー | - | - | 5個 | 無制限 |
| タグ | - | - | 使用可 | 使用可 |

---

## 権限

| 権限 | 説明 |
|-----|------|
| ROLE_USER | 一般ユーザー。ダッシュボード、作品管理等が使用可能 |
| ROLE_ADMIN | 管理者。管理画面（/admin/**）へのアクセス可能 |

---

## 公開ページURL

各テストユーザーの公開ポートフォリオページ:

- FREE: http://localhost:3001/testuser
- STARTER: http://localhost:3001/starter_user
- PRO: http://localhost:3001/pro_user
- STUDIO: http://localhost:3001/studio_user
- 管理者: http://localhost:3001/admin

---

## API認証方法

### ログイン

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "Test1234!"}'
```

### 認証付きリクエスト

```bash
curl -X GET http://localhost:8080/api/profile \
  -H "Authorization: Bearer <access_token>"
```

---

## 注意事項

- テストユーザーは開発環境（`!prod`プロファイル）でのみ自動作成されます
- 本番環境では手動でのユーザー作成が必要です
- パスワードは本番環境では使用しないでください
