"""
Class schedule data loader from JSON
授業スケジュールデータをJSONファイルから読み込む
"""
import json
from pathlib import Path
from typing import List, Dict
from datetime import time

# JSONファイルのパス
JSON_FILE = Path(__file__).parent / 'schedules.json'

# 時限時間マッピング（横浜国立大学の標準時限）
PERIOD_TIMES = {
    1: (time(8, 50), time(10, 20)),   # 1時限
    2: (time(10, 30), time(12, 0)),   # 2時限
    3: (time(13, 0), time(14, 30)),   # 3時限
    4: (time(14, 40), time(16, 10)),  # 4時限
    5: (time(16, 20), time(17, 50)),  # 5時限
    6: (time(18, 0), time(19, 30)),   # 6時限
    7: (time(19, 40), time(21, 10)),  # 7時限
}

def _load_schedules() -> List[Dict]:
    """JSONファイルから授業スケジュールデータを読み込む"""
    try:
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            schedules = json.load(f)
            
            # 時刻文字列をtimeオブジェクトに変換、または時限から自動設定
            for schedule in schedules:
                period = schedule.get('period')
                
                # start_timeとend_timeが存在しない場合、時限から自動設定
                if 'start_time' not in schedule or not schedule.get('start_time'):
                    if period in PERIOD_TIMES:
                        schedule['start_time'] = PERIOD_TIMES[period][0]
                    else:
                        raise ValueError(f"Invalid period: {period}")
                
                if 'end_time' not in schedule or not schedule.get('end_time'):
                    if period in PERIOD_TIMES:
                        schedule['end_time'] = PERIOD_TIMES[period][1]
                    else:
                        raise ValueError(f"Invalid period: {period}")
                
                # 時刻文字列をtimeオブジェクトに変換
                if isinstance(schedule.get('start_time'), str):
                    start_parts = schedule['start_time'].split(':')
                    schedule['start_time'] = time(int(start_parts[0]), int(start_parts[1]), int(start_parts[2]) if len(start_parts) > 2 else 0)
                if isinstance(schedule.get('end_time'), str):
                    end_parts = schedule['end_time'].split(':')
                    schedule['end_time'] = time(int(end_parts[0]), int(end_parts[1]), int(end_parts[2]) if len(end_parts) > 2 else 0)
            
            return schedules
    except FileNotFoundError:
        # JSONファイルが存在しない場合は空のリストを返す
        return []
    except json.JSONDecodeError as e:
        raise ValueError(f"JSONファイルの読み込みに失敗しました: {e}")

# 授業スケジュールデータを読み込む（初回読み込み時）
SAMPLE_SCHEDULES = _load_schedules()
