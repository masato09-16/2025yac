import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, Calendar, Clock, BookOpen, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ClassSchedule {
  id: string;
  classroom_id: string;
  class_name: string;
  instructor?: string;
  day_of_week: number;
  period: number;
  start_time: string;
  end_time: string;
  semester?: string;
  course_code?: string;
}

interface Classroom {
  id: string;
  room_number: string;
  building_id: string;
  faculty: string;
}

const DAY_NAMES = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'];
const PERIOD_TIMES: { [key: number]: [string, string] } = {
  1: ['08:50:00', '10:20:00'],
  2: ['10:30:00', '12:00:00'],
  3: ['13:00:00', '14:30:00'],
  4: ['14:40:00', '16:10:00'],
  5: ['16:20:00', '17:50:00'],
  6: ['18:00:00', '19:30:00'],
  7: ['19:40:00', '21:10:00'],
};

export default function Admin() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    classroom_id: '',
    class_name: '',
    instructor: '',
    day_of_week: '0',
    period: '1',
    semester: '前期',
    course_code: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedulesRes, classroomsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/schedules/`),
        fetch(`${API_BASE_URL}/api/v1/classrooms/`),
      ]);

      const schedulesData = await schedulesRes.json();
      const classroomsData = await classroomsRes.json();

      setSchedules(schedulesData);
      setClassrooms(classroomsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const period = parseInt(formData.period);
    const [start_time, end_time] = PERIOD_TIMES[period];

    const scheduleData = {
      classroom_id: formData.classroom_id,
      class_name: formData.class_name,
      instructor: formData.instructor || undefined,
      day_of_week: parseInt(formData.day_of_week),
      period,
      start_time,
      end_time,
      semester: formData.semester || undefined,
      course_code: formData.course_code || undefined,
    };

    try {
      if (editingSchedule) {
        // Update existing schedule
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/${editingSchedule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scheduleData),
        });

        if (response.ok) {
          await fetchData();
          setEditingSchedule(null);
          resetForm();
        }
      } else {
        // Create new schedule
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scheduleData),
        });

        if (response.ok) {
          await fetchData();
          setIsAdding(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この授業スケジュールを削除しますか？')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/schedules/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  };

  const handleEdit = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      classroom_id: schedule.classroom_id,
      class_name: schedule.class_name,
      instructor: schedule.instructor || '',
      day_of_week: schedule.day_of_week.toString(),
      period: schedule.period.toString(),
      semester: schedule.semester || '前期',
      course_code: schedule.course_code || '',
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      classroom_id: '',
      class_name: '',
      instructor: '',
      day_of_week: '0',
      period: '1',
      semester: '前期',
      course_code: '',
    });
  };

  const cancelEdit = () => {
    setEditingSchedule(null);
    setIsAdding(false);
    resetForm();
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const day = schedule.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {} as { [key: number]: ClassSchedule[] });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">管理画面</h1>
                <p className="text-sm text-gray-600 mt-1">授業スケジュールの管理</p>
              </div>
            </div>
            <Button onClick={() => setIsAdding(!isAdding)} className="bg-ynu-blue hover:bg-ynu-blue-dark">
              <Plus className="w-4 h-4 mr-2" />
              新規追加
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="mb-8 border-ynu-blue shadow-lg">
            <CardHeader className="bg-gradient-to-r from-ynu-blue to-ynu-blue-dark text-white">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {editingSchedule ? '授業スケジュール編集' : '新規授業スケジュール追加'}
              </CardTitle>
              <CardDescription className="text-blue-100">
                授業情報を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Classroom Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="classroom_id">教室 *</Label>
                    <Select
                      value={formData.classroom_id}
                      onValueChange={(value) => setFormData({ ...formData, classroom_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="教室を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map((classroom) => (
                          <SelectItem key={classroom.id} value={classroom.id}>
                            {classroom.room_number} ({classroom.faculty})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Class Name */}
                  <div className="space-y-2">
                    <Label htmlFor="class_name">授業名 *</Label>
                    <Input
                      id="class_name"
                      value={formData.class_name}
                      onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                      placeholder="例: 線形代数学"
                      required
                    />
                  </div>

                  {/* Instructor */}
                  <div className="space-y-2">
                    <Label htmlFor="instructor">教員名</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      placeholder="例: 田中 教授"
                    />
                  </div>

                  {/* Day of Week */}
                  <div className="space-y-2">
                    <Label htmlFor="day_of_week">曜日 *</Label>
                    <Select
                      value={formData.day_of_week}
                      onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAY_NAMES.map((day, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Period */}
                  <div className="space-y-2">
                    <Label htmlFor="period">時限 *</Label>
                    <Select
                      value={formData.period}
                      onValueChange={(value) => setFormData({ ...formData, period: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PERIOD_TIMES).map(([period, [start, end]]) => (
                          <SelectItem key={period} value={period}>
                            {period}時限 ({start.slice(0, 5)} - {end.slice(0, 5)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Semester */}
                  <div className="space-y-2">
                    <Label htmlFor="semester">学期</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => setFormData({ ...formData, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="前期">前期</SelectItem>
                        <SelectItem value="後期">後期</SelectItem>
                        <SelectItem value="通年">通年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Course Code */}
                  <div className="space-y-2">
                    <Label htmlFor="course_code">授業コード</Label>
                    <Input
                      id="course_code"
                      value={formData.course_code}
                      onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                      placeholder="例: CS101"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    キャンセル
                  </Button>
                  <Button type="submit" className="bg-ynu-blue hover:bg-ynu-blue-dark">
                    <Save className="w-4 h-4 mr-2" />
                    {editingSchedule ? '更新' : '追加'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Schedule List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              授業スケジュール一覧
            </CardTitle>
            <CardDescription>登録済みの授業スケジュール ({schedules.length}件)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ynu-blue border-r-transparent"></div>
                <p className="mt-4 text-gray-600">読み込み中...</p>
              </div>
            ) : (
              <Tabs defaultValue="0" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  {DAY_NAMES.map((day, index) => (
                    <TabsTrigger key={index} value={index.toString()}>
                      {day.slice(0, 1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {DAY_NAMES.map((day, dayIndex) => (
                  <TabsContent key={dayIndex} value={dayIndex.toString()} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{day}</h3>
                    {groupedSchedules[dayIndex] && groupedSchedules[dayIndex].length > 0 ? (
                      <div className="space-y-3">
                        {groupedSchedules[dayIndex]
                          .sort((a, b) => a.period - b.period)
                          .map((schedule) => {
                            const classroom = classrooms.find((c) => c.id === schedule.classroom_id);
                            return (
                              <div
                                key={schedule.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-ynu-blue transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="px-2 py-1 bg-ynu-blue text-white text-xs font-bold rounded">
                                      {schedule.period}限
                                    </span>
                                    <h4 className="font-bold text-gray-900">{schedule.class_name}</h4>
                                    {schedule.semester && (
                                      <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                                        {schedule.semester}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>📍 {classroom?.room_number || schedule.classroom_id}</span>
                                    {schedule.instructor && <span>👤 {schedule.instructor}</span>}
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(schedule)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(schedule.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">この曜日には授業が登録されていません</p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

