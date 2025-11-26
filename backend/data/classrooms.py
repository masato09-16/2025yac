"""
Classroom data loader from JSON
教室データをJSONファイルから読み込む
"""
import json
from pathlib import Path
from typing import List, Dict

# JSONファイルのパス
JSON_FILE = Path(__file__).parent / 'classrooms.json'

def _load_classrooms() -> List[Dict]:
    """JSONファイルから教室データを読み込む"""
    try:
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # JSONファイルが存在しない場合は空のリストを返す
        return []
    except json.JSONDecodeError as e:
        raise ValueError(f"JSONファイルの読み込みに失敗しました: {e}")

# 教室データを読み込む（初回読み込み時）
ALL_CLASSROOMS = _load_classrooms()
