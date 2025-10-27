"""
Class schedule seed data
授業スケジュールのサンプルデータ
"""
from datetime import time
from database.models.schedule import PERIOD_TIMES

# Sample class schedules for YNU classrooms
SAMPLE_SCHEDULES = [
    # ============= 教育学部 =============
    
    # 教育学部講義棟6号館
    {
        "id": "sched-edu6-101-mon-1",
        "classroom_id": "edu6-101",
        "class_name": "教育心理学",
        "instructor": "田中 教授",
        "day_of_week": 0,  # Monday
        "period": 1,
        "start_time": PERIOD_TIMES[1][0],
        "end_time": PERIOD_TIMES[1][1],
        "semester": "前期",
    },
    {
        "id": "sched-edu6-101-wed-2",
        "classroom_id": "edu6-101",
        "class_name": "発達心理学",
        "instructor": "佐藤 教授",
        "day_of_week": 2,  # Wednesday
        "period": 2,
        "start_time": PERIOD_TIMES[2][0],
        "end_time": PERIOD_TIMES[2][1],
        "semester": "前期",
    },
    {
        "id": "sched-edu6-102-tue-3",
        "classroom_id": "edu6-102",
        "class_name": "教育社会学",
        "instructor": "鈴木 准教授",
        "day_of_week": 1,  # Tuesday
        "period": 3,
        "start_time": PERIOD_TIMES[3][0],
        "end_time": PERIOD_TIMES[3][1],
        "semester": "通年",
    },
    {
        "id": "sched-edu6-201-mon-2",
        "classroom_id": "edu6-201",
        "class_name": "教育心理学",
        "instructor": "山田 講師",
        "day_of_week": 0,  # Monday
        "period": 2,
        "start_time": PERIOD_TIMES[2][0],
        "end_time": PERIOD_TIMES[2][1],
        "semester": "前期",
    },
    
    # 教育学部講義棟7号館
    {
        "id": "sched-edu7-101-thu-1",
        "classroom_id": "edu7-101",
        "class_name": "教育方法学",
        "instructor": "高橋 教授",
        "day_of_week": 3,  # Thursday
        "period": 1,
        "start_time": PERIOD_TIMES[1][0],
        "end_time": PERIOD_TIMES[1][1],
        "semester": "後期",
    },
    {
        "id": "sched-edu7-104-wed-3",
        "classroom_id": "edu7-104",
        "class_name": "化学実験",
        "instructor": "渡辺 教授",
        "day_of_week": 2,  # Wednesday
        "period": 3,
        "start_time": PERIOD_TIMES[3][0],
        "end_time": PERIOD_TIMES[3][1],
        "semester": "通年",
    },
    {
        "id": "sched-edu7-201-fri-2",
        "classroom_id": "edu7-201",
        "class_name": "教育哲学",
        "instructor": "伊藤 准教授",
        "day_of_week": 4,  # Friday
        "period": 2,
        "start_time": PERIOD_TIMES[2][0],
        "end_time": PERIOD_TIMES[2][1],
        "semester": "前期",
    },
    
    # 教育学部講義棟8号館
    {
        "id": "sched-edu8-101-mon-3",
        "classroom_id": "edu8-101",
        "class_name": "教育行政学",
        "instructor": "中村 教授",
        "day_of_week": 0,  # Monday
        "period": 3,
        "start_time": PERIOD_TIMES[3][0],
        "end_time": PERIOD_TIMES[3][1],
        "semester": "後期",
    },
    {
        "id": "sched-edu8-103-tue-1",
        "classroom_id": "edu8-103",
        "class_name": "特別支援教育",
        "instructor": "小林 准教授",
        "day_of_week": 1,  # Tuesday
        "period": 1,
        "start_time": PERIOD_TIMES[1][0],
        "end_time": PERIOD_TIMES[1][1],
        "semester": "通年",
    },
    
    # ============= 理工学部 =============
    
    # 理工学部講義棟A
    {
        "id": "sched-eng-a-101-mon-1",
        "classroom_id": "eng-a-101",
        "class_name": "線形代数学",
        "instructor": "加藤 教授",
        "day_of_week": 0,  # Monday
        "period": 1,
        "start_time": PERIOD_TIMES[1][0],
        "end_time": PERIOD_TIMES[1][1],
        "semester": "前期",
    },
    {
        "id": "sched-eng-a-104-wed-2",
        "classroom_id": "eng-a-104",
        "class_name": "物理学基礎",
        "instructor": "山本 教授",
        "day_of_week": 2,  # Wednesday
        "period": 2,
        "start_time": PERIOD_TIMES[2][0],
        "end_time": PERIOD_TIMES[2][1],
        "semester": "通年",
    },
    {
        "id": "sched-eng-a-201-tue-3",
        "classroom_id": "eng-a-201",
        "class_name": "微分積分学",
        "instructor": "吉田 准教授",
        "day_of_week": 1,  # Tuesday
        "period": 3,
        "start_time": PERIOD_TIMES[3][0],
        "end_time": PERIOD_TIMES[3][1],
        "semester": "前期",
    },
    {
        "id": "sched-eng-a-206-thu-4",
        "classroom_id": "eng-a-206",
        "class_name": "数学解析学",
        "instructor": "松本 講師",
        "day_of_week": 3,  # Thursday
        "period": 4,
        "start_time": PERIOD_TIMES[4][0],
        "end_time": PERIOD_TIMES[4][1],
        "semester": "後期",
    },
    {
        "id": "sched-eng-a-304-fri-3",
        "classroom_id": "eng-a-304",
        "class_name": "物理実験A",
        "instructor": "井上 助教",
        "day_of_week": 4,  # Friday
        "period": 3,
        "start_time": PERIOD_TIMES[3][0],
        "end_time": PERIOD_TIMES[3][1],
        "semester": "通年",
    },
    
    # 理工学部講義棟B
    {
        "id": "sched-eng-b-201-mon-2",
        "classroom_id": "eng-b-201",
        "class_name": "プログラミング基礎",
        "instructor": "木村 教授",
        "day_of_week": 0,  # Monday
        "period": 2,
        "start_time": PERIOD_TIMES[2][0],
        "end_time": PERIOD_TIMES[2][1],
        "semester": "前期",
    },
    {
        "id": "sched-eng-b-graphic-wed-4",
        "classroom_id": "eng-b-graphic",
        "class_name": "CG演習",
        "instructor": "林 准教授",
        "day_of_week": 2,  # Wednesday
        "period": 4,
        "start_time": PERIOD_TIMES[4][0],
        "end_time": PERIOD_TIMES[4][1],
        "semester": "後期",
    },
    
    # 理工学部講義棟C
    {
        "id": "sched-eng-c-101-tue-1",
        "classroom_id": "eng-c-101",
        "class_name": "工学基礎",
        "instructor": "斎藤 教授",
        "day_of_week": 1,  # Tuesday
        "period": 1,
        "start_time": PERIOD_TIMES[1][0],
        "end_time": PERIOD_TIMES[1][1],
        "semester": "前期",
    },
    {
        "id": "sched-eng-c-201-thu-3",
        "classroom_id": "eng-c-201",
        "class_name": "化学実験",
        "instructor": "清水 准教授",
        "day_of_week": 3,  # Thursday
        "period": 3,
        "start_time": PERIOD_TIMES[3][0],
        "end_time": PERIOD_TIMES[3][1],
        "semester": "通年",
    },
    
    # ============= 経済学部 =============
    
    # 経済学部講義棟1号館
    {
        "id": "sched-econ1-101-mon-1",
        "classroom_id": "econ1-101",
        "class_name": "ミクロ経済学",
        "instructor": "橋本 教授",
        "day_of_week": 0,  # Monday
        "period": 1,
        "start_time": PERIOD_TIMES[1][0],
        "end_time": PERIOD_TIMES[1][1],
        "semester": "前期",
    },
    {
        "id": "sched-econ1-104-wed-2",
        "classroom_id": "econ1-104",
        "class_name": "経済学原論",
        "instructor": "石川 准教授",
        "day_of_week": 2,  # Wednesday
        "period": 2,
        "start_time": PERIOD_TIMES[2][0],
        "end_time": PERIOD_TIMES[2][1],
        "semester": "通年",
    },
    {
        "id": "sched-econ1-201-tue-3",
        "classroom_id": "econ1-201",
        "class_name": "財政学",
        "instructor": "前田 教授",
        "day_of_week": 1,  # Tuesday
        "period": 3,
        "start_time": PERIOD_TIMES[3][0],
        "end_time": PERIOD_TIMES[3][1],
        "semester": "後期",
    },
    {
        "id": "sched-econ1-204-thu-2",
        "classroom_id": "econ1-204",
        "class_name": "マクロ経済学",
        "instructor": "藤田 准教授",
        "day_of_week": 3,  # Thursday
        "period": 2,
        "start_time": PERIOD_TIMES[2][0],
        "end_time": PERIOD_TIMES[2][1],
        "semester": "前期",
    },
    
    # ============= 経営学部 =============
    
    # 経営学部講義棟1号館
    {
        "id": "sched-bus1-101-mon-2",
        "classroom_id": "bus1-101",
        "class_name": "経営戦略論",
        "instructor": "岡田 教授",
        "day_of_week": 0,  # Monday
        "period": 2,
        "start_time": PERIOD_TIMES[2][0],
        "end_time": PERIOD_TIMES[2][1],
        "semester": "前期",
    },
    {
        "id": "sched-bus1-105-wed-3",
        "classroom_id": "bus1-105",
        "class_name": "経営学原論",
        "instructor": "長谷川 准教授",
        "day_of_week": 2,  # Wednesday
        "period": 3,
        "start_time": PERIOD_TIMES[3][0],
        "end_time": PERIOD_TIMES[3][1],
        "semester": "通年",
    },
    {
        "id": "sched-bus1-203-tue-1",
        "classroom_id": "bus1-203",
        "class_name": "管理会計論",
        "instructor": "村上 教授",
        "day_of_week": 1,  # Tuesday
        "period": 1,
        "start_time": PERIOD_TIMES[1][0],
        "end_time": PERIOD_TIMES[1][1],
        "semester": "後期",
    },
    {
        "id": "sched-bus2-201-thu-4",
        "classroom_id": "bus2-201",
        "class_name": "経営学ゼミ",
        "instructor": "中島 准教授",
        "day_of_week": 3,  # Thursday
        "period": 4,
        "start_time": PERIOD_TIMES[4][0],
        "end_time": PERIOD_TIMES[4][1],
        "semester": "通年",
    },
    
    # ============= 都市科学部 =============
    
    {
        "id": "sched-urban-101-mon-3",
        "classroom_id": "urban-101",
        "class_name": "都市デザイン論",
        "instructor": "野村 教授",
        "day_of_week": 0,  # Monday
        "period": 3,
        "start_time": PERIOD_TIMES[3][0],
        "end_time": PERIOD_TIMES[3][1],
        "semester": "前期",
    },
    {
        "id": "sched-urban-103-wed-2",
        "classroom_id": "urban-103",
        "class_name": "都市計画概論",
        "instructor": "坂本 准教授",
        "day_of_week": 2,  # Wednesday
        "period": 2,
        "start_time": PERIOD_TIMES[2][0],
        "end_time": PERIOD_TIMES[2][1],
        "semester": "通年",
    },
]

