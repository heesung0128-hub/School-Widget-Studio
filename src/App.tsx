import React, { useState, useEffect } from 'react';
import { WidgetConfig } from './types';
import { DEFAULT_SCHOOL } from './utils/neisApi';
import { DesktopSimulator } from './components/DesktopSimulator';
import { ConfigPanel } from './components/ConfigPanel';
import { CodeViewer } from './components/CodeViewer';
import { GuideSection } from './components/GuideSection';
import { SchoolWidgetCard } from './components/SchoolWidgetCard';
import { 
  Monitor, 
  Sliders, 
  Terminal, 
  BookOpen, 
  Download, 
  Sparkles, 
  School, 
  Calendar,
  Clock,
  Utensils,
  CheckSquare,
  Copy,
  Check,
  Play
} from 'lucide-react';
import { generatePowerShellScript, generateAllInOneBat } from './utils/powerShellGenerator';

const STORAGE_KEY = 'school_widget_config_v1';

const DEFAULT_CONFIG: WidgetConfig = {
  school: DEFAULT_SCHOOL,
  ddays: [
    { id: '1', title: '1학기 중간고사', targetDate: '2026-09-28' },
    { id: '2', title: '겨울방학식', targetDate: '2026-12-30' },
    { id: '3', title: '대학수학능력시험', targetDate: '2026-11-19' },
  ],
  timetable: [
    { day: '월', periods: ['문학 (3-1)', '문학 (3-2)', '상담', '수업준비', '진로지도', '동아리', '종례'] },
    { day: '화', periods: ['문학 (3-3)', '문학 (3-1)', '교직회의', '문학 (3-2)', '수업준비', '보충학습', '-'] },
    { day: '수', periods: ['수업준비', '문학 (3-3)', '문학 (3-1)', '전문학습', '자율학습', '-', '-'] },
    { day: '목', periods: ['문학 (3-2)', '문학 (3-3)', '문학 (3-1)', '학생상담', '수업준비', '진로활동', '-'] },
    { day: '금', periods: ['문학 (3-2)', '수업준비', '문학 (3-3)', '학년회의', '학급자치', '클럽활동', '-'] },
  ],
  periodTimes: [
    { period: 1, startTime: '09:00', endTime: '09:50' },
    { period: 2, startTime: '10:00', endTime: '10:50' },
    { period: 3, startTime: '11:00', endTime: '11:50' },
    { period: 4, startTime: '12:00', endTime: '12:50' },
    { period: 5, startTime: '13:50', endTime: '14:40' },
    { period: 6, startTime: '14:50', endTime: '15:40' },
    { period: 7, startTime: '15:50', endTime: '16:40' },
  ],
  todos: [
    { id: '1', text: '3학년 2반 수행평가 채점 완료하기', completed: false, createdAt: Date.now() },
    { id: '2', text: '나이스 출결 마감 및 확인', completed: true, createdAt: Date.now() - 3600000 },
    { id: '3', text: '학부모 상담 일지 작성', completed: false, createdAt: Date.now() - 7200000 },
  ],
  theme: 'dark-acrylic',
  opacity: 0.92,
  alwaysOnTop: true,
  snapMargin: 20,
  mealSwitchTime: '13:30',
  showAllergies: true,
  showCalories: true,
  widgetWidth: 330,
  userRole: 'teacher',
};

export default function App() {
  const [config, setConfig] = useState<WidgetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load local config', e);
    }
    return DEFAULT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<'simulator' | 'config' | 'code' | 'guide'>('simulator');
  const [quickCopied, setQuickCopied] = useState<boolean>(false);

  // Save config on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save local config', e);
    }
  }, [config]);

  const handleDownloadPS1 = () => {
    const script = generatePowerShellScript(config);
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NEWSchoolWidget.ps1';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadBAT = () => {
    const batContent = generateAllInOneBat(config);
    // DO NOT add BOM to .bat files as cmd.exe cannot parse UTF-8 BOM
    const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NEWSchoolWidget_원클릭_실행.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleQuickCopy = async () => {
    const script = generatePowerShellScript(config);
    await navigator.clipboard.writeText(script);
    setQuickCopied(true);
    setTimeout(() => setQuickCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  학교 생활 윈도우 위젯 스튜디오
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-semibold">
                  PowerShell + WPF
                </span>
              </div>
              <p className="text-xs text-slate-400">
                바탕화면 우측 상단 자동 스냅 • 나이스 실시간 급식(13:30 전환) • 시간표 • D-Day • 할 일 관리
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickCopy}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                quickCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
              }`}
            >
              {quickCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{quickCopied ? '복사됨!' : '스크립트 복사'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPS1}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.ps1 다운로드</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadBAT}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white items-center gap-1.5 transition-all"
              title="검은 콘솔창 없이 즉시 띄우는 배치파일"
            >
              <Play className="w-3.5 h-3.5" />
              <span>원클릭 실행용 .bat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'simulator'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>바탕화면 시뮬레이터</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'config'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>위젯 커스텀 설정</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>파워쉘 (.ps1) 코드</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>초보자 실행 가이드</span>
          </button>
        </div>

        {/* Tab 1: Simulator View */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Desktop Canvas (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <DesktopSimulator
                config={config}
                onUpdateConfig={setConfig}
              />
            </div>

            {/* Quick Config & Widget Inspector (1 col) */}
            <div className="space-y-4">
              {/* Quick Info Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>위젯 핵심 동작 특성</span>
                </h3>

                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong>마우스 드래그 & 자동 스냅:</strong> 위젯을 자유롭게 끌다가 손을 놓으면 현재 모니터 우측 상단으로 부드럽게 붙습니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>13:30 급식 자동 전환:</strong> 오후 1시 30분 이전에는 '오늘의 급식', 1시 30분 이후에는 자동으로 '내일의 급식'으로 전환됩니다. (금요일 오후엔 월요일 급식)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>동적 높이 조절:</strong> 할 일을 추가하거나 삭제하면 위젯 길이가 내용에 맞춰 자연스럽게 늘어나고 줄어듭니다.</span>
                  </li>
                </ul>

                <div className="pt-2 border-t border-slate-800 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('config')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                  >
                    학교 및 시간표 변경하기 ➔
                  </button>
                </div>
              </div>

              {/* Side Config Mini Panel */}
              <ConfigPanel
                config={config}
                onUpdateConfig={setConfig}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Config View */}
        {activeTab === 'config' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ConfigPanel
                config={config}
                onUpdateConfig={setConfig}
              />
            </div>

            {/* Live Preview of the widget */}
            <div className="flex flex-col items-center justify-start space-y-3">
              <div className="text-xs font-bold text-slate-400">위젯 실시간 미리보기</div>
              <SchoolWidgetCard
                config={config}
                onUpdateConfig={setConfig}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Code View */}
        {activeTab === 'code' && (
          <div className="h-[700px]">
            <CodeViewer config={config} />
          </div>
        )}

        {/* Tab 4: Guide View */}
        {activeTab === 'guide' && (
          <GuideSection />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          학교 생활 윈도우 위젯 • 나이스(NEIS) Open API 연동 • WPF XAML & PowerShell Script Generator
        </p>
      </footer>
    </div>
  );
}
