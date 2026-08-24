import React, { useState } from 'react';
import { WidgetConfig } from '../types';
import { generatePowerShellScript, generateAllInOneBat } from '../utils/powerShellGenerator';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Terminal, 
  Play, 
  Sparkles,
  ShieldCheck,
  FolderOpen,
  AlertTriangle,
  HelpCircle,
  X,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface CodeViewerProps {
  config: WidgetConfig;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ config }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState<boolean>(false);
  const scriptContent = generatePowerShellScript(config);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(scriptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const handleDownloadPS1 = () => {
    // UTF-8 with BOM to ensure Korean text doesn't break in legacy Windows PowerShell 5.1
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, scriptContent], { type: 'text/plain;charset=utf-8' });
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
    // Generate standalone All-In-One bat with embedded PowerShell code
    // IMPORTANT: DO NOT add BOM to .bat files as cmd.exe cannot parse BOM!
    const batContent = generateAllInOneBat(config);
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

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative">
      {/* Code Header Bar */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200">NEWSchoolWidget.ps1 (파워쉘 완성형 코드)</h3>
            <p className="text-[10px] text-slate-400">설정하신 학교 정보와 시간표가 스크립트에 자동 반영되었습니다.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyCode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사 완료!' : '전체 코드 복사'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPS1}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.ps1 다운로드</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadBAT}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
            title="별도 파일 없이 더블 클릭으로 바로 켜지는 올인원 배치 파일"
          >
            <Play className="w-3.5 h-3.5" />
            <span>올인원 .bat 다운로드</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTroubleshoot(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
            title="실행 에러 / SmartScreen 해결법"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>실행 문제 해결</span>
          </button>
        </div>
      </div>

      {/* Standalone Notice Banner */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong>[올인원 .bat]</strong>은 별도 .ps1 파일 없이 <strong>이 파일 하나만 다운받아 더블 클릭</strong>하면 즉시 실행됩니다.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowTroubleshoot(true)}
          className="text-[11px] text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0 ml-2"
        >
          '실행할 수 없는 앱' 알림이 뜨나요?
        </button>
      </div>

      {/* Code Text Body */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/60 leading-relaxed">
        <pre className="select-text whitespace-pre-wrap break-all">
          {scriptContent}
        </pre>
      </div>

      {/* Code Footer info */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>WPF XAML Native 렌더링 • 듀얼 모니터 우측 상단 자동 스냅 내장</span>
        </div>
        <span className="text-slate-500">인코딩: UTF-8 with BOM (한글 깨짐 방지 완벽)</span>
      </div>

      {/* Troubleshooting Modal */}
      {showTroubleshoot && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90%] overflow-y-auto shadow-2xl p-5 text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>윈도우에서 실행할 수 없다고 뜰 때 해결법</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              {/* Solution 1: SmartScreen */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-2">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>'Windows의 PC 보호' (SmartScreen) 파란 창이 뜰 때</span>
                </div>
                <p className="text-slate-300 leading-relaxed pl-6">
                  인터넷에서 다운로드한 배치 파일에 윈도우가 띄우는 기본 안내입니다. 바이러스가 아니므로 안심하셔도 됩니다:
                </p>
                <div className="ml-6 p-2 rounded-lg bg-blue-950/40 border border-blue-500/20 text-slate-200 font-medium space-y-1">
                  <div>👉 파란색 경고 창에서 <strong>[추가 정보]</strong> 링크를 클릭합니다.</div>
                  <div>👉 아래에 나타나는 <strong>[실행]</strong> 버튼을 누르면 위젯이 즉시 켜집니다!</div>
                </div>
              </div>

              {/* Solution 2: File Properties Unblock */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>파일 속성에서 '차단 해제'하기 (가장 깔끔한 방법)</span>
                </div>
                <ol className="ml-6 list-decimal list-inside space-y-1 text-slate-300">
                  <li>다운로드한 <code>NEWSchoolWidget_원클릭_실행.bat</code> 파일을 <strong>마우스 우클릭 ➔ [속성]</strong>을 클릭합니다.</li>
                  <li>창 맨 아래 보안 항목의 <strong>[차단 해제(Unblock)]</strong> 체크박스에 체크합니다.</li>
                  <li><strong>[적용]</strong> 및 <strong>[확인]</strong>을 누른 뒤 더블 클릭하면 다음부터 경고 없이 바로 실행됩니다.</li>
                </ol>
              </div>

              {/* Solution 3: ExecutionPolicy in PowerShell */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>.ps1 파일로 우클릭 실행하기 (대체 방법)</span>
                </div>
                <p className="text-slate-300 leading-relaxed pl-6">
                  배치 파일 대신 <strong>[.ps1 다운로드]</strong>로 받은 <code>NEWSchoolWidget.ps1</code> 파일을 <strong>마우스 우클릭 ➔ [PowerShell에서 실행]</strong>을 누르면 스크립트가 실행됩니다.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTroubleshoot(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                확인했습니다
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
