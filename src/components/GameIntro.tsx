import React, { useState } from 'react';
import { Shield, Sparkles, Compass, Swords, ArrowRight, UserCheck, Volume2, CheckCircle2, ChevronLeft, Crown, Landmark } from 'lucide-react';

interface GameIntroProps {
  gameMode?: 'gojoseon' | 'jumong';
  onSelectGameMode?: (mode: 'gojoseon' | 'jumong') => void;
  onStartGame: () => void;
}

export const GameIntro: React.FC<GameIntroProps> = ({
  gameMode = 'gojoseon',
  onSelectGameMode,
  onStartGame
}) => {
  // 'title' -> 'instructions'
  const [screenStep, setScreenStep] = useState<'title' | 'instructions'>('title');
  const isGojoseon = gameMode === 'gojoseon';

  return (
    <div
      id="game-intro-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-slate-100 overflow-y-auto p-4 sm:p-6"
      style={{
        backgroundImage: 'radial-gradient(ellipse at top, #1e293b 0%, #090d16 70%, #020617 100%)'
      }}
    >
      {/* Decorative Traditional Border Corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/50 pointer-events-none" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/50 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/50 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/50 pointer-events-none" />

      {/* Background Subtle Radial Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {screenStep === 'title' ? (
        /* =========================================================================
           STEP 1: 타이틀 화면 (게임 제목, 제작자, 게임의 목적, 게임시작 버튼)
           ========================================================================= */
        <div
          id="intro-title-screen"
          className="relative max-w-2xl w-full bg-slate-900/90 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center my-auto animate-in fade-in zoom-in-95 duration-300"
        >
          {/* Game Mode Selector Tabs */}
          {onSelectGameMode && (
            <div className="mb-4 flex items-center bg-slate-950 p-1 rounded-2xl border border-amber-500/40 shadow">
              <button
                type="button"
                onClick={() => onSelectGameMode('gojoseon')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isGojoseon
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>고조선 건국 (단군 신화)</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectGameMode('jumong')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  !isGojoseon
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>고구려 건국 (주몽 이야기)</span>
              </button>
            </div>
          )}

          {/* Top Emblem Badge */}
          <div
            id="intro-emblem"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg border-2 border-amber-300/40 mb-4"
          >
            {isGojoseon ? (
              <Landmark className="w-9 h-9 sm:w-11 sm:h-11 text-slate-950 drop-shadow" />
            ) : (
              <Crown className="w-9 h-9 sm:w-11 sm:h-11 text-slate-950 fill-slate-950 drop-shadow" />
            )}
          </div>

          {/* Subtag & Author */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span
              id="intro-curriculum-tag"
              className="text-xs sm:text-sm font-bold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full"
            >
              초등 5학년 사회과 역사 탐구
            </span>
            <span
              id="intro-author-badge"
              className="text-xs sm:text-sm font-extrabold px-3 py-1 bg-sky-950 text-sky-300 border border-sky-400/50 rounded-full flex items-center gap-1 shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>제작자: 이현균선생님</span>
            </span>
          </div>

          {/* Main Title */}
          <h1
            id="intro-main-title"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-300 tracking-tight leading-tight mb-2 drop-shadow-md"
          >
            {isGojoseon ? (
              <>
                대한민국의 시작,
                <br />
                <span className="text-white">찬란한 고조선으로부터</span>
              </>
            ) : (
              <>
                고구려의 빛을 밝혀라,
                <br />
                <span className="text-white">소년주몽부터 동명성왕까지</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-amber-400/90 font-medium mb-6">
            {isGojoseon
              ? '환웅의 홍익인간 뜻과 웅녀의 인내, 국조 단군왕검의 고조선 건국 신화'
              : '부여의 햇살에서 태어난 영웅, 대제국 고구려의 기틀을 세우다'}
          </p>

          {/* Goal Box: 게임의 목적 */}
          <div
            id="intro-purpose-box"
            className="w-full bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-2.5 shadow-inner"
          >
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>🎯 탐험 목표와 학습 목적</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isGojoseon ? (
                <>
                  본 게임은 하늘나라 환인의 아들 <strong className="text-amber-200">‘환웅’</strong>이
                  천부인 3개와 풍백·운사·우사를 이끌고 신시를 열고,
                  동굴 속 곰과 호랑이의 시련을 거쳐 태어난 <strong className="text-amber-200">‘단군왕검’</strong>이
                  기원전 2333년 우리 역사상 최초의 국가 <strong className="text-amber-200">‘고조선(조선)’</strong>을 건국하기까지의
                  단군 신화 10단계를 직접 걸으며 체험하는 <strong>2D 역사 탐험 롤플레잉 게임</strong>입니다.
                </>
              ) : (
                <>
                  본 게임은 부여의 신비한 알에서 태어난 <strong className="text-amber-200">‘소년 주몽’</strong>이
                  수많은 시련과 대소왕자의 시기를 극복하고, 의형제들과 함께 남쪽으로 탈출하여
                  압록강 지류 졸본에 <strong className="text-amber-200">‘고구려’</strong>를 건국하기까지의
                  생생한 역사와 건국 설화를 직접 체험하는 <strong>2D 역사 탐험 교육 게임</strong>입니다.
                </>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-xs text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>10단계의 신화 속 역사적 결단과 인물 대화</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-xs text-slate-300">
                <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {isGojoseon ? '천상 태자 환웅에서 국조 단군왕검으로 외형 진화' : '소년에서 제왕(동명성왕)으로 외형 진화'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              id="intro-btn-start"
              onClick={() => setScreenStep('instructions')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 active:scale-95 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>게임 시작</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        /* =========================================================================
           STEP 2: 게임 주의사항 및 탐험 조작 안내 화면
           ========================================================================= */
        <div
          id="intro-notice-screen"
          className="relative max-w-2xl w-full bg-slate-900/90 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col my-auto animate-in fade-in slide-in-from-right-4 duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                📜
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-amber-300">
                  출발 전 주의사항 & 탐험 수칙
                </h2>
                <p className="text-xs text-slate-400">
                  {isGojoseon ? '고조선의 첫 발걸음을 떼기 전 반드시 확인하세요!' : '고구려의 빛을 밝히기 전 반드시 확인하세요!'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setScreenStep('title')}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>이전으로</span>
            </button>
          </div>

          {/* Notice List */}
          <div className="space-y-3 mb-6 overflow-y-auto max-h-[50vh] pr-1">
            <div className="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>탐험 이동과 대화하기</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  키보드의 <strong>[W, A, S, D]</strong> 또는 <strong>[방향키]</strong>, 태블릿 및 모바일에서는 화면 좌측 하단의 <strong>[가상 조이스틱]</strong>을 밀어 부드럽게 이동합니다.
                  목적지의 역사 속 인물에 접근하여 <strong>[E] 키</strong> 또는 <strong>[대화하기]</strong> 버튼을 누르면 대화가 시작됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-amber-400" />
                  <span>역사적 상황 판단과 퀴즈</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  인물과의 생생한 대화를 읽고 <strong>역사적 결단 퀴즈</strong>를 풉니다. 틀린 선택을 하더라도
                  정답과 역사 속 진실 해설을 확인한 뒤 바로 해당 체크포인트에서 다시 도전할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>황금빛 길잡이 유도선 활용</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  바닥에 표시되는 <strong>황금빛 점선</strong>과 화면 우측 상단의 <strong>나침반/남은 거리 안내</strong>를
                  따라가면 넓은 맵에서도 길을 잃지 않고 다음 목적지를 쉽게 찾을 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>교실 환경 및 소리 설정</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  학교 수업 중 소리가 필요 없는 경우 상단 바의 <strong>[소리 켜기/끄기]</strong>를 누르세요.
                  또한 상단 <strong>[단일 HTML 저장]</strong> 버튼으로 인터넷이 없는 환경에서도 단일 파일로 학습할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Enter Game Button */}
          <button
            id="intro-btn-enter-game"
            onClick={onStartGame}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 active:scale-95 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>
              {isGojoseon ? '주의사항 확인 완료! 찬란한 고조선 건국 탐험 출발' : '주의사항 확인 완료! 고구려 건국 모험 출발'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
