import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, Calendar, Clock, X, Building2, Users, Wifi, Plug, Projector, Search, Filter, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { FACULTY_NAMES, BUILDINGS, type Faculty } from '@shared/data';

// In Vercel/production, use relative paths (same domain)
// In development, use localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:8000');

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
  floor: number;
  capacity: number;
  has_projector: boolean;
  has_wifi: boolean;
  has_power_outlets: boolean;
}

const DAY_NAMES = ['月', '火', '水', '木', '金', '土', '日'];
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
  const [activeTab, setActiveTab] = useState<'classrooms' | 'schedules'>('classrooms');

  // Schedules state
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleFilter, setScheduleFilter] = useState({ classroom_id: '', day_of_week: '' });
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportJson, setBulkImportJson] = useState('');

  // Classrooms state
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [isAddingClassroom, setIsAddingClassroom] = useState(false);
  const [classroomFilter, setClassroomFilter] = useState({ faculty: 'all', building_id: 'all' });


  const [classroomFormData, setClassroomFormData] = useState({
    id: '',
    room_number: '',
    building_id: '',
    faculty: 'education' as Faculty,
    floor: 1,
    capacity: 50,
    has_projector: true,
    has_wifi: true,
    has_power_outlets: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [schedulesRes, classroomsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/schedules/`),
        fetch(`${API_BASE_URL}/api/v1/classrooms/`),
      ]);

      if (!schedulesRes.ok) {
        throw new Error(`Failed to fetch schedules: ${schedulesRes.status} ${schedulesRes.statusText}`);
      }
      if (!classroomsRes.ok) {
        throw new Error(`Failed to fetch classrooms: ${classroomsRes.status} ${classroomsRes.statusText}`);
      }

      const schedulesData = await schedulesRes.json();
      const classroomsData = await classroomsRes.json();

      setSchedules(schedulesData);
      setClassrooms(classroomsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(error instanceof Error ? error.message : 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // ============= Schedule Management =============
  const handleBulkImport = async () => {
    try {
      let schedulesData: any[];

      // JSON文字列をパース
      try {
        schedulesData = JSON.parse(bulkImportJson);
      } catch (e) {
        alert('JSONの形式が正しくありません。正しいJSON形式で入力してください。');
        return;
      }

      // 配列であることを確認
      if (!Array.isArray(schedulesData)) {
        alert('JSONは配列形式である必要があります。例: [{...}, {...}]');
        return;
      }

      // 一括インポートAPIを呼び出し
      const response = await fetch(`${API_BASE_URL}/api/v1/schedules/bulk-import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedulesData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'インポートに失敗しました');
      }

      await fetchData();
      setBulkImportJson('');
      setShowBulkImport(false);
      alert(`${schedulesData.length}件のスケジュールをインポートしました`);
    } catch (error) {
      console.error('Failed to import schedules:', error);
      alert(error instanceof Error ? error.message : 'インポートに失敗しました');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setBulkImportJson(content);
    };
    reader.readAsText(file);
  };

  // ============= Classroom Management =============
  const handleClassroomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingClassroom) {
        const response = await fetch(`${API_BASE_URL}/api/v1/classrooms/${editingClassroom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room_number: classroomFormData.room_number,
            building_id: classroomFormData.building_id,
            faculty: classroomFormData.faculty,
            floor: classroomFormData.floor,
            capacity: classroomFormData.capacity,
            has_projector: classroomFormData.has_projector,
            has_wifi: classroomFormData.has_wifi,
            has_power_outlets: classroomFormData.has_power_outlets,
          }),
        });

        if (response.ok) {
          await fetchData();
          setEditingClassroom(null);
          resetClassroomForm();
        } else {
          const error = await response.json();
          alert(`更新に失敗しました: ${error.detail || '不明なエラー'}`);
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/api/v1/classrooms/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(classroomFormData),
        });

        if (response.ok) {
          await fetchData();
          setIsAddingClassroom(false);
          resetClassroomForm();
        } else {
          const error = await response.json();
          alert(`作成に失敗しました: ${error.detail || '不明なエラー'}`);
        }
      }
    } catch (error) {
      console.error('Failed to save classroom:', error);
      alert('保存に失敗しました');
    }
  };

  const handleClassroomDelete = async (id: string) => {
    if (!confirm('この教室を削除しますか？関連する授業スケジュールも削除される可能性があります。')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/classrooms/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
      } else {
        const error = await response.json();
        alert(`削除に失敗しました: ${error.detail || '不明なエラー'}`);
      }
    } catch (error) {
      console.error('Failed to delete classroom:', error);
      alert('削除に失敗しました');
    }
  };

  const handleClassroomEdit = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setClassroomFormData({
      id: classroom.id,
      room_number: classroom.room_number,
      building_id: classroom.building_id,
      faculty: classroom.faculty as Faculty,
      floor: classroom.floor,
      capacity: classroom.capacity,
      has_projector: classroom.has_projector,
      has_wifi: classroom.has_wifi,
      has_power_outlets: classroom.has_power_outlets,
    });
    setIsAddingClassroom(true);
  };

  const resetClassroomForm = () => {
    setClassroomFormData({
      id: '',
      room_number: '',
      building_id: '',
      faculty: 'education',
      floor: 1,
      capacity: 50,
      has_projector: true,
      has_wifi: true,
      has_power_outlets: true,
    });
  };

  // 教室IDを自動生成（建物ID + 階層 + 部屋番号から）
  const generateClassroomId = () => {
    if (classroomFormData.building_id && classroomFormData.room_number) {
      const buildingPrefix = classroomFormData.building_id.replace('-', '');
      const roomNum = classroomFormData.room_number.replace(/[^0-9]/g, '');
      return `${buildingPrefix}-${classroomFormData.floor}${roomNum}`.toLowerCase();
    }
    return '';
  };

  // フォームデータが変更されたらIDを自動更新
  useEffect(() => {
    if (!editingClassroom && classroomFormData.building_id && classroomFormData.room_number) {
      const autoId = generateClassroomId();
      if (autoId) {
        setClassroomFormData(prev => ({ ...prev, id: autoId }));
      }
    }
  }, [classroomFormData.building_id, classroomFormData.room_number, classroomFormData.floor]);

  // フィルタリング
  const filteredSchedules = schedules.filter(s => {
    if (scheduleFilter.classroom_id && s.classroom_id !== scheduleFilter.classroom_id) return false;
    if (scheduleFilter.day_of_week && s.day_of_week.toString() !== scheduleFilter.day_of_week) return false;
    return true;
  });

  const filteredClassrooms = classrooms.filter(c => {
    if (classroomFilter.faculty && classroomFilter.faculty !== 'all' && c.faculty !== classroomFilter.faculty) return false;
    if (classroomFilter.building_id && classroomFilter.building_id !== 'all' && c.building_id !== classroomFilter.building_id) return false;
    return true;
  });

  // 教室ごとにスケジュールをグループ化
  const schedulesByClassroom = filteredSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.classroom_id]) acc[schedule.classroom_id] = [];
    acc[schedule.classroom_id].push(schedule);
    return acc;
  }, {} as { [key: string]: ClassSchedule[] });

  // エラー表示
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            API URL: {API_BASE_URL}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setError(null);
                fetchData();
              }}
              className="px-4 py-2 bg-ynu-blue text-white rounded hover:bg-ynu-blue-dark"
            >
              再試行
            </button>
            <Link to="/">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                ホームに戻る
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">管理画面</h1>
                <p className="text-xs text-gray-600 mt-0.5">教室と授業スケジュールの管理</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'classrooms' | 'schedules')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
            <TabsTrigger value="classrooms" className="flex items-center gap-1.5 text-sm">
              <Building2 className="w-3.5 h-3.5" />
              教室管理
            </TabsTrigger>
            <TabsTrigger value="schedules" className="flex items-center gap-1.5 text-sm">
              <Calendar className="w-3.5 h-3.5" />
              授業管理
            </TabsTrigger>
          </TabsList>

          {/* ============= 教室管理タブ ============= */}
          <TabsContent value="classrooms" className="space-y-6">
            {/* 教室追加/編集フォーム */}
            {isAddingClassroom && (
              <Card className="border-ynu-blue shadow-lg">
                <CardHeader className="bg-gradient-to-r from-ynu-blue to-ynu-blue-dark text-white py-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="w-4 h-4" />
                    {editingClassroom ? '教室編集' : '新規教室追加'}
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-xs">
                    教室情報を入力してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleClassroomSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 教室ID（編集時のみ表示、新規作成時は自動生成） */}
                      {editingClassroom && (
                        <div className="space-y-2">
                          <Label htmlFor="classroom_id">教室ID</Label>
                          <Input
                            id="classroom_id"
                            value={classroomFormData.id}
                            disabled
                            className="bg-gray-100"
                          />
                        </div>
                      )}

                      {/* 部屋番号 */}
                      <div className="space-y-2">
                        <Label htmlFor="room_number">部屋番号 *</Label>
                        <Input
                          id="room_number"
                          value={classroomFormData.room_number}
                          onChange={(e) => setClassroomFormData({ ...classroomFormData, room_number: e.target.value })}
                          placeholder="例: 6-101"
                          required
                        />
                      </div>

                      {/* 学部 */}
                      <div className="space-y-2">
                        <Label htmlFor="faculty">学部 *</Label>
                        <Select
                          value={classroomFormData.faculty}
                          onValueChange={(value) => {
                            setClassroomFormData({ ...classroomFormData, faculty: value as Faculty });
                            // 学部が変わったら建物もリセット
                            setClassroomFormData(prev => ({ ...prev, building_id: '' }));
                          }}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(FACULTY_NAMES).map(([id, names]) => (
                              <SelectItem key={id} value={id}>
                                {names.full}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 建物 */}
                      <div className="space-y-2">
                        <Label htmlFor="building_id">建物 *</Label>
                        <Select
                          value={classroomFormData.building_id}
                          onValueChange={(value) => setClassroomFormData({ ...classroomFormData, building_id: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="建物を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {BUILDINGS.filter(b => b.faculty === classroomFormData.faculty).map((building) => (
                              <SelectItem key={building.id} value={building.id}>
                                {building.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 階層 */}
                      <div className="space-y-2">
                        <Label htmlFor="floor">階層 *</Label>
                        <Input
                          id="floor"
                          type="number"
                          min="1"
                          max="10"
                          value={classroomFormData.floor}
                          onChange={(e) => setClassroomFormData({ ...classroomFormData, floor: parseInt(e.target.value) || 1 })}
                          required
                        />
                      </div>

                      {/* 定員 */}
                      <div className="space-y-2">
                        <Label htmlFor="capacity">定員 *</Label>
                        <Input
                          id="capacity"
                          type="number"
                          min="1"
                          value={classroomFormData.capacity}
                          onChange={(e) => setClassroomFormData({ ...classroomFormData, capacity: parseInt(e.target.value) || 50 })}
                          required
                        />
                      </div>
                    </div>

                    {/* 設備 */}
                    <div className="space-y-3">
                      <Label>設備</Label>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="has_projector"
                            checked={classroomFormData.has_projector}
                            onCheckedChange={(checked) => setClassroomFormData({ ...classroomFormData, has_projector: checked as boolean })}
                          />
                          <Label htmlFor="has_projector" className="flex items-center gap-1 cursor-pointer">
                            <Projector className="w-4 h-4" />
                            プロジェクター
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="has_wifi"
                            checked={classroomFormData.has_wifi}
                            onCheckedChange={(checked) => setClassroomFormData({ ...classroomFormData, has_wifi: checked as boolean })}
                          />
                          <Label htmlFor="has_wifi" className="flex items-center gap-1 cursor-pointer">
                            <Wifi className="w-4 h-4" />
                            Wi-Fi
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="has_power_outlets"
                            checked={classroomFormData.has_power_outlets}
                            onCheckedChange={(checked) => setClassroomFormData({ ...classroomFormData, has_power_outlets: checked as boolean })}
                          />
                          <Label htmlFor="has_power_outlets" className="flex items-center gap-1 cursor-pointer">
                            <Plug className="w-4 h-4" />
                            電源コンセント
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <Button type="button" variant="outline" onClick={() => {
                        setIsAddingClassroom(false);
                        setEditingClassroom(null);
                        resetClassroomForm();
                      }}>
                        <X className="w-4 h-4 mr-2" />
                        キャンセル
                      </Button>
                      <Button type="submit" className="bg-ynu-blue hover:bg-ynu-blue-dark">
                        <Save className="w-4 h-4 mr-2" />
                        {editingClassroom ? '更新' : '追加'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* 教室一覧 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="w-4 h-4" />
                      教室一覧
                    </CardTitle>
                    <CardDescription className="text-xs">登録済みの教室 ({filteredClassrooms.length}件)</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setIsAddingClassroom(true);
                    setEditingClassroom(null);
                    resetClassroomForm();
                  }} className="bg-ynu-blue hover:bg-ynu-blue-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    新規追加
                  </Button>
                </div>

                {/* フィルター */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Select
                      value={classroomFilter.faculty}
                      onValueChange={(value) => setClassroomFilter({ ...classroomFilter, faculty: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="学部で絞り込み" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        {Object.entries(FACULTY_NAMES).map(([id, names]) => (
                          <SelectItem key={id} value={id}>
                            {names.full}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Select
                    value={classroomFilter.building_id}
                    onValueChange={(value) => setClassroomFilter({ ...classroomFilter, building_id: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="建物で絞り込み" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {BUILDINGS.filter(b => !classroomFilter.faculty || b.faculty === classroomFilter.faculty).map((building) => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ynu-blue border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">読み込み中...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClassrooms.map((classroom) => (
                      <Card key={classroom.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-sm font-bold text-gray-900">{classroom.room_number}</h3>
                              <p className="text-xs text-gray-600 mt-1">
                                {FACULTY_NAMES[classroom.faculty as Faculty]?.full || classroom.faculty} / {classroom.floor}階
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleClassroomEdit(classroom)}
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleClassroomDelete(classroom.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span>定員: {classroom.capacity}名</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {classroom.has_projector && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  <Projector className="w-3 h-3" />
                                  プロジェクター
                                </span>
                              )}
                              {classroom.has_wifi && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                  <Wifi className="w-3 h-3" />
                                  Wi-Fi
                                </span>
                              )}
                              {classroom.has_power_outlets && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">
                                  <Plug className="w-3 h-3" />
                                  電源
                                </span>
                              )}
                            </div>
                            {/* この教室の授業数 */}
                            <div className="pt-2 border-t">
                              <span className="text-xs text-gray-500">
                                登録授業: {schedules.filter(s => s.classroom_id === classroom.id).length}件
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============= 授業管理タブ ============= */}
          <TabsContent value="schedules" className="space-y-6">
            {/* JSON一括インポート */}
            {showBulkImport && (
              <Card className="border-ynu-blue shadow-lg">
                <CardHeader className="bg-gradient-to-r from-ynu-blue to-ynu-blue-dark text-white py-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Upload className="w-4 h-4" />
                    JSONから一括インポート
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-xs">
                    backend/data/schedules.json の形式でJSONを入力してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="json_file">JSONファイルを選択</Label>
                      <Input
                        id="json_file"
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="json_text">またはJSONを直接貼り付け</Label>
                      <textarea
                        id="json_text"
                        value={bulkImportJson}
                        onChange={(e) => setBulkImportJson(e.target.value)}
                        placeholder={`[\n  {\n    "id": "sched-edu6-101-mon-1",\n    "classroom_id": "edu6-101",\n    "class_name": "教育心理学",\n    "instructor": "田中 教授",\n    "day_of_week": 0,\n    "period": 1,\n    "semester": "前期",\n    "course_code": null\n  }\n]`}
                        className="w-full h-64 p-3 border rounded-md font-mono text-sm mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        ※ start_timeとend_timeは時限（period）から自動的に設定されます
                      </p>
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                      <Button type="button" variant="outline" onClick={() => {
                        setShowBulkImport(false);
                        setBulkImportJson('');
                      }}>
                        <X className="w-4 h-4 mr-2" />
                        キャンセル
                      </Button>
                      <Button type="button" onClick={handleBulkImport} className="bg-ynu-blue hover:bg-ynu-blue-dark">
                        <Upload className="w-4 h-4 mr-2" />
                        インポート
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 授業一覧（教室ごとにグループ化） */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="w-4 h-4" />
                      授業スケジュール一覧
                    </CardTitle>
                    <CardDescription className="text-xs">登録済みの授業スケジュール ({filteredSchedules.length}件)</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setShowBulkImport(true);
                  }} className="bg-ynu-blue hover:bg-ynu-blue-dark">
                    <Upload className="w-4 h-4 mr-2" />
                    JSONから一括インポート
                  </Button>
                </div>

                {/* フィルター */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Select
                      value={scheduleFilter.classroom_id}
                      onValueChange={(value) => setScheduleFilter({ ...scheduleFilter, classroom_id: value })}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="教室で絞り込み" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">すべての教室</SelectItem>
                        {classrooms.map((classroom) => (
                          <SelectItem key={classroom.id} value={classroom.id}>
                            {classroom.room_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={scheduleFilter.day_of_week}
                      onValueChange={(value) => setScheduleFilter({ ...scheduleFilter, day_of_week: value })}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="曜日で絞り込み" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">すべて</SelectItem>
                        {DAY_NAMES.map((day, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {day}曜日
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ynu-blue border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">読み込み中...</p>
                  </div>
                ) : filteredSchedules.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">授業スケジュールが登録されていません</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 教室ごとにグループ化して表示 */}
                    {Object.entries(schedulesByClassroom).map(([classroomId, classroomSchedules]) => {
                      const classroom = classrooms.find(c => c.id === classroomId);
                      if (!classroom) return null;

                      return (
                        <div key={classroomId} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b">
                            <div>
                              <h3 className="text-sm font-bold text-gray-900">{classroom.room_number}</h3>
                              <p className="text-xs text-gray-600">
                                {FACULTY_NAMES[classroom.faculty as Faculty]?.full || classroom.faculty} / {classroom.floor}階
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">{classroomSchedules.length}件の授業</span>
                          </div>
                          <div className="space-y-2">
                            {classroomSchedules
                              .sort((a, b) => {
                                if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
                                return a.period - b.period;
                              })
                              .map((schedule) => (
                                <div
                                  key={schedule.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-ynu-blue transition-colors"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                      <span className="px-2 py-0.5 bg-ynu-blue text-white text-xs font-bold rounded">
                                        {DAY_NAMES[schedule.day_of_week]}{schedule.period}限
                                      </span>
                                      <h4 className="font-bold text-gray-900 text-sm">{schedule.class_name}</h4>
                                      {schedule.semester && (
                                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                                          {schedule.semester}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
                                      {schedule.instructor && <span>👤 {schedule.instructor}</span>}
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                                      </span>
                                      {schedule.course_code && <span>📝 {schedule.course_code}</span>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
