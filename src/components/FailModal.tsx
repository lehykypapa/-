import React from 'react';
import { RotateCcw, AlertTriangle, Lightbulb } from 'lucide-react';
import { StageOption } from '../types';

interface FailModalProps {
  wrongOption: StageOption;
  historyLesson: string;
  onRetry: () => void;
}

export const FailModal: React.FC<FailModalProps> = ({
  wrongOption,
  historyLesson,
  onRetry
}) => {
  return (
    <div
      id="fail-modal-backdrop"
      className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        id="fail-modal-card"
        className="bg-slate-900 border-2 border-red-500/80 rounded-2xl w-full max-w-md p-6 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Warning Icon Badge */}
        <div
          id="fail-icon-badge"
          className="w-14 h-14 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl font-black border-2 border-red-500 mb-3 shadow-inner"
        >
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>

        <h3 id="fail-title" className="text-xl font-black text-red-400 mb-2 tracking-wide">
          건국 실패!
        </h3>

        {/* Failure reason */}
        <div
          id="fail-feedback-box"
          className="bg-slate-800/90 rounded-xl p-4 mb-4 text-left border border-red-500/30 text-slate-200 text-sm leading-relaxed"
        >
          <p className="font-semibold text-red-300 mb-1">⚠️ 아쉽습니다!</p>
          <p>{wrongOption.feedback}</p>
        </div>

        {/* History truth callout */}
        <div
          id="fail-history-note"
          className="bg-red-950/40 border border-red-900/60 p-3.5 rounded-xl text-xs text-red-200 text-left mb-5 flex items-start gap-2"
        >
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">역사 속 진실: </strong>
            <span>{historyLesson}</span>
          </div>
        </div>

        {/* Retry Button */}
        <button
          id="btn-retry-checkpoint"
          onClick={onRetry}
          className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-base cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>다시 도전하기</span>
        </button>
      </div>
    </div>
  );
};
