import React from 'react';
import { Volume2, VolumeX, BookOpen, Download, Shield, Sparkles, Home } from 'lucide-react';
import { StageData } from '../types';
import { generateStandaloneHtml } from '../game/standaloneHtml';
import { generateStandaloneGojoseonHtml } from '../game/standaloneGojoseonHtml';
import { getJumongEvolution, getGojoseonEvolution } from '../utils/evolution';

interface TopBarProps {
  currentStage: StageData;
  isMuted: boolean;
  gameMode?: 'gojoseon' | 'jumong';
  onToggleMute: () => void;
  onOpenHelp: () => void;
  onOpenTitle?: () => void;
  onSelectGameMode?: (mode: 'gojoseon' | 'jumong') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentStage,
  isMuted,
  gameMode = 'gojoseon',
  onToggleMute,
  onOpenHelp,
  onOpenTitle,
  onSelectGameMode
}) => {
  const progressPercent = Math.round((currentStage.id / 10) * 100);
  const evo = gameMode === 'gojoseon' ? getGojoseonEvolution(currentStage.id) : getJumongEvolution(currentStage.id);

  const handleDownloadStandalone = () => {
    if (gameMode === 'gojoseon') {
      const htmlContent = generateStandaloneGojoseonHtml();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '대한민국의_시작_찬란한_고조선으로부터.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const htmlContent = generateStandaloneHtml();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '고구려의_빛을_밝혀라_소년주몽부터_동명성왕까지.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <header
      id="game-topbar"
      className="w-full bg-slate-900/95 border-b border-amber-500/40 px-3 sm:px-5 py-2 flex items-center justify-between z-30 shadow-lg shrink-0"
    >
      {/* Left: Stage info & Jumong Evolution Badge */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <div
          id="stage-badge"
          className="bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded-md text-xs sm:text-sm tracking-wide shrink-0 shadow-sm flex items-center gap-1"
        >
          <Shield className="w-3.5 h-3.5 fill-slate-950" />
          <span>{currentStage.id}/10단계</span>
        </div>

        {/* Jumong Evolution Indicator */}
        <div
          className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg border ${evo.badgeBg} ${evo.badgeBorder}`}
          title={evo.description}
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-400 text-slate-950">
            {evo.level}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-amber-200 leading-none flex items-center gap-1">
              <span>{evo.title}</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-[10px] text-slate-400 leading-none mt-0.5">
              {evo.outfitName}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <h1
            id="stage-headline"
            className="text-xs sm:text-sm font-bold text-amber-300 truncate"
          >
            {currentStage.title}
          </h1>
          <p id="stage-location-sub" className="text-[11px] text-slate-400 truncate">
            위치: {currentStage.location}
          </p>
        </div>
      </div>

      {/* Center: Progress Bar */}
      <div className="hidden lg:flex flex-col items-center w-48 px-2">
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
          <div
            id="topbar-progress-fill"
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-2.5 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">
          건국 진행도 <span className="text-amber-400 font-bold">{progressPercent}%</span>
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {onSelectGameMode && (
          <div className="hidden sm:flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => onSelectGameMode('gojoseon')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer transition ${
                gameMode === 'gojoseon'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="고조선 건국 신화 탐험 (단군 이야기)"
            >
              🏛️ 고조선
            </button>
            <button
              onClick={() => onSelectGameMode('jumong')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer transition ${
                gameMode === 'jumong'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="고구려 건국 탐험 (주몽 이야기)"
            >
              🏹 고구려
            </button>
          </div>
        )}

        {onOpenTitle && (
          <button
            id="btn-open-title"
            onClick={onOpenTitle}
            title="첫 타이틀 화면 및 제작자/주의사항 보기"
            className="p-1.5 sm:px-2.5 sm:py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">타이틀</span>
          </button>
        )}

        <button
          id="btn-sound-toggle"
          onClick={onToggleMute}
          title={isMuted ? '소리 켜기' : '소리 끄기'}
          className="p-1.5 sm:px-2.5 sm:py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition flex items-center gap-1 cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-red-400" />
              <span className="hidden md:inline">음소거</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">소리 ON</span>
            </>
          )}
        </button>

        <button
          id="btn-help-guide"
          onClick={onOpenHelp}
          title="게임 방법 및 수업 안내"
          className="p-1.5 sm:px-2.5 sm:py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition flex items-center gap-1 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span className="hidden md:inline">수업 도움말</span>
        </button>

        <button
          id="btn-download-html"
          onClick={handleDownloadStandalone}
          title="학교 수업용 단일 HTML 파일로 다운로드하여 오프라인에서 실행"
          className="px-2.5 py-1 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow transition flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">단일 HTML 저장</span>
        </button>
      </div>
    </header>
  );
};
