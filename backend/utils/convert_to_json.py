"""
Convert Python data files to JSON format
"""
import json
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from data.classrooms import ALL_CLASSROOMS
from data.schedules import SAMPLE_SCHEDULES
from database.models.schedule import PERIOD_TIMES

def convert_classrooms():
    """Convert classrooms data to JSON"""
    data = []
    for c in ALL_CLASSROOMS:
        data.append({
            'id': c['id'],
            'roomNumber': c['roomNumber'],
            'buildingId': c['buildingId'],
            'faculty': c['faculty'],
            'floor': c['floor'],
            'capacity': c['capacity'],
            'hasProjector': c['hasProjector'],
            'hasWifi': c['hasWifi'],
            'hasPowerOutlets': c['hasPowerOutlets']
        })
    
    output_path = Path(__file__).parent.parent / 'data' / 'classrooms.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✓ Converted {len(data)} classrooms to {output_path}")

def convert_schedules():
    """Convert schedules data to JSON"""
    data = []
    for s in SAMPLE_SCHEDULES:
        # Convert time objects to strings
        start_time = s['start_time']
        end_time = s['end_time']
        if hasattr(start_time, 'strftime'):
            start_time = start_time.strftime('%H:%M:%S')
        if hasattr(end_time, 'strftime'):
            end_time = end_time.strftime('%H:%M:%S')
        
        data.append({
            'id': s['id'],
            'classroom_id': s['classroom_id'],
            'class_name': s['class_name'],
            'instructor': s.get('instructor'),
            'day_of_week': s['day_of_week'],
            'period': s['period'],
            'start_time': start_time,
            'end_time': end_time,
            'semester': s.get('semester'),
            'course_code': s.get('course_code')
        })
    
    output_path = Path(__file__).parent.parent / 'data' / 'schedules.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✓ Converted {len(data)} schedules to {output_path}")

if __name__ == '__main__':
    convert_classrooms()
    convert_schedules()
    print("\n✓ All data converted to JSON format!")

