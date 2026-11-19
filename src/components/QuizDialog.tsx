import React, { useEffect, useState, useMemo } from 'react';
import { StageData, StageOption } from '../types';
import { Sparkles, MessageCircleQuestion, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { getJumongEvolution } from '../utils/evolution';
import { sounds } from '../utils/audio';

interface QuizDialogProps {
  stage: StageData;
  onSelectOption: (option: StageOption) => void;
}

export const QuizDialog: React.FC<QuizDialogProps> = ({ stage, onSelectOption }) => {
  // Sequence flow: 'quiz' (Situation & Quiz) -> 'dialogue' (Characters conversing after correct choice)
  const [phase, setPhase] = useState<'quiz' | 'dialogue'>('quiz');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [selectedCorrectOption, setSelectedCorrectOption] = useState<StageOption | null>(null);

  // 1번, 2번 정답 위치를 스테이지별로 무작위 셔플
  const shuffledOptions = useMemo(() => {
    const list = [...stage.options];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [stage.id]);

  const evo = getJumongEvolution(stage.id);
  const dialogueLines = stage.dialogueScript || [];
  const currentLine = dialogueLines[dialogueIndex];
  const hasDialogue = dialogueLines.length > 0;

  // Handle option selection during Quiz phase
  const handleChooseOption = (option: StageOption) => {
    if (!option.isCorrect) {
      // Wrong option -> trigger fail modal directly
      onSelectOption(option);
    } else {
      // Correct historical choice!
      sounds.playSuccess();
      setSelectedCorrectOption(option);

      if (hasDialogue) {
        // Move to Phase 2: Characters exchange dramatic dialogue
        setPhase('dialogue');
        setDialogueIndex(0);
      } else {
        // No dialogue script -> proceed immediately
        onSelectOption(option);
      }
    }
  };

  const handleNextDialogue = () => {
    if (dialogueIndex < dialogueLines.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      handleCompleteStage();
    }
  };

  const handleCompleteStage = () => {
    const correctOpt = selectedCorrectOption || stage.options.find(o => o.isCorrect) || stage.options[0];
    onSelectOption(correctOpt);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'quiz') {
        if (e.key === '1' && shuffledOptions[0]) {
          handleChooseOption(shuffledOptions[0]);
        } else if (e.key === '2' && shuffledOptions[1]) {
          handleChooseOption(shuffledOptions[1]);
        }
      } else if (phase === 'dialogue') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNextDialogue();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, dialogueIndex, dialogueLines, stage, selectedCorrectOption]);

  return (
    <div
      id="quiz-modal-backdrop"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200"
    >
      <div
        id="quiz-dialog-container"
        className="bg-slate-900 border-2 border-amber-500 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header with Stage & NPC info */}
        <div
          id="quiz-speaker-header"
          className="bg-gradient-to-r from-slate-800 via-slate-850 to-slate-900 border-b border-amber-500/30 px-5 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              id="quiz-npc-avatar"
              style={{ backgroundColor: stage.npcAvatarColor }}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black text-slate-950 shadow-md border-2 border-white/20 shrink-0"
            >
              {stage.npcName.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="quiz-npc-name" className="text-sm sm:text-base font-bold text-amber-300">
                  {stage.npcName}
                </h3>
                <span className="text-[11px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-medium">
                  {stage.npcRole}
                </span>
              </div>
              <p id="quiz-stage-subtitle" className="text-xs text-slate-400">
                {stage.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {phase === 'dialogue' ? (
              <button
                onClick={handleCompleteStage}
                className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer px-2 py-1"
              >
                대화 건너뛰고 완료 ⏩
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs text-amber-400/90 font-medium bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>상황 판단 퀴즈</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {phase === 'quiz' ? (
            /* ========================================================
               STEP 1: Situation Presentation & Historical Quiz
               (상황이 부여된 후 역사 퀴즈 풀기)
               ======================================================== */
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Situation Background */}
              <div
                id="quiz-situation-box"
                className="bg-slate-800/80 rounded-xl p-4 border border-amber-500/30 text-slate-200 text-xs sm:text-sm leading-relaxed"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-bold text-amber-300 text-xs sm:text-sm">
                    📍 역사적 상황 부여 (Situation)
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed pl-1">
                  {stage.story}
                </p>
              </div>

              {/* Question Banner */}
              <div
                id="quiz-question-box"
                className="bg-amber-950/40 border-l-4 border-amber-400 p-4 rounded-r-xl flex items-start gap-3"
              >
                <MessageCircleQuestion className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-amber-400 font-bold block mb-1">
                    역사적 결단의 순간!
                  </span>
                  <h4
                    id="quiz-question-text"
                    className="font-bold text-amber-200 text-sm sm:text-base leading-snug"
                  >
                    {stage.question}
                  </h4>
                </div>
              </div>

              {/* Choices Options (무작위 셔플된 1, 2번 선택지) */}
              <div id="quiz-options-list" className="space-y-3 pt-1">
                {shuffledOptions.map((option, idx) => (
                  <button
                    key={idx}
                    id={`quiz-option-btn-${idx + 1}`}
                    onClick={() => handleChooseOption(option)}
                    className="w-full text-left p-3.5 sm:p-4 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-amber-500/20 hover:border-amber-400 active:scale-[0.99] text-slate-100 text-sm sm:text-base font-medium transition cursor-pointer flex items-start gap-3 group shadow-sm"
                  >
                    <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-400 transition">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-slate-200 group-hover:text-amber-200 leading-normal">
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>💡 키보드 [1] 또는 [2] 키로도 선택지를 고를 수 있습니다.</span>
                <span className="text-amber-400/90 font-medium">정답을 맞히면 인물과의 대화가 이어집니다</span>
              </div>
            </div>
          ) : (
            /* ========================================================
               STEP 2: Characters Dialogue Scene
               (퀴즈를 푼 후 등장인물들이 대화를 나누는 순서)
               ======================================================== */
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Success Banner */}
              <div
                id="dialogue-success-banner"
                className="bg-emerald-950/50 border border-emerald-500/50 rounded-xl p-3 flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-bold">지혜로운 역사적 결단입니다!</span>
                  <span className="text-slate-300 hidden sm:inline">결단에 따라 인물들의 대화가 펼쳐집니다.</span>
                </div>
                <span className="text-emerald-400 font-bold text-xs bg-emerald-900/50 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  결단 성공 ✨
                </span>
              </div>

              {/* Chosen Decision Reminder */}
              {selectedCorrectOption && (
                <div className="bg-slate-800/60 rounded-lg px-3.5 py-2 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2">
                  <span className="text-amber-400 font-bold shrink-0">내린 결단:</span>
                  <span className="truncate italic text-slate-200">"{selectedCorrectOption.text}"</span>
                </div>
              )}

              {/* Interactive Speech Box */}
              {currentLine && (
                <div
                  id="dialogue-speech-box"
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-lg ${
                    currentLine.isJumong
                      ? 'bg-sky-950/40 border-sky-400/60 ml-3 sm:ml-6'
                      : 'bg-slate-800/90 border-amber-500/60 mr-3 sm:mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          currentLine.isJumong ? 'bg-sky-400' : 'bg-amber-400'
                        }`}
                      />
                      <span className="font-bold text-sm text-slate-100">
                        {currentLine.speaker}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({currentLine.speakerRole})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {dialogueIndex + 1} / {dialogueLines.length}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed mt-2 pl-4 border-l-2 border-slate-600">
                    "{currentLine.text}"
                  </p>

                  {/* Jumong status reminder if Jumong is talking */}
                  {currentLine.isJumong && (
                    <div className="mt-3 pt-2 border-t border-sky-900/60 flex items-center gap-2 text-[11px] text-sky-300">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>현재 복식: {evo.title} ({evo.outfitName})</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  💡 [Space] 또는 [Enter] 키로 대화 진행
                </span>
                {dialogueIndex < dialogueLines.length - 1 ? (
                  <button
                    id="btn-dialogue-next"
                    onClick={handleNextDialogue}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>다음 대화 듣기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="btn-dialogue-finish"
                    onClick={handleCompleteStage}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-600 hover:from-emerald-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>역사적 업적 달성! 다음 단계로 나아가기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

