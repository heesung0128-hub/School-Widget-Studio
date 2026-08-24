import React, { useState, useRef, useEffect } from 'react';
import { WidgetConfig } from '../types';
import { SchoolWidgetCard } from './SchoolWidgetCard';
import { 
  Monitor, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Maximize2, 
  Sliders, 
  Terminal, 
  RefreshCw,
  LayoutGrid
} from 'lucide-react';

interface DesktopSimulatorProps {
  config: WidgetConfig;
  onUpdateConfig: (newConfig: WidgetConfig) => void;
}

export const DesktopSimulator: React.FC<DesktopSimulatorProps> = ({
  config,
  onUpdateConfig,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [wallpaper, setWallpaper] = useState<'bloom' | 'nature' | 'minimal' | 'dark'>('bloom');
  const [dualMonitor, setDualMonitor] = useState<boolean>(false);
  const [activeMonitor, setActiveMonitor] = useState<1 | 2>(1);
  const [snappedMessage, setSnappedMessage] = useState<string | null>(null);

  // Initialize position to top-right on mount or container resize
  const snapToTopRight = (monitorIndex: 1 | 2 = activeMonitor) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const margin = config.snapMargin || 20;
    const widgetWidth = config.widgetWidth || 330;

    let targetX = rect.width - widgetWidth - margin;
    if (dualMonitor) {
      const halfWidth = rect.width / 2;
      if (monitorIndex === 1) {
        // First monitor top-right
        targetX = halfWidth - widgetWidth - margin;
      } else {
        // Second monitor top-right
        targetX = rect.width - widgetWidth - margin;
      }
    }

    setPosition({
      x: Math.max(margin, targetX),
      y: margin,
    });

    setSnappedMessage(`모니터 ${monitorIndex} 우측 상단으로 자동 스냅되었습니다!`);
    setTimeout(() => setSnappedMessage(null), 2500);
  };

  useEffect(() => {
    snapToTopRight(activeMonitor);
  }, [dualMonitor, config.snapMargin, config.widgetWidth]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow drag when clicking header or drag handle
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('form')) {
      return;
    }

    setIsDragging(true);
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - containerRect.left - position.x,
        y: e.clientY - containerRect.top - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    setPosition({
      x: Math.max(10, Math.min(containerRect.width - (config.widgetWidth || 330) - 10, newX)),
      y: Math.max(10, Math.min(containerRect.height - 150, newY)),
    });
  };

  const handleMouseUp = () => {
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);

    // Determine which monitor the widget was dropped in
    const containerRect = containerRef.current.getBoundingClientRect();
    let targetMon: 1 | 2 = 1;
    if (dualMonitor) {
      const midPoint = containerRect.width / 2;
      targetMon = position.x > midPoint ? 2 : 1;
      setActiveMonitor(targetMon);
    }

    // Snap to top-right of that monitor
    snapToTopRight(targetMon);
  };

  // Wallpaper styles
  const wallpapers = {
    bloom: 'bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-950',
    nature: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900',
    minimal: 'bg-gradient-to-br from-slate-900 via-zinc-900 to-stone-900',
    dark: 'bg-gradient-to-br from-black via-slate-950 to-neutral-900',
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Desktop Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-bold flex items-center gap-1.5 text-slate-200">
            <Monitor className="w-4 h-4 text-blue-400" />
            윈도우 바탕화면 실시간 시뮬레이터
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px]">
            드래그 후 손을 떼면 우측 상단 자동 스냅
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dual monitor toggle */}
          <button
            type="button"
            onClick={() => setDualMonitor(!dualMonitor)}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              dualMonitor
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{dualMonitor ? '듀얼 모니터 (ON)' : '싱글 모니터'}</span>
          </button>

          {/* Reset position button */}
          <button
            type="button"
            onClick={() => snapToTopRight(activeMonitor)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>위치 재정렬</span>
          </button>
        </div>
      </div>

      {/* Interactive Mock Desktop Canvas */}
      <div
        ref={containerRef}
        id="windows-mock-desktop"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`relative w-full min-h-[680px] h-[680px] rounded-2xl border border-slate-700/60 overflow-hidden shadow-inner select-none ${wallpapers[wallpaper]}`}
      >
        {/* Subtle grid and decorative background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        
        {/* Dual monitor divider indicator */}
        {dualMonitor && (
          <div className="absolute top-0 bottom-10 left-1/2 -translate-x-1/2 border-r-2 border-dashed border-white/20 flex flex-col items-center justify-start pt-3 z-0 pointer-events-none">
            <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] text-slate-300 border border-white/10 backdrop-blur-sm">
              🖥️ 모니터 1 ┃ 🖥️ 모니터 2 (구분선)
            </span>
          </div>
        )}

        {/* Snapped Notification Toast */}
        {snappedMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-blue-600/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            {snappedMessage}
          </div>
        )}

        {/* Desktop Icons Placeholder (Adds Windows realism) */}
        <div className="absolute top-4 left-4 space-y-3 z-10 pointer-events-none">
          <div className="flex flex-col items-center w-16 p-1.5 rounded hover:bg-white/10 text-white/90 text-center">
            <div className="w-8 h-8 rounded-lg bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-sm shadow-sm mb-1">
              📂
            </div>
            <span className="text-[10px] drop-shadow-md font-medium">내 PC</span>
          </div>
          <div className="flex flex-col items-center w-16 p-1.5 rounded hover:bg-white/10 text-white/90 text-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-sm shadow-sm mb-1">
              🗑️
            </div>
            <span className="text-[10px] drop-shadow-md font-medium">휴지통</span>
          </div>
          <div className="flex flex-col items-center w-16 p-1.5 rounded hover:bg-white/10 text-white/90 text-center">
            <div className="w-8 h-8 rounded-lg bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-sm shadow-sm mb-1">
              🏫
            </div>
            <span className="text-[10px] drop-shadow-md font-medium">나이스</span>
          </div>
        </div>

        {/* Draggable Widget Component */}
        <div
          id="draggable-school-widget"
          onMouseDown={handleMouseDown}
          className={`absolute z-20 transition-all ${
            isDragging ? 'cursor-grabbing scale-[1.01] shadow-2xl opacity-90' : 'transition-all duration-300 ease-out'
          }`}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
        >
          <SchoolWidgetCard
            config={config}
            onUpdateConfig={onUpdateConfig}
            isDraggable
          />
        </div>

        {/* Windows 11 Taskbar Simulation */}
        <div className="absolute bottom-0 left-0 right-0 h-11 bg-slate-950/80 backdrop-blur-xl border-t border-slate-700/50 flex items-center justify-between px-3 z-30">
          {/* Windows Start and Center Icons */}
          <div className="flex items-center gap-1.5 mx-auto">
            <div className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-blue-400 font-bold text-sm cursor-pointer transition-colors">
              🪟
            </div>
            <div className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-300 text-xs cursor-pointer transition-colors">
              🔍
            </div>
            <div className="w-7 h-7 rounded-md bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 text-xs cursor-pointer">
              🏫
            </div>
            <div className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-300 text-xs cursor-pointer transition-colors">
              📁
            </div>
          </div>

          {/* System Tray (Clock & Wifi) */}
          <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
            <span className="text-[11px] text-slate-400">ENG</span>
            <div className="text-right leading-tight text-[10px]">
              <div>{new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-slate-400">{new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
