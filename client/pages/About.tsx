import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Building2, Users, Info, HelpCircle, BookOpen, Clock, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-ynu-blue via-ynu-blue to-ynu-blue-dark border-b border-ynu-blue shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">戻る</span>
              </button>
            </Link>
            <div className="h-6 w-px bg-white/30"></div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">使い方ガイド</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 概要セクション */}
        <Card className="mb-6 border-ynu-blue shadow-lg">
          <CardHeader className="bg-gradient-to-r from-ynu-blue to-ynu-blue-dark text-white">
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              YNU-TWINとは
            </CardTitle>
            <CardDescription className="text-blue-100">
              横浜国立大学の空き教室を簡単に検索できるシステム
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              YNU-TWINは、横浜国立大学の学生・教職員向けに開発された空き教室検索システムです。
              リアルタイムで教室の利用状況を確認し、最適な学習・研究スペースを見つけることができます。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                <Building2 className="w-8 h-8 text-ynu-blue mb-2" />
                <h3 className="font-bold text-sm text-gray-900 mb-1">92教室</h3>
                <p className="text-xs text-gray-600">登録教室数</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-bold text-sm text-gray-900 mb-1">リアルタイム</h3>
                <p className="text-xs text-gray-600">人数検出</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-purple-50 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-bold text-sm text-gray-900 mb-1">スケジュール</h3>
                <p className="text-xs text-gray-600">授業情報</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使い方セクション */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="w-5 h-5 text-ynu-blue" />
              基本的な使い方
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-ynu-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 flex items-center gap-2">
                    <Search className="w-4 h-4 text-ynu-blue" />
                    検索条件を設定
                  </h3>
                  <p className="text-xs text-gray-600">
                    画面上部の検索条件から、学部・建物・状態などを選択して検索します。
                    「現在の空き状況」または「日時を指定」で検索モードを切り替えられます。
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-ynu-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-ynu-blue" />
                    結果を確認
                  </h3>
                  <p className="text-xs text-gray-600">
                    検索結果は学部ごとにグループ化されて表示されます。
                    各教室カードには、定員・現在の人数・設備情報が表示されます。
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-ynu-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    教室を選択
                  </h3>
                  <p className="text-xs text-gray-600">
                    「利用可能」と表示されている教室は、すぐに使用できます。
                    カードの色で状態が一目でわかります（緑：空き、赤：使用中、灰：データなし）。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 機能説明セクション */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="w-5 h-5 text-ynu-blue" />
              主な機能
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ynu-blue" />
                  リアルタイム検索
                </h3>
                <p className="text-xs text-gray-600">
                  現在の教室の利用状況をリアルタイムで確認できます。
                  AIによる人数検出で、正確な在室状況を把握できます。
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-ynu-blue" />
                  日時指定検索
                </h3>
                <p className="text-xs text-gray-600">
                  未来の日時を指定して、その時点での空き教室を検索できます。
                  授業スケジュールを考慮した検索が可能です。
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-ynu-blue" />
                  詳細な教室情報
                </h3>
                <p className="text-xs text-gray-600">
                  各教室の定員、現在の人数、設備（プロジェクター、Wi-Fi、電源）などの
                  詳細な情報を確認できます。
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-ynu-blue" />
                  人数表示
                </h3>
                <p className="text-xs text-gray-600">
                  YOLOv8によるAI人数検出で、各教室の現在の人数を表示します。
                  定員に対する占有率も視覚的に確認できます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 教室の状態について */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="w-5 h-5 text-ynu-blue" />
              教室の状態について
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-green-900 mb-1">🟢 利用可能（空き）</h3>
                  <p className="text-xs text-green-700">
                    現在授業がなく、利用可能な教室です。すぐに使用できます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-red-900 mb-1">🔴 使用中</h3>
                  <p className="text-xs text-red-700">
                    現在授業が行われているか、多くの人が使用している教室です。
                    授業名や教員名が表示されます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-3 h-3 bg-gray-400 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">⚫ データなし</h3>
                  <p className="text-xs text-gray-700">
                    現在の利用状況データが取得できていない教室です。
                    実際には空いている可能性もありますが、確認が必要です。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 注意事項 */}
        <Card className="mb-6 border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="flex items-center gap-2 text-base text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              ご注意
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>表示されている情報は参考値です。実際の利用状況は現地でご確認ください。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>人数検出はAIによる自動検出のため、誤差が生じる可能性があります。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>授業スケジュールは予定であり、変更される可能性があります。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>教室の利用には、大学の利用規約に従ってください。</span>
              </li>
            </ul>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}

