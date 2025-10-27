# 環境変数の設定

## フロントエンド（オプション）

プロジェクトルートに`.env`ファイルを作成してください：

```env
# FastAPI Backend URL
VITE_API_URL=http://localhost:8000
```

> **注意**: このファイルは`.gitignore`に含まれています。

デフォルトでは`http://localhost:8000`が使用されるため、**このファイルは作成しなくても動作します**。

---

## バックエンド（オプション）

`backend/`ディレクトリに`.env`ファイルを作成できます：

```env
# Database
DATABASE_URL=sqlite:///./ynu_classrooms.db
DATABASE_ECHO=False

# API Settings
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production

# Camera Settings
CAMERA_ENABLED=True
CAMERA_UPDATE_INTERVAL=5

# CORS (already configured in code)
# ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
```

デフォルト設定で問題ない場合は、**このファイルも作成不要です**。

---

## 本番環境での設定

本番環境にデプロイする場合は、以下を設定してください：

### フロントエンド

```env
VITE_API_URL=https://your-api-domain.com
```

### バックエンド

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
DEBUG=False
SECRET_KEY=強力なランダムキーに変更
CAMERA_ENABLED=True
```

`backend/config.py`の`allowed_origins`も本番ドメインを追加：

```python
allowed_origins: List[str] = [
    "http://localhost:8080",
    "http://localhost:3000",
    "https://your-frontend-domain.com",  # 本番ドメインを追加
]
```

---

## まとめ

✅ **開発環境**: 環境変数ファイルは不要（デフォルト設定で動作）  
✅ **カスタマイズ**: 必要に応じて`.env`ファイルを作成  
✅ **本番環境**: セキュリティのため必ず設定を変更

