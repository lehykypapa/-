import React from 'react';
import { Crown, Sparkles, Printer, RotateCcw, CheckCircle2, Award, Landmark } from 'lucide-react';
import { STAGES } from '../data/stages';
import { GOJOSEON_STAGES } from '../data/gojoseonStages';

interface VictoryModalProps {
  gameMode?: 'gojoseon' | 'jumong';
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ gameMode = 'gojoseon', onRestart }) => {
  const isGojoseon = gameMode === 'gojoseon';
  const activeStages = isGojoseon ? GOJOSEON_STAGES : STAGES;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="victory-modal-backdrop"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in zoom-in-95 duration-300"
    >
      <div
        id="victory-modal-card"
        className="bg-slate-900 border-2 border-amber-400 rounded-3xl w-full max-w-2xl p-6 sm:p-8 text-center shadow-2xl relative my-auto"
      >
        {/* Animated Crown/Landmark Badge */}
        <div
          id="victory-crown-badge"
          className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center text-4xl font-black shadow-xl mb-4 animate-bounce"
        >
          {isGojoseon ? (
            <Landmark className="w-10 h-10 text-slate-950 stroke-[2.5]" />
          ) : (
            <Crown className="w-10 h-10 text-slate-950 stroke-[2.5]" />
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isGojoseon ? '기원전 2333년 · 국조 단군왕검' : '기원전 37년 · 동명성왕'}</span>
        </div>

        <h2 id="victory-headline" className="text-2xl sm:text-3xl font-black text-amber-300 mb-2">
          {isGojoseon ? '축하합니다! 고조선 건국 성공!' : '축하합니다! 고구려 건국 성공!'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-md mx-auto leading-relaxed">
          {isGojoseon ? (
            <>
              환웅의 널리 인간을 이롭게 하는 <strong className="text-amber-300 font-bold">홍익인간</strong> 정신과
              웅녀의 인내를 이어받아 우리 역사상 최초의 국가{' '}
              <strong className="text-amber-300 font-bold">고조선</strong>을 세웠습니다!
            </>
          ) : (
            <>
              주몽이 숱한 역경을 이겨내고 충직한 동지들과 소서노의 힘을 합쳐 위대한 대제국{' '}
              <strong className="text-amber-300 font-bold">고구려</strong>를 세웠습니다!
            </>
          )}
        </p>

        {/* 5th Grade History Curriculum Summary Section */}
        <div
          id="victory-summary-card"
          className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 text-left mb-6 max-h-64 overflow-y-auto shadow-inner"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-700 mb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-amber-300 text-sm">
              {isGojoseon
                ? '📜 초등 5학년 역사 수업 정리: 단군 신화와 고조선 건국 (제작: 이현균선생님)'
                : '📜 초등 5학년 역사 수업 정리: 주몽의 고구려 건국 (제작: 이현균선생님)'}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {activeStages.map(s => (
              <div
                key={s.id}
                className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-750 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-200">
                    {s.id}단계. {s.location.split(' ')[0]}
                  </span>
                  <p className="text-slate-300 mt-0.5 text-[11px] leading-tight">
                    {s.historyLesson}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            id="btn-restart-game"
            onClick={onRestart}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 탐험하기</span>
          </button>

          <button
            id="btn-print-certificate"
            onClick={handlePrint}
            className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs sm:text-sm"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>결과표 인쇄</span>
          </button>
        </div>
      </div>
    </div>
  );
};
