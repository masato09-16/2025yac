# 🔐 セキュリティ設定ガイド

このドキュメントでは、YNU-TWINプロジェクトのセキュリティ設定について説明します。

---

## 🔑 SECRET_KEY の設定

### 開発環境

開発環境では、SECRET_KEYが設定されていない場合、自動的に生成されます。

```bash
⚠️  WARNING: Using auto-generated SECRET_KEY for development
   Set SECRET_KEY in .env for production!
```

### 本番環境

**必須:** 本番環境では、必ずSECRET_KEYを設定してください。

#### 1. SECRET_KEYを生成

```bash
# PowerShell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

出力例: `xK3mP9nL2vB7qR5wT8jY4fN6hM1sD0gA3cE5bH7kJ9m`

#### 2. .envファイルに追加

```bash
# backend/.env
SECRET_KEY=xK3mP9nL2vB7qR5wT8jY4fN6hM1sD0gA3cE5bH7kJ9m
```

#### 3. Vercelに設定

Vercelダッシュボード → Settings → Environment Variables

```
Name: SECRET_KEY
Value: xK3mP9nL2vB7qR5wT8jY4fN6hM1sD0gA3cE5bH7kJ9m
```

---

## 🌐 CORS設定

### 開発環境

開発環境では、デフォルトでローカルホストからのアクセスを許可します。

### 本番環境

**推奨:** 本番環境では、明示的にオリジンを指定してください。

```bash
# backend/.env
ALLOWED_ORIGINS=https://2025yac.vercel.app,https://ynu-twin.com
```

複数のオリジンはカンマ区切りで指定します。

---

## 🚦 レート制限

デフォルトで以下のレート制限が設定されています:

- **一般API:** 120リクエスト/分/IP
- **ヘルスチェック:** 制限なし

### カスタマイズ

`backend/api/main.py` で変更可能:

```python
app.add_middleware(RateLimitMiddleware, requests_per_minute=120)
```

---

## 🔒 セキュリティヘッダー

以下のセキュリティヘッダーが自動的に追加されます:

- `X-Content-Type-Options: nosniff` - MIMEタイプスニッフィング防止
- `X-Frame-Options: DENY` - クリックジャッキング防止
- `X-XSS-Protection: 1; mode=block` - XSS保護
- `Referrer-Policy: strict-origin-when-cross-origin` - リファラー制御
- `Strict-Transport-Security` - HTTPS強制（本番のみ）
- `Content-Security-Policy` - コンテンツセキュリティポリシー

---

## 📁 .gitignore設定

以下のファイルはGitで追跡されません:

```gitignore
.env
.env.*
!.env.example
!.env.template
```

**重要:** `.env`ファイルに機密情報を保存してください。Gitにコミットされません。

---

## ✅ セキュリティチェックリスト

### デプロイ前

- [ ] SECRET_KEYを32文字以上の強力な値に設定
- [ ] ALLOWED_ORIGINSを本番ドメインのみに制限
- [ ] .envファイルがGitで追跡されていないことを確認
- [ ] HTTPSが有効になっていることを確認

### 定期確認

- [ ] 依存関係の更新（月次）
- [ ] アクセスログの確認（週次）
- [ ] セキュリティヘッダーの動作確認（月次）

---

## 🔍 セキュリティ確認方法

### 1. SECRET_KEYの確認

```bash
cd backend
python -c "from config import settings; print('OK' if len(settings.secret_key) >= 32 else 'NG')"
```

### 2. セキュリティヘッダーの確認

```bash
curl -I https://your-domain.com/api/v1/health
```

以下のヘッダーが含まれていることを確認:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### 3. レート制限の確認

```bash
# 連続でリクエストを送信
for i in {1..130}; do curl https://your-domain.com/api/v1/health; done
```

120回目以降で `429 Too Many Requests` が返されることを確認。

---

## 🆘 トラブルシューティング

### SECRET_KEYエラー

```
ValueError: SECRET_KEY must be set in production environment.
```

**解決方法:** `.env`ファイルにSECRET_KEYを追加してください。

### CORS エラー

```
Access to fetch at 'https://api.example.com' from origin 'https://app.example.com' has been blocked by CORS policy
```

**解決方法:** `ALLOWED_ORIGINS`に`https://app.example.com`を追加してください。

### レート制限エラー

```
429 Too Many Requests: Rate limit exceeded
```

**解決方法:** リクエスト頻度を下げるか、レート制限を緩和してください。

---

## 📞 サポート

セキュリティに関する質問や懸念がある場合は、開発チームにお問い合わせください。

**セキュリティは継続的な取り組みです。定期的にこのガイドを確認してください。🔒**
