import React, { useState } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  Power,
  FolderOpen,
  MousePointerClick,
  Sparkles
} from 'lucide-react';

export const GuideSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-1">
          <Sparkles className="w-4 h-4" />
          <span>코딩을 몰라도 1분 만에 따라하는 윈도우 위젯 실행 가이드</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          별도의 프로그램 설치 없이, 윈도우에 기본 내장된 <strong>PowerShell</strong>을 이용하여 안전하고 깔끔하게 바탕화면 위젯을 띄울 수 있습니다.
        </p>
      </div>

      {/* 4 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-white">스크립트 파일 다운로드</h4>
            </div>
            <span className="text-[11px] text-blue-400 font-medium">초간단</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            상단의 <strong>[.ps1 다운로드]</strong> 버튼을 눌러 <code>NEWSchoolWidget.ps1</code> 파일을 원하는 폴더(예: 바탕화면이나 내 문서)에 저장합니다.
          </p>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="text-slate-300 font-semibold">💡 직접 복사해서 저장하는 경우:</div>
            <div>1. 메모장을 엽니다.</div>
            <div>2. [전체 코드 복사] 버튼을 눌러 붙여넣기합니다.</div>
            <div>3. 저장할 때 파일 형식을 <strong>'모든 파일(*.*)'</strong>, 파일 이름을 <strong>'NEWSchoolWidget.ps1'</strong>, 인코딩을 <strong>'UTF-8'</strong>로 저장하세요.</div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-white">스크립트 실행 권한 허용 (최초 1회)</h4>
            </div>
            <span className="text-[11px] text-amber-400 font-medium">필수 설정</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            윈도우 기본 보안으로 인해 스크립트 실행이 차단되어 있을 수 있습니다. 아래 명령어로 본인 계정의 스크립트 실행을 1회 허용해 줍니다.
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>PowerShell 창에 붙여넣을 명령어:</span>
              <button
                type="button"
                onClick={() => copyText('Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force', 1)}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 1 ? '복사됨' : '명령어 복사'}</span>
              </button>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800 select-all overflow-x-auto">
              Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-white">마우스 우클릭으로 바로 실행</h4>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">실행 방법</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">방법 A (추천).</span>
              <span><strong>[올인원 .bat 다운로드]</strong>로 받은 <code>NEWSchoolWidget_원클릭_실행.bat</code> 파일을 더블 클릭합니다. (.ps1 파일 없이 단독 실행 가능!)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">방법 B.</span>
              <span><strong>[.ps1 다운로드]</strong>로 받은 <code>NEWSchoolWidget.ps1</code> 파일을 <strong>마우스 우클릭</strong> ➔ <strong>[PowerShell에서 실행]</strong> 클릭!</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20 text-[11px] text-amber-300 space-y-1">
            <div className="font-semibold flex items-center gap-1 text-amber-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>'Windows의 PC 보호' 또는 '실행할 수 없는 앱' 창이 뜨나요?</span>
            </div>
            <div>
              인터넷에서 다운받은 배치 파일에 대한 윈도우 보안 알림입니다. 파란 창에서 <strong>[추가 정보]</strong> 링크를 누른 후 <strong>[실행]</strong> 버튼을 누르시면 정상 실행됩니다.
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>실행 즉시 모니터 우측 상단에 투명 아크릴 위젯이 깔끔하게 부착됩니다!</span>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h4 className="text-sm font-bold text-white">컴퓨터 켤 때 자동 실행 (시작프로그램)</h4>
            </div>
            <span className="text-[11px] text-purple-400 font-medium">편리한 팁</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            컴퓨터를 켤 때마다 자동으로 위젯이 뜨게 하려면 윈도우 시작프로그램 폴더에 바로가기를 넣어두면 됩니다.
          </p>

          <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <li>키보드에서 <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">Win + R</kbd> 키를 누릅니다.</li>
            <li>실행 창에 <code className="text-blue-400">shell:startup</code> 입력 후 확인을 누릅니다.</li>
            <li>열린 폴더에 <code>NEWSchoolWidget_원클릭_실행.bat</code> 파일 또는 바로가기를 복사해 넣으면 끝!</li>
          </ol>
        </div>
      </div>

      {/* FAQ & Troubleshooting Accordion */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>자주 묻는 질문 & 문제 해결 (FAQ)</span>
        </h4>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-amber-500/30">
            <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5 text-sm">
              <span>⚠️ Q. .ps1 파일을 마우스 우클릭해서 실행했는데 아무것도 안 뜨거나 깜빡이고 닫혀요.</span>
            </div>
            <div className="text-slate-300 leading-relaxed space-y-2 text-xs">
              <p>
                윈도우의 기본 보안 정책(<code>ExecutionPolicy Restricted</code>) 때문에 파워쉘 스크립트 실행이 차단되어 창이 0.1초 만에 닫히는 현상입니다.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-700/60 space-y-2 text-[11px]">
                <div>
                  <strong className="text-emerald-300">방법 1 (가장 추천): [올인원 .bat 다운로드]</strong><br />
                  상단의 <strong>[올인원 .bat 다운로드]</strong> 버튼으로 <code>NEWSchoolWidget_원클릭_실행.bat</code>을 받아 더블 클릭하세요. 윈도우 보안 정책을 자동으로 우회(Bypass)하여 즉시 위젯이 실행됩니다.
                </div>
                <div>
                  <strong className="text-blue-300">방법 2: PowerShell 창에서 1줄 명령어로 실행</strong><br />
                  키보드 <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">Win + R</kbd> ➔ <code className="text-blue-300">powershell</code> 입력 후 아래 명령어를 복사해 붙여넣고 엔터를 치면 즉시 켜집니다:
                  <div className="mt-1 p-2 rounded bg-slate-900 font-mono text-[10px] text-blue-200 border border-slate-800 select-all break-all">
                    powershell -ExecutionPolicy Bypass -Sta -WindowStyle Hidden -File "$HOME\Downloads\NEWSchoolWidget.ps1"
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <span>⚠️ Q. .bat 파일 실행 시 '실행할 수 없는 앱' 또는 'Windows의 PC 보호'라고 떠요.</span>
            </div>
            <div className="text-slate-300 leading-relaxed space-y-1.5">
              <p>
                웹 브라우저에서 다운로드한 <code>.bat</code> 파일에 대해 윈도우 SmartScreen이 띄우는 기본 안내입니다:
              </p>
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-700/60 space-y-1 text-[11px]">
                <div><strong>1. 파란색 경고 창에서:</strong> [추가 정보] 텍스트를 클릭한 뒤, 활성화되는 <strong>[실행]</strong> 버튼을 누릅니다.</div>
                <div><strong>2. 파일 속성에서 영구 차단 해제:</strong> <code>NEWSchoolWidget_원클릭_실행.bat</code> 파일 마우스 우클릭 ➔ <strong>[속성]</strong> ➔ 맨 아래 <strong>[차단 해제(Unblock)]</strong> 체크박스 체크 후 <strong>[확인]</strong> 클릭!</div>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="font-bold text-blue-300 mb-1">Q. 한글(학교명, 급식 메뉴 등)이 깨져서 나와요.</div>
            <p className="text-slate-400 leading-relaxed">
              본 사이트에서 <strong>[.ps1 다운로드]</strong>를 이용하시면 UTF-8 with BOM 형식으로 자동 저장되므로 한글 깨짐이 완벽히 방지됩니다. 직접 메모장으로 저장하실 때도 인코딩 형식을 꼭 <strong>UTF-8</strong>로 지정해 주세요.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="font-bold text-blue-300 mb-1">Q. 급식 정보가 "등록된 급식 정보가 없습니다"로 나와요.</div>
            <p className="text-slate-400 leading-relaxed">
              주말, 공휴일, 방학 기간이거나 학교에서 아직 나이스에 식단을 등록하지 않은 경우입니다. 평일 학기 중에는 정상적으로 식단과 영양/칼로리 정보가 자동 갱신됩니다.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="font-bold text-blue-300 mb-1">Q. 할 일(TO-DO)을 입력하면 어디에 저장되나요?</div>
            <p className="text-slate-400 leading-relaxed">
              위젯에서 등록하거나 체크한 할 일은 본인 컴퓨터의 <code>내 문서\NEWSchoolWidget\todos.json</code> 파일에 안전하게 자동 저장되므로, 컴퓨터를 껐다 켜도 내용이 그대로 유지됩니다.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="font-bold text-blue-300 mb-1">Q. 위젯을 종료하거나 다시 켜고 싶어요.</div>
            <p className="text-slate-400 leading-relaxed">
              위젯 오른쪽 상단의 <strong>[✕]</strong> 닫기 버튼을 누르면 언제든지 깔끔하게 종료됩니다. 다시 켤 때는 스크립트 또는 .bat 파일을 다시 실행하시면 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
