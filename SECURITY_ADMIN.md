# 🔒 管理画面セキュリティガイド

## ⚠️ 重要：不特定多数のユーザーが使用するアプリのセキュリティ

YNU-TWINは公開アプリのため、管理画面を適切に保護する必要があります。

---

## 🛡️ 現在のセキュリティ対策

### 1. 推測しにくいURLパス

管理画面のURLを単純な `/admin` から推測困難なパスに変更しました：

```
❌ http://localhost:8080/admin （誰でも推測可能）
✅ http://localhost:8080/ynu-admin-panel-secure-9x7k2m （推測困難）
```

**このURLは秘密にしてください！**

---

## 🔐 URLをカスタマイズする方法（推奨）

セキュリティを強化するため、独自のURLに変更することを**強く推奨**します。

### 手順

1. `client/App.tsx` を開く

2. 以下の行を見つけて変更：

```typescript
// 🔒 セキュリティ: 管理画面のルートを推測しにくいものに設定
// この値は秘密にしてください！変更することを推奨します。
const ADMIN_SECRET_PATH = "/ynu-admin-panel-secure-9x7k2m";
```

3. 独自のランダムな文字列に変更：

```typescript
// 例1: 長くて推測困難
const ADMIN_SECRET_PATH = "/ynu-secret-dashboard-k8p3m9x2vL4n";

// 例2: ランダムなハッシュ風
const ADMIN_SECRET_PATH = "/admin-3f7a9c2e8b1d4f6a";

// 例3: 意味のある文字列 + ランダム
const ADMIN_SECRET_PATH = "/ynu-staff-only-x9k2m5p7";
```

### 推奨される命名規則

✅ **良い例:**
- 長い（20文字以上）
- 数字と英字の組み合わせ
- 大文字小文字を混在
- 推測できない

```
/ynu-management-pL9kX3mN8vB2qR5
/secure-admin-dashboard-7kP3xM9nL2
/staff-control-panel-8mK4pX7nQ3wR
```

❌ **悪い例:**
- `/admin` （一般的すぎる）
- `/管理` （推測しやすい）
- `/control` （短すぎる）
- `/ynu-admin` （推測可能）

---

## 🎲 ランダムなURLを生成する

### PowerShellで生成

```powershell
# ランダムな英数字を生成
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 16 | % {[char]$_})
```

実行すると：`kP3mX9nL2vB7qR5w` のような文字列が生成されます。

これを使って：
```typescript
const ADMIN_SECRET_PATH = "/ynu-admin-kP3mX9nL2vB7qR5w";
```

---

## 📋 管理者への共有方法

### 方法1: 直接伝える
- 管理者だけに口頭またはメールで伝える
- **公開チャット、Slack、Gitなどには書かない**

### 方法2: 環境変数を使用（上級）

より安全に管理したい場合：

1. `.env` ファイルを作成（`.gitignore` に追加）：
```
VITE_ADMIN_PATH=/your-secret-path-here
```

2. `client/App.tsx` を修正：
```typescript
const ADMIN_SECRET_PATH = import.meta.env.VITE_ADMIN_PATH || "/fallback-path";
```

3. サーバー管理者だけが `.env` ファイルを管理

---

## 🚨 セキュリティレベル比較

| レベル | 対策 | セキュリティ | 実装難易度 |
|--------|------|--------------|------------|
| **レベル1** | `/admin` | ⭐☆☆☆☆ | ⭐☆☆☆☆ |
| **レベル2** | 推測困難なURL | ⭐⭐⭐☆☆ | ⭐☆☆☆☆ |
| **レベル3** | URL + 環境変数 | ⭐⭐⭐⭐☆ | ⭐⭐☆☆☆ |
| **レベル4** | Basic認証 | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ |
| **レベル5** | ログイン機能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**現在のレベル: レベル2**

---

## 🎯 推奨される追加セキュリティ対策

### 短期（すぐできる）

1. ✅ **URLをカスタマイズ**（上記の手順）
2. **アクセスログの監視**
   ```powershell
   docker-compose logs -f backend
   ```
   不審なアクセスがないか定期的に確認

3. **URLを絶対に公開しない**
   - GitHub にコミットしない
   - Slack やメールで共有しない
   - スクリーンショットに写さない

### 中期（実装が必要）

4. **Basic認証の追加**
   - ユーザー名とパスワードでの保護
   - Nginxまたはバックエンドで実装

5. **IPアドレス制限**
   - 学内ネットワークからのみアクセス可能に
   - Docker または Nginx で設定

### 長期（本格的な対策）

6. **ログイン機能の実装**
   - ユーザー管理
   - セッション管理
   - パスワード暗号化

7. **2要素認証（2FA）**
   - メールまたはアプリでの認証コード

8. **監査ログ**
   - 誰がいつ何を変更したか記録

---

## 🔍 セキュリティチェックリスト

本番環境にデプロイする前に確認：

- [ ] 管理画面のURLを独自のものに変更した
- [ ] URLを20文字以上にした
- [ ] URLを秘密にした（Gitにコミットしていない）
- [ ] 管理者だけがURLを知っている
- [ ] HTTPSを使用している（http:// ではなく https://）
- [ ] アクセスログを確認できる
- [ ] 不要なエンドポイントを削除した
- [ ] CORS設定を確認した

---

## 🚨 もし不正アクセスが疑われたら

### 即座に行うこと

1. **URLを変更**
   - `client/App.tsx` の `ADMIN_SECRET_PATH` を新しい値に変更
   - 再ビルド・再デプロイ

2. **ログを確認**
   ```powershell
   docker-compose logs backend | findstr POST
   ```

3. **データベースをチェック**
   ```powershell
   docker-compose exec backend python -c "
   from database.session import SessionLocal
   from database.models.schedule import ClassSchedule
   db = SessionLocal()
   schedules = db.query(ClassSchedule).all()
   for s in schedules:
       print(f'{s.id}: {s.class_name}')
   "
   ```

4. **不審なデータを削除**
   管理画面から不正な授業スケジュールを削除

---

## 💼 組織での運用ガイド

### 管理者の指定

- **メイン管理者**: URLを知っている（1〜2名）
- **サブ管理者**: 必要時のみURLを共有
- **一般ユーザー**: URLを知らない

### URLの共有方法

```
件名: YNU-TWIN 管理画面アクセス情報

担当者各位

YNU-TWIN管理画面のアクセス情報をお送りします。
この情報は機密情報として取り扱ってください。

URL: http://localhost:8080/ynu-admin-panel-secure-9x7k2m
（実際のURLに置き換えてください）

注意事項:
- このURLを他の人に共有しないでください
- スクリーンショットを撮る際は注意してください
- 公共の場所でアクセスしないでください

よろしくお願いいたします。
```

---

## 📞 サポート

セキュリティに関する質問や懸念がある場合は、開発チームにお問い合わせください。

---

**セキュリティは継続的な取り組みです。定期的にこのガイドを確認してください。🔒**

