# データ管理ガイド

このディレクトリには、システムで使用するデータがJSON形式で保存されています。

## ファイル構成

- `classrooms.json` - 教室データ
- `schedules.json` - 授業スケジュールデータ

## データ形式

### classrooms.json

教室データのJSON配列です。各教室は以下の形式です：

```json
{
  "id": "edu6-101",
  "roomNumber": "6-101",
  "buildingId": "edu-6",
  "faculty": "education",
  "floor": 1,
  "capacity": 60,
  "hasProjector": true,
  "hasWifi": true,
  "hasPowerOutlets": true
}
```

#### フィールド説明

- `id`: 教室の一意なID（必須）
- `roomNumber`: 部屋番号（例: "6-101"）
- `buildingId`: 建物ID（例: "edu-6"）
- `faculty`: 学部（"education", "engineering", "economics", "business", "urban-sciences"）
- `floor`: 階層（数値）
- `capacity`: 定員（数値）
- `hasProjector`: プロジェクターの有無（true/false）
- `hasWifi`: Wi-Fiの有無（true/false）
- `hasPowerOutlets`: 電源コンセントの有無（true/false）

### schedules.json

授業スケジュールデータのJSON配列です。各授業は以下の形式です：

```json
{
  "id": "sched-edu6-101-mon-1",
  "classroom_id": "edu6-101",
  "class_name": "教育心理学",
  "instructor": "田中 教授",
  "day_of_week": 0,
  "period": 1,
  "start_time": "08:50:00",
  "end_time": "10:20:00",
  "semester": "前期",
  "course_code": null
}
```

#### フィールド説明

- `id`: 授業スケジュールの一意なID（必須）
- `classroom_id`: 教室ID（必須）
- `class_name`: 授業名（必須）
- `instructor`: 教員名（オプション）
- `day_of_week`: 曜日（0=月曜日, 1=火曜日, ..., 6=日曜日）
- `period`: 時限（1-7）
- `start_time`: 開始時刻（"HH:MM:SS"形式）
- `end_time`: 終了時刻（"HH:MM:SS"形式）
- `semester`: 学期（"前期", "後期", "通年"、オプション）
- `course_code`: 授業コード（オプション）

## 編集方法

### 1. 直接編集

JSONファイルを直接編集できます。エディタで開いて、必要な変更を加えてください。

**注意**: JSONの構文エラーに注意してください。カンマの位置、引用符の閉じ忘れなどに気をつけてください。

### 2. 管理画面から編集

ブラウザで管理画面（`/admin`）にアクセスして、教室や授業を追加・編集・削除できます。

### 3. データベース初期化

JSONファイルを編集した後、データベースを再初期化する必要がある場合があります：

```bash
cd backend
.\venv\Scripts\Activate.ps1
python -m utils.db_init
```

## 時限時間

標準的な時限時間は以下の通りです：

- 1時限: 08:50 - 10:20
- 2時限: 10:30 - 12:00
- 3時限: 13:00 - 14:30
- 4時限: 14:40 - 16:10
- 5時限: 16:20 - 17:50
- 6時限: 18:00 - 19:30
- 7時限: 19:40 - 21:10

## バックアップ

重要なデータなので、定期的にバックアップを取ることをお勧めします。

```bash
# バックアップの作成
cp data/classrooms.json data/classrooms.json.backup
cp data/schedules.json data/schedules.json.backup
```

## トラブルシューティング

### JSON構文エラー

JSONファイルに構文エラーがある場合、Pythonスクリプトがエラーを出します。JSONバリデーターを使用して確認してください。

### データが読み込まれない

- JSONファイルのパスが正しいか確認してください
- ファイルのエンコーディングがUTF-8であることを確認してください
- Pythonのインポートエラーがないか確認してください

