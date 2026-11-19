import { GOJOSEON_STAGES } from '../data/gojoseonStages';

export function generateStandaloneGojoseonHtml(): string {
  const stagesJson = JSON.stringify(GOJOSEON_STAGES);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>대한민국의 시작, 찬란한 고조선으로부터 (초등 5학년 역사 교육 게임)</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #020617;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif;
      user-select: none;
      -webkit-user-select: none;
      overflow: hidden;
    }
    canvas {
      image-rendering: pixelated;
    }
    @media print {
      body * { visibility: hidden; }
      #victoryModal, #victoryModal * { visibility: visible; }
      #victoryModal { position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: white !important; color: black !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body class="w-screen h-screen flex flex-col bg-slate-950">

  <!-- TOP BAR HUD -->
  <header class="h-14 bg-slate-900/90 border-b border-amber-500/30 px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none">
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
        🏛️
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs sm:text-sm font-extrabold text-amber-300">대한민국의 시작, 찬란한 고조선으로부터</span>
          <span class="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-semibold hidden md:inline">제작자: 이현균선생님</span>
        </div>
        <div class="text-[11px] text-slate-400 flex items-center gap-2">
          <span id="hudLocation" class="text-amber-200/90 font-medium">하늘나라 환인의 궁전</span>
          <span>•</span>
          <span id="hudStageNum" class="text-sky-400 font-bold">1 / 10 단계</span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button id="homeBtn" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-amber-300 cursor-pointer flex items-center gap-1">
        <span>🏠</span> <span class="hidden sm:inline">타이틀</span>
      </button>
      <button id="soundBtn" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 cursor-pointer">
        🔊 소리
      </button>
      <button id="helpBtn" class="px-2.5 py-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded text-amber-300 cursor-pointer">
        ❓ 도움말
      </button>
    </div>
  </header>

  <!-- MAIN CANVAS VIEW -->
  <main class="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950">
    <canvas id="gameCanvas" class="w-full h-full block touch-none"></canvas>

    <!-- FLOATING OBJECTIVE & COMPASS -->
    <div class="absolute top-3 left-3 max-w-sm bg-slate-900/85 backdrop-blur border border-amber-500/40 rounded-xl p-2.5 shadow-lg pointer-events-none z-10 hidden sm:block">
      <div class="text-[11px] font-bold text-amber-400 flex items-center gap-1">
        <span>🎯 현재 미션</span>
      </div>
      <div id="hudMissionText" class="text-xs font-semibold text-slate-100 mt-0.5">
        환인의 궁전 중앙 옥좌로 이동하여 아버지 환인 천제를 알현하세요.
      </div>
    </div>

    <!-- DISTANCE & DIRECTION COMPASS -->
    <div class="absolute top-3 right-3 bg-slate-900/85 backdrop-blur border border-amber-500/40 rounded-xl px-3 py-1.5 shadow-lg pointer-events-none z-10 flex items-center gap-2">
      <div id="compassArrow" class="text-amber-400 font-black text-base transform">➔</div>
      <div>
        <div class="text-[9px] text-slate-400 uppercase font-mono tracking-wider">목적지 거리</div>
        <div id="compassDist" class="text-xs font-bold text-amber-300">0 m</div>
      </div>
    </div>

    <!-- INTERACTION PROMPT BUTTON -->
    <div id="interactPrompt" class="absolute bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 hidden">
      <button class="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-2xl border-2 border-amber-200 flex items-center gap-2 cursor-pointer animate-bounce">
        <span>💬</span>
        <span id="interactText">대화하기 [E / Space]</span>
      </button>
    </div>

    <!-- ON-SCREEN TOUCH CONTROLS (VIRTUAL JOYSTICK & TALK BUTTON) -->
    <div id="touchControlsHUD" class="absolute inset-x-0 bottom-0 p-3 sm:p-5 pointer-events-none z-30 flex items-end justify-between select-none">
      <!-- 1. Left: Virtual Analog Joystick -->
      <div class="pointer-events-auto flex flex-col items-center select-none">
        <div id="joystickBase" class="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none transition-all shadow-2xl border-2 border-amber-500/50 bg-slate-950/80 backdrop-blur-md">
          <div class="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-amber-500/20 pointer-events-none"></div>
          <div class="absolute w-10 h-10 rounded-full border border-dashed border-amber-500/30 pointer-events-none"></div>
          <span class="absolute top-1 text-[10px] text-amber-400/60 font-black pointer-events-none">▲ 상</span>
          <span class="absolute bottom-1 text-[10px] text-amber-400/60 font-black pointer-events-none">하 ▼</span>
          <span class="absolute left-1.5 text-[10px] text-amber-400/60 font-black pointer-events-none">◀ 좌</span>
          <span class="absolute right-1.5 text-[10px] text-amber-400/60 font-black pointer-events-none">우 ▶</span>
          <div id="joystickKnob" class="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center pointer-events-none transition-transform duration-75 shadow-xl border-2 border-amber-200 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-slate-950">
            <div class="w-6 h-6 rounded-full border border-slate-950/30 flex items-center justify-center bg-amber-400/30">
              <div class="w-2 h-2 rounded-full bg-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="mt-1.5 px-3 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/40 text-[10px] sm:text-xs font-bold text-amber-300 flex items-center gap-1 shadow-md">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span>가상 조이스틱</span>
        </div>
      </div>

      <!-- 2. Right Talk Button -->
      <div class="pointer-events-auto flex flex-col items-end">
        <button id="btnAction" class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-amber-500 to-amber-600 active:scale-90 text-slate-950 font-black rounded-3xl shadow-2xl flex flex-col items-center justify-center border-2 border-amber-200 transition-all cursor-pointer">
          <span class="text-2xl">💬</span>
          <span class="text-xs sm:text-sm font-black mt-0.5">대화하기</span>
          <span class="text-[10px] opacity-80 font-bold">[터치]</span>
        </button>
      </div>
    </div>
  </main>

  <!-- MODAL: QUIZ & DIALOGUE -->
  <div id="quizModal" class="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <span id="modalLocation" class="text-xs font-bold text-amber-400">하늘나라 환인의 궁전</span>
          <h3 id="modalTitle" class="text-base sm:text-lg font-black text-slate-100">1단계: 뜻을 품다</h3>
        </div>
        <span class="text-xs px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded font-bold">역사적 결단</span>
      </div>

      <!-- Dialogue History -->
      <div id="dialogueBox" class="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-4 space-y-2.5 text-xs sm:text-sm">
      </div>

      <!-- Historical Question -->
      <div class="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3.5 mb-4">
        <div class="text-xs font-bold text-amber-400 mb-1">Q. 역사 퀴즈 미션</div>
        <p id="quizQuestion" class="text-xs sm:text-sm font-semibold text-slate-200"></p>
      </div>

      <!-- Options -->
      <div id="quizOptions" class="space-y-2.5">
      </div>
    </div>
  </div>

  <!-- MODAL: FAIL / RETRY -->
  <div id="failModal" class="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border-2 border-rose-500/80 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
      <div class="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-2xl mx-auto mb-3">
        ⚠️
      </div>
      <h3 class="text-lg font-black text-rose-300 mb-2">역사적 결단 실패!</h3>
      <p id="failFeedback" class="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800"></p>
      <button id="retryBtn" class="w-full py-3 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-xl cursor-pointer shadow-lg">
        이 단계에서 다시 도전하기
      </button>
    </div>
  </div>

  <!-- MODAL: STORY TRANSITION CUTSCENE -->
  <div id="transModal" class="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-center">
      <div id="transIcon" class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center justify-center text-3xl mx-auto mb-3">
        ✨
      </div>
      <div class="text-xs font-bold text-amber-400 mb-1">단계 완료 & 역사적 의미</div>
      <h3 id="transTitle" class="text-lg sm:text-xl font-black text-amber-200 mb-2"></h3>
      <p id="transQuote" class="text-xs sm:text-sm italic text-amber-300/90 bg-slate-950/70 p-3 rounded-xl border border-slate-800 mb-3"></p>
      <p id="transKnowledge" class="text-xs text-slate-300 leading-relaxed mb-5 text-left bg-slate-950/50 p-3 rounded-xl border border-slate-800/80"></p>
      <button id="transNextBtn" class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl cursor-pointer shadow-lg">
        다음 단계로 출발 ➔
      </button>
    </div>
  </div>

  <!-- MODAL: VICTORY & SUMMARY CERTIFICATE -->
  <div id="victoryModal" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md hidden flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-center my-auto">
      <div class="text-4xl mb-2">👑</div>
      <div class="text-xs font-bold text-amber-400 uppercase tracking-widest">Gojoseon Founding Master</div>
      <h2 class="text-2xl sm:text-3xl font-black text-amber-300 mb-1">고조선 건국 대탐험 완료!</h2>
      <p class="text-xs sm:text-sm text-slate-300 mb-4">
        기원전 2333년, 단군왕검께서 세우신 우리 겨레 최초의 국가 '고조선'의 역사를 훌륭하게 탐험하였습니다.
      </p>

      <div class="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 text-left space-y-2 mb-5 text-xs sm:text-sm text-slate-200">
        <div class="font-bold text-amber-300 border-b border-slate-800 pb-1.5 flex justify-between items-center">
          <span>📜 고조선 건국 핵심 정리</span>
          <span class="text-[11px] text-sky-400">초등 5학년 사회과 핵심</span>
        </div>
        <ul class="space-y-1.5 list-disc pl-4 text-slate-300 leading-relaxed">
          <li><strong>홍익인간(弘益人間):</strong> "널리 인간을 이롭게 한다"는 숭고한 건국 이념.</li>
          <li><strong>천부인 3개 & 3신하:</strong> 하늘의 권위(거울·방울·칼)와 농경에 필수적인 바람(풍백), 구름(운사), 비(우사).</li>
          <li><strong>곰과 호랑이의 시련:</strong> 쑥과 마늘을 먹으며 인내하여 사람이 된 웅녀(곰 토템 부족의 연합).</li>
          <li><strong>단군왕검(檀君王儉):</strong> 제사장(단군)이자 정치적 지배자(왕검)인 제정일치 지도자.</li>
          <li><strong>기원전 2333년 건국:</strong> 평양성과 아사달에 터를 잡은 우리 역사상 최초의 국가 (개천절의 유래).</li>
        </ul>
      </div>

      <div class="flex flex-wrap gap-2 justify-center no-print">
        <button id="printBtn" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer">
          🖨️ 수료증 인쇄
        </button>
        <button id="restartBtn" class="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow cursor-pointer">
          🔄 처음부터 다시 탐험하기
        </button>
      </div>
    </div>
  </div>

  <!-- GAME FIRST SCREENS: TITLE & NOTICE OVERLAY -->
  <div id="introOverlay" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-slate-100 overflow-y-auto p-4 sm:p-6" style="background-image: radial-gradient(ellipse at top, #1e293b 0%, #090d16 70%, #020617 100%)">
    <!-- STEP 1: TITLE SCREEN -->
    <div id="stepTitle" class="max-w-2xl w-full bg-slate-900/90 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center my-auto">
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg border-2 border-amber-300/40 mb-4 text-3xl sm:text-4xl">
        🏛️
      </div>
      <div class="flex flex-wrap items-center justify-center gap-2 mb-3">
        <span class="text-xs sm:text-sm font-bold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
          초등 5학년 사회과 역사 탐험
        </span>
        <span class="text-xs sm:text-sm font-extrabold px-3 py-1 bg-sky-950 text-sky-300 border border-sky-400/50 rounded-full">
          제작자: 이현균선생님
        </span>
      </div>
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-amber-300 tracking-tight leading-tight mb-2 drop-shadow-md">
        대한민국의 시작,
        <br />
        <span class="text-white">찬란한 고조선으로부터</span>
      </h1>
      <p class="text-xs sm:text-sm text-amber-400/90 font-medium mb-6">
        환웅의 홍익인간 뜻과 웅녀의 인내, 국조 단군왕검의 고조선 건국 신화
      </p>

      <div class="w-full bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-2.5 shadow-inner">
        <div class="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base border-b border-slate-800 pb-2">
          <span>🎯 탐험 목표와 학습 내용</span>
        </div>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
          본 게임은 하늘나라 환인의 아들 <strong class="text-amber-200">‘환웅’</strong>이 천부인 3개와 풍백·운사·우사를 이끌고 신시를 열고,
          동굴 속 곰과 호랑이의 시련을 거쳐 태어난 <strong class="text-amber-200">‘단군왕검’</strong>이
          기원전 2333년 우리 역사상 최초의 국가 <strong class="text-amber-200">‘고조선(조선)’</strong>을 건국하기까지의
          단군 신화 10단계를 직접 걸으며 체험하는 <strong>2D 역사 탐험 롤플레잉 게임</strong>입니다.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
          <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            ✨ 하늘나라 궁전부터 신시, 동굴, 아사달까지 4개 구역
          </div>
          <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            👑 천상의 태자 환웅에서 국조 단군왕검으로 외형 진화
          </div>
        </div>
      </div>

      <button id="btnTitleStart" class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 active:scale-95 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2">
        <span>게임 시작</span>
        <span>➡️</span>
      </button>
    </div>

    <!-- STEP 2: NOTICE SCREEN -->
    <div id="stepNotice" class="hidden max-w-2xl w-full bg-slate-900/90 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col my-auto">
      <div class="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-5">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            📜
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-black text-amber-300">
              출발 전 주의사항 & 탐험 수칙
            </h2>
            <p class="text-xs text-slate-400">
              고조선의 문을 열기 전 반드시 확인하세요!
            </p>
          </div>
        </div>
        <button id="btnNoticeBack" class="text-xs text-slate-400 hover:text-amber-300 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 cursor-pointer">
          ◀ 이전으로
        </button>
      </div>

      <div class="space-y-3 mb-6 overflow-y-auto max-h-[50vh] pr-1">
        <div class="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            1
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-100">🧭 탐험 이동과 대화하기</h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              키보드의 <strong>[W, A, S, D]</strong> 또는 <strong>[방향키]</strong>, 화면 하단의 가상 패드로 캐릭터를 이동합니다.
              목적지의 신화 속 인물(환인, 풍백, 곰과 호랑이, 웅녀 등)에게 접근하여 <strong>[Space / E 키]</strong> 또는 <strong>[대화하기]</strong> 버튼을 누르세요.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            2
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-100">⚔️ 역사적 결단 퀴즈 풀기</h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              인물들의 대화를 읽고 <strong>단군 신화의 핵심 퀴즈</strong>를 풉니다. 틀리더라도 역사적 설명과 정답을 확인한 후
              해당 단계에서 즉시 재도전할 수 있습니다.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            3
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-100">✨ 황금빛 길잡이 유도선 & 나침반</h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              바닥에 빛나는 <strong>황금빛 점선</strong>과 화면 우측 상단의 <strong>방향 화살표 / 거리 표시</strong>를
              따라가면 넓은 신화의 세상에서도 다음 목표를 쉽게 찾을 수 있습니다.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            4
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-100">🔊 소리 설정 & 언제든 타이틀 복귀</h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              학교 수업 중 음소거가 필요한 경우 상단 바의 <strong>[소리]</strong> 버튼을 누르세요.
              상단의 <strong>[타이틀]</strong> 버튼을 누르면 언제든지 첫 화면으로 돌아올 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <button id="btnNoticeEnter" class="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 active:scale-95 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2">
        <span>✅ 주의사항 확인 완료! 고조선 건국 모험 출발</span>
      </button>
    </div>
  </div>

  <script>
    const STAGES = ${stagesJson};
    const TILE_SIZE = 48;
    const MAP_WIDTH = 64;
    const MAP_HEIGHT = 56;

    // Tile Enums
    const TILES = {
      GRASS: 0,
      PATH: 1,
      WATER: 2,
      WALL: 3,
      TREE: 4,
      BRIDGE: 5,
      FLOOR: 6,
      MOUNTAIN: 7,
      FENCE: 8,
      CARPET: 9,
      STONE_PATH: 10
    };

    // Generate Gojoseon World Tilemap
    function generateWorldMap() {
      const map = [];
      for (let y = 0; y < MAP_HEIGHT; y++) {
        const row = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
          if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
            row.push(TILES.TREE);
            continue;
          }

          // Heavenly Palace (Zone 1: x: 4..26, y: 3..14)
          if (x >= 4 && x <= 26 && y >= 3 && y <= 14) {
            if ((y === 3 && x >= 5 && x <= 25) || (y === 14 && x >= 5 && x <= 25)) {
              if (x === 12 || x === 13) row.push(TILES.FLOOR);
              else row.push(TILES.WALL);
              continue;
            }
            if ((x === 5 || x === 25) && y >= 3 && y <= 14) {
              row.push(TILES.WALL);
              continue;
            }
            if (x > 5 && x < 25 && y > 3 && y < 14) {
              if (x >= 10 && x <= 14 && y >= 6 && y <= 12) row.push(TILES.CARPET);
              else if (x >= 18 && x <= 22 && y >= 6 && y <= 10) row.push(TILES.CARPET);
              else row.push(TILES.FLOOR);
              continue;
            }
          }

          // Clouds (y: 15..17)
          if (y >= 15 && y <= 17) {
            if (x >= 12 && x <= 14) row.push(TILES.STONE_PATH);
            else if (x % 3 === 0) row.push(TILES.FLOOR);
            else row.push(TILES.GRASS);
            continue;
          }

          // Sinsi & Sindansu (Zone 2: x: 10..26, y: 18..28)
          if (x === 13 && y >= 17 && y <= 24) { row.push(TILES.STONE_PATH); continue; }
          if (x >= 10 && x <= 26 && y >= 20 && y <= 28) {
            if (y === 24 && x >= 11 && x <= 25) { row.push(TILES.STONE_PATH); continue; }
            if (x >= 12 && x <= 16 && y >= 22 && y <= 26) { row.push(TILES.CARPET); continue; }
            row.push(TILES.PATH);
            continue;
          }

          // Path to Cave (y: 24, x: 25..38)
          if (y === 24 && x >= 25 && x <= 38) { row.push(TILES.PATH); continue; }

          // Cave of Trials (Zone 3: x: 38..58, y: 16..28)
          if (
            (x === 40 && y >= 18 && y <= 26 && y !== 22) ||
            (x === 56 && y >= 18 && y <= 26) ||
            (y === 18 && x >= 40 && x <= 56) ||
            (y === 26 && x >= 40 && x <= 56)
          ) {
            row.push(TILES.MOUNTAIN);
            continue;
          }
          if (x === 40 && y === 22) { row.push(TILES.STONE_PATH); continue; }
          if (x > 40 && x < 56 && y > 18 && y < 26) {
            if (x >= 48 && x <= 53 && y >= 20 && y <= 24) row.push(TILES.CARPET);
            else row.push(TILES.FLOOR);
            continue;
          }

          // River dividing Sinsi and Asadal (y: 33..36)
          if (y >= 33 && y <= 36) {
            if ((x >= 17 && x <= 19) || (x >= 30 && x <= 32)) row.push(TILES.BRIDGE);
            else row.push(TILES.WATER);
            continue;
          }

          // 4. Founding Altar, Asadal Capital & Chamseongdan (Zone 4: South, y: 37..55)
          if ((x === 17 || x === 18) && y >= 36 && y <= 44) { row.push(TILES.STONE_PATH); continue; }
          if ((y === 43 || y === 44) && x >= 16 && x <= 52) { row.push(TILES.STONE_PATH); continue; }
          if (x >= 49 && x <= 51 && y >= 44 && y <= 48) { row.push(TILES.STONE_PATH); continue; }
          if (x >= 45 && x <= 51 && (y === 46 || y === 47)) { row.push(TILES.STONE_PATH); continue; }

          if (x >= 16 && x <= 20 && y >= 37 && y <= 40) { row.push(TILES.CARPET); continue; }

          // Founding Altar (Stage 8)
          if (x >= 29 && x <= 35 && y >= 41 && y <= 47) {
            const isGate = ((x === 29 || x === 35) && (y === 43 || y === 44)) || ((y === 41 || y === 47) && (x >= 31 && x <= 33));
            if (isGate) row.push(TILES.STONE_PATH);
            else if (x === 29 || x === 35 || y === 41 || y === 47) row.push(TILES.WALL);
            else row.push(TILES.CARPET);
            continue;
          }

          // Asadal Palace (Stage 9)
          if (x >= 43 && x <= 49 && y >= 41 && y <= 47) {
            const isGate = ((x === 43 || x === 49) && (y === 43 || y === 44)) || ((y === 41 || y === 47) && (x >= 45 && x <= 47));
            if (isGate) row.push(TILES.STONE_PATH);
            else if (x === 43 || x === 49 || y === 41 || y === 47) row.push(TILES.FENCE);
            else row.push(TILES.FLOOR);
            continue;
          }

          // Chamseongdan Grand Altar (Stage 10)
          if (x >= 47 && x <= 54 && y >= 48 && y <= 53) {
            const isGrandNorthGate = y === 48 && (x >= 49 && x <= 52);
            const isWestGate = x === 47 && (y === 50 || y === 51);
            const isSouthGate = y === 53 && (x >= 50 && x <= 51);
            if (isGrandNorthGate || isWestGate || isSouthGate) row.push(TILES.STONE_PATH);
            else if (x === 47 || x === 54 || y === 48 || y === 53) row.push(TILES.WALL);
            else if (x >= 49 && x <= 52 && y >= 49 && y <= 52) row.push(TILES.CARPET);
            else row.push(TILES.FLOOR);
            continue;
          }

          const isAsadalChamsengdanZone = x >= 42 && x <= 56 && y >= 40 && y <= 55;
          if (!isAsadalChamsengdanZone && (x * 17 + y * 23) % 29 === 0 && x > 2 && y > 2 && x < MAP_WIDTH - 2 && y < MAP_HEIGHT - 2) {
            row.push(TILES.TREE);
          } else {
            row.push(TILES.GRASS);
          }
        }
        map.push(row);
      }
      return map;
    }

    const WORLD_MAP = generateWorldMap();

    // Sound Synthesizer (Web Audio API)
    class SoundEngine {
      constructor() {
        this.ctx = null;
      }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioContext();
        }
      }
      playStep() {
        if (isAudioMuted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      }
      playInteract() {
        if (isAudioMuted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      }
      playSuccess() {
        if (isAudioMuted || !this.ctx) return;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.09);
          osc.stop(this.ctx.currentTime + idx * 0.09 + 0.25);
        });
      }
      playFail() {
        if (isAudioMuted || !this.ctx) return;
        [280, 220, 160].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.12);
          osc.stop(this.ctx.currentTime + idx * 0.12 + 0.2);
        });
      }
    }

    const sound = new SoundEngine();

    function playSound(type) {
      sound.init();
      if (type === 'step') sound.playStep();
      if (type === 'interact') sound.playInteract();
      if (type === 'success') sound.playSuccess();
      if (type === 'fail') sound.playFail();
    }

    // Game State
    const player = {
      x: 12 * TILE_SIZE,
      y: 12 * TILE_SIZE,
      width: 32,
      height: 38,
      speed: 180,
      dir: 'down',
      stepTimer: 0,
      frame: 0
    };

    let currentStageId = 1;
    let isGameStarted = false;
    let isAudioMuted = false;
    let pendingNextStage = null;
    let lastTime = performance.now();
    const keys = { up: false, down: false, left: false, right: false };

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function getCurrentStage() {
      return STAGES.find(s => s.id === currentStageId) || STAGES[0];
    }

    function isNearTarget() {
      const stage = getCurrentStage();
      const targetPxX = stage.targetPos.x * TILE_SIZE + TILE_SIZE / 2;
      const targetPxY = stage.targetPos.y * TILE_SIZE + TILE_SIZE / 2;
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      const dist = Math.hypot(targetPxX - playerCenterX, targetPxY - playerCenterY);
      return dist <= 90;
    }

    function isSolid(tx, ty) {
      if (tx < 0 || tx >= MAP_WIDTH || ty < 0 || ty >= MAP_HEIGHT) return true;
      const t = WORLD_MAP[ty][tx];
      if (t === TILES.WATER) return true;
      if (t === TILES.BRIDGE && currentStageId < 7) return true;
      if ([TILES.WALL, TILES.TREE, TILES.MOUNTAIN, TILES.FENCE].includes(t)) return true;
      return false;
    }

    function updateTopBar() {
      const stage = getCurrentStage();
      document.getElementById('hudLocation').textContent = stage.location;
      document.getElementById('hudStageNum').textContent = stage.id + ' / 10 단계';
      document.getElementById('hudMissionText').textContent = stage.navHint;
    }

    function updateCompass() {
      const stage = getCurrentStage();
      const targetPxX = stage.targetPos.x * TILE_SIZE + TILE_SIZE / 2;
      const targetPxY = stage.targetPos.y * TILE_SIZE + TILE_SIZE / 2;
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;

      const dx = targetPxX - playerCenterX;
      const dy = targetPxY - playerCenterY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const dist = Math.round(Math.hypot(dx, dy) / 4);

      document.getElementById('compassArrow').style.transform = 'rotate(' + angle + 'deg)';
      document.getElementById('compassDist').textContent = dist + ' m';
    }

    function openQuizModal() {
      playSound('interact');
      const stage = getCurrentStage();
      document.getElementById('modalLocation').textContent = stage.location;
      document.getElementById('modalTitle').textContent = stage.stageNumber + '단계: ' + stage.title;
      document.getElementById('quizQuestion').textContent = stage.question;

      const dBox = document.getElementById('dialogueBox');
      dBox.innerHTML = '';
      stage.dialogueScript.forEach(line => {
        const div = document.createElement('div');
        div.className = 'flex items-start gap-2';
        div.innerHTML = '<span class="font-bold shrink-0 text-xs px-2 py-0.5 rounded ' +
          (line.isJumong ? 'bg-sky-950 text-sky-300 border border-sky-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30') +
          '">' + line.speaker + '</span>' +
          '<span class="text-slate-200 leading-relaxed">' + line.text + '</span>';
        dBox.appendChild(div);
      });

      const optBox = document.getElementById('quizOptions');
      optBox.innerHTML = '';
      stage.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-3.5 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 hover:border-amber-400 active:scale-98 transition flex items-start gap-3 cursor-pointer text-xs sm:text-sm font-medium';
        btn.innerHTML = '<span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0">' +
          (idx + 1) + '</span><span class="leading-relaxed">' + opt.text + '</span>';
        btn.onclick = () => handleAnswer(opt);
        optBox.appendChild(btn);
      });

      document.getElementById('quizModal').classList.remove('hidden');
    }

    function handleAnswer(option) {
      document.getElementById('quizModal').classList.add('hidden');
      if (option.isCorrect) {
        playSound('success');
        const stage = getCurrentStage();
        if (currentStageId >= 10) {
          document.getElementById('victoryModal').classList.remove('hidden');
        } else {
          pendingNextStage = currentStageId + 1;
          document.getElementById('transTitle').textContent = stage.transition.title;
          document.getElementById('transQuote').textContent = stage.transition.quote;
          document.getElementById('transKnowledge').textContent = stage.transition.backgroundKnowledge;
          document.getElementById('transModal').classList.remove('hidden');
        }
      } else {
        playSound('fail');
        document.getElementById('failFeedback').textContent = option.feedback;
        document.getElementById('failModal').classList.remove('hidden');
      }
    }

    document.getElementById('transNextBtn').onclick = () => {
      document.getElementById('transModal').classList.add('hidden');
      if (pendingNextStage) {
        currentStageId = pendingNextStage;
        pendingNextStage = null;
        updateTopBar();
      }
    };

    function tryInteract() {
      if (!isGameStarted) return;
      if (isNearTarget()) openQuizModal();
    }

    // Keyboard bindings
    window.addEventListener('keydown', e => {
      if (!isGameStarted) return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) keys.up = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keys.down = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = true;
      if (['Space', 'KeyE', 'Enter'].includes(e.code)) {
        e.preventDefault();
        tryInteract();
      }
    });

    window.addEventListener('keyup', e => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keys.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keys.down = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = false;
    });

    // Virtual Analog Joystick logic
    const jBase = document.getElementById('joystickBase');
    const jKnob = document.getElementById('joystickKnob');
    let jActiveId = null;

    function handleJoy(clientX, clientY) {
      if (!jBase || !jKnob) return;
      const rect = jBase.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      const maxR = Math.max(20, rect.width / 2 - 18);

      let kX = 0, kY = 0, nX = 0, nY = 0;
      if (dist > 0) {
        const cDist = Math.min(dist, maxR);
        kX = (dx / dist) * cDist;
        kY = (dy / dist) * cDist;
        nX = kX / maxR;
        nY = kY / maxR;
      }
      jKnob.style.transform = 'translate(' + kX + 'px, ' + kY + 'px)';

      if (isGameStarted) {
        keys.up = nY < -0.3;
        keys.down = nY > 0.3;
        keys.left = nX < -0.3;
        keys.right = nX > 0.3;
      }
    }

    if (jBase) {
      jBase.addEventListener('pointerdown', e => {
        e.preventDefault();
        try { if (e.pointerId !== undefined) jBase.setPointerCapture(e.pointerId); } catch(err) {}
        jActiveId = e.pointerId;
        handleJoy(e.clientX, e.clientY);
      });
      jBase.addEventListener('pointermove', e => {
        if (jActiveId === e.pointerId) {
          e.preventDefault();
          handleJoy(e.clientX, e.clientY);
        }
      });
      const endJoy = e => {
        if (jActiveId === e.pointerId) {
          try { if (e.pointerId !== undefined) jBase.releasePointerCapture(e.pointerId); } catch(err) {}
          jActiveId = null;
          if (jKnob) jKnob.style.transform = 'translate(0px, 0px)';
          keys.up = false;
          keys.down = false;
          keys.left = false;
          keys.right = false;
        }
      };
      jBase.addEventListener('pointerup', endJoy);
      jBase.addEventListener('pointercancel', endJoy);
      jBase.addEventListener('contextmenu', e => e.preventDefault());
    }

    document.getElementById('btnAction').onclick = tryInteract;
    document.getElementById('interactPrompt').onclick = tryInteract;

    // Intro Screen & Title Handlers
    document.getElementById('btnTitleStart').onclick = () => {
      playSound('success');
      document.getElementById('stepTitle').classList.add('hidden');
      document.getElementById('stepNotice').classList.remove('hidden');
    };

    document.getElementById('btnNoticeBack').onclick = () => {
      document.getElementById('stepNotice').classList.add('hidden');
      document.getElementById('stepTitle').classList.remove('hidden');
    };

    document.getElementById('btnNoticeEnter').onclick = () => {
      playSound('success');
      document.getElementById('introOverlay').classList.add('hidden');
      isGameStarted = true;
    };

    document.getElementById('homeBtn').onclick = () => {
      isGameStarted = false;
      keys.up = keys.down = keys.left = keys.right = false;
      document.getElementById('introOverlay').classList.remove('hidden');
      document.getElementById('stepTitle').classList.remove('hidden');
      document.getElementById('stepNotice').classList.add('hidden');
    };

    document.getElementById('retryBtn').onclick = () => {
      document.getElementById('failModal').classList.add('hidden');
    };
    document.getElementById('restartBtn').onclick = () => {
      currentStageId = 1;
      player.x = 12 * TILE_SIZE;
      player.y = 12 * TILE_SIZE;
      updateTopBar();
      document.getElementById('victoryModal').classList.add('hidden');
      isGameStarted = false;
      document.getElementById('introOverlay').classList.remove('hidden');
      document.getElementById('stepTitle').classList.remove('hidden');
      document.getElementById('stepNotice').classList.add('hidden');
    };
    document.getElementById('printBtn').onclick = () => window.print();
    document.getElementById('soundBtn').onclick = () => {
      isAudioMuted = !isAudioMuted;
      document.getElementById('soundBtn').textContent = isAudioMuted ? '🔇 음소거' : '🔊 소리';
    };
    document.getElementById('helpBtn').onclick = () => {
      alert('【고조선 건국 탐험 게임 도움말】\\n\\n1. [W, A, S, D] 또는 방향키로 환웅/단군 캐릭터를 조작합니다.\\n2. 바닥의 황금빛 점선과 화면 우측 상단의 나침반을 따라 이동하세요.\\n3. 목적지 인물에게 다가가 [E / Space] 키 또는 대화 버튼을 눌러 역사적 결단 퀴즈를 풉니다.\\n4. 10단계를 모두 완료하면 고조선 건국 수료증을 획득합니다.');
    };

    // Main Game Loop
    function gameLoop(now) {
      lastTime = now;

      if (!isGameStarted) {
        renderWorld(now, false);
        requestAnimationFrame(gameLoop);
        return;
      }

      let dx = 0, dy = 0;
      if (keys.up) { dy -= 1; player.dir = 'up'; }
      if (keys.down) { dy += 1; player.dir = 'down'; }
      if (keys.left) { dx -= 1; player.dir = 'left'; }
      if (keys.right) { dx += 1; player.dir = 'right'; }

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      const isMoving = dx !== 0 || dy !== 0;
      if (isMoving) {
        player.stepTimer += 16;
        if (player.stepTimer > 280) {
          player.stepTimer = 0;
          player.frame = (player.frame + 1) % 4;
          playSound('step');
        }

        const newX = player.x + dx * player.speed * 0.016;
        const newY = player.y + dy * player.speed * 0.016;

        const tileX1 = Math.floor((newX + 6) / TILE_SIZE);
        const tileX2 = Math.floor((newX + player.width - 6) / TILE_SIZE);
        const tileY1 = Math.floor((newY + player.height - 10) / TILE_SIZE);
        const tileY2 = Math.floor((newY + player.height - 2) / TILE_SIZE);

        if (!isSolid(tileX1, tileY1) && !isSolid(tileX2, tileY1) &&
            !isSolid(tileX1, tileY2) && !isSolid(tileX2, tileY2)) {
          player.x = newX;
          player.y = newY;
        }
      }

      const near = isNearTarget();
      const prompt = document.getElementById('interactPrompt');
      const btnAction = document.getElementById('btnAction');
      if (near) {
        prompt.classList.remove('hidden');
        if (btnAction) {
          btnAction.disabled = false;
          btnAction.className = 'w-22 h-22 sm:w-26 sm:h-26 bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 active:scale-90 text-slate-950 font-black rounded-3xl shadow-2xl flex flex-col items-center justify-center border-2 border-white ring-4 ring-amber-400/50 animate-bounce cursor-pointer';
          btnAction.innerHTML = '<span class="text-2xl">💬</span><span class="text-xs sm:text-sm font-black mt-0.5">대화하기</span><span class="text-[10px] font-bold">[터치/E]</span>';
        }
      } else {
        prompt.classList.add('hidden');
        if (btnAction) {
          btnAction.disabled = true;
          btnAction.className = 'w-20 h-20 sm:w-24 sm:h-24 bg-slate-950/70 text-slate-500 border border-slate-700/50 rounded-3xl flex flex-col items-center justify-center opacity-40 cursor-not-allowed pointer-events-none select-none';
          btnAction.innerHTML = '<span class="text-xl opacity-60">💬</span><span class="text-xs font-bold mt-0.5 text-slate-500">인물 접근 필요</span><span class="text-[10px] opacity-60">[거리 부족]</span>';
        }
      }

      updateCompass();
      renderWorld(now, near);
      requestAnimationFrame(gameLoop);
    }

    // Canvas Render Engine
    function renderWorld(now, near) {
      const camX = Math.max(0, Math.min(MAP_WIDTH * TILE_SIZE - canvas.width, player.x + player.width / 2 - canvas.width / 2));
      const camY = Math.max(0, Math.min(MAP_HEIGHT * TILE_SIZE - canvas.height, player.y + player.height / 2 - canvas.height / 2));

      ctx.save();
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.translate(-camX, -camY);

      const startX = Math.max(0, Math.floor(camX / TILE_SIZE));
      const endX = Math.min(MAP_WIDTH, Math.ceil((camX + canvas.width) / TILE_SIZE) + 1);
      const startY = Math.max(0, Math.floor(camY / TILE_SIZE));
      const endY = Math.min(MAP_HEIGHT, Math.ceil((camY + canvas.height) / TILE_SIZE) + 1);

      // 1. Draw Tiles
      for (let ty = startY; ty < endY; ty++) {
        for (let tx = startX; tx < endX; tx++) {
          const t = WORLD_MAP[ty][tx];
          const px = tx * TILE_SIZE;
          const py = ty * TILE_SIZE;

          if (t === TILES.GRASS) {
            ctx.fillStyle = (tx + ty) % 2 === 0 ? '#14532d' : '#166534';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          } else if (t === TILES.PATH) {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#92400e';
            ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          } else if (t === TILES.STONE_PATH) {
            ctx.fillStyle = '#334155';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#475569';
            ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          } else if (t === TILES.FLOOR) {
            ctx.fillStyle = ty < 16 ? '#f8fafc' : '#475569';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = ty < 16 ? '#e2e8f0' : '#334155';
            ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
          } else if (t === TILES.CARPET) {
            ctx.fillStyle = ty < 16 ? '#fbbf24' : '#b91c1c';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = ty < 16 ? '#f59e0b' : '#991b1b';
            ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          } else if (t === TILES.WATER) {
            const wave = Math.sin(now * 0.003 + tx + ty) * 2;
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(px + 4 + wave, py + 14, TILE_SIZE - 12, 3);
          } else if (t === TILES.BRIDGE) {
            ctx.fillStyle = '#9a3412';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#7c2d12';
            ctx.fillRect(px + 2, py + 4, TILE_SIZE - 4, 3);
            ctx.fillRect(px + 2, py + 20, TILE_SIZE - 4, 3);
          } else if (t === TILES.WALL) {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, 8);
          } else if (t === TILES.TREE) {
            ctx.fillStyle = '#14532d';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#052e16';
            ctx.beginPath();
            ctx.arc(px + 24, py + 22, 16, 0, Math.PI * 2);
            ctx.fill();
          } else if (t === TILES.MOUNTAIN) {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.moveTo(px + 24, py + 6);
            ctx.lineTo(px + 42, py + 42);
            ctx.lineTo(px + 6, py + 42);
            ctx.closePath();
            ctx.fill();
          } else if (t === TILES.FENCE) {
            ctx.fillStyle = '#14532d';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#d97706';
            ctx.fillRect(px + 4, py + 18, TILE_SIZE - 8, 8);
          }
        }
      }

      // 2. Draw Golden Breadcrumb Guide Path to Target
      const stage = getCurrentStage();
      const targetPxX = stage.targetPos.x * TILE_SIZE + TILE_SIZE / 2;
      const targetPxY = stage.targetPos.y * TILE_SIZE + TILE_SIZE / 2;
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.lineDashOffset = -now * 0.03;
      ctx.beginPath();
      ctx.moveTo(playerCenterX, playerCenterY);
      ctx.lineTo(targetPxX, targetPxY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Stage Target NPC & Props
      ctx.save();
      const targetScreenX = stage.targetPos.x * TILE_SIZE;
      const targetScreenY = stage.targetPos.y * TILE_SIZE;

      // Glowing aura around target
      const pulse = Math.sin(now * 0.005) * 6;
      ctx.fillStyle = near ? 'rgba(251, 191, 36, 0.35)' : 'rgba(251, 191, 36, 0.18)';
      ctx.beginPath();
      ctx.arc(targetScreenX + 24, targetScreenY + 24, 26 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Draw NPC Body
      ctx.fillStyle = stage.npcAvatarColor;
      ctx.beginPath();
      ctx.arc(targetScreenX + 24, targetScreenY + 16, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(targetScreenX + 16, targetScreenY + 26, 16, 18);

      // Name Tag Above NPC
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(stage.npcName, targetScreenX + 24, targetScreenY - 8);

      ctx.restore();

      // 4. Draw Player (Hwanung / Dangun Wanggeom)
      ctx.save();
      const px = player.x;
      const py = player.y;

      // Character Aura depending on stage
      if (currentStageId <= 4) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)'; // Heavenly blue aura
      } else if (currentStageId <= 8) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)'; // Earth/Bronze aura
      } else {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.35)'; // Radiant King aura
      }
      ctx.beginPath();
      ctx.arc(px + 16, py + 20, 20, 0, Math.PI * 2);
      ctx.fill();

      // Body / Robe
      ctx.fillStyle = currentStageId <= 4 ? '#38bdf8' : (currentStageId <= 8 ? '#b45309' : '#f59e0b');
      ctx.fillRect(px + 6, py + 14, 20, 20);

      // Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(px + 16, py + 8, 8, 0, Math.PI * 2);
      ctx.fill();

      // Crown / Hair Ribbon
      ctx.fillStyle = currentStageId >= 9 ? '#fbbf24' : '#ef4444';
      ctx.fillRect(px + 10, py + 1, 12, 4);

      // Name Tag
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(currentStageId <= 6 ? '환웅' : '단군왕검', px + 16, py - 4);

      ctx.restore();
      ctx.restore();
    }

    // Initialize HUD and start loop
    updateTopBar();
    requestAnimationFrame(gameLoop);
  </script>
</body>
</html>`;
}
