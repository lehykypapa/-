import { STAGES } from '../data/stages';

export function generateStandaloneHtml(): string {
  const stagesJson = JSON.stringify(STAGES);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>고구려의 빛을 밝혀라, 소년주몽부터 동명성왕까지 (초등 5학년 역사)</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    body {
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      background-color: #090d16;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
    }
    canvas {
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
  </style>
</head>
<body class="w-screen h-screen flex flex-col items-center justify-between text-slate-100">

  <!-- TOP HEADER -->
  <header class="w-full bg-slate-900/95 border-b border-amber-500/40 px-4 py-2 flex items-center justify-between z-30 shadow-lg shrink-0">
    <div class="flex items-center gap-3">
      <div class="bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded text-xs md:text-sm tracking-wide">
        단계 <span id="stageNum">1</span>/10
      </div>
      <!-- Jumong Evolution Badge -->
      <div id="evoBadge" class="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-400/50 text-[11px] text-sky-200 font-bold">
        <span>Lv.1</span>
        <span id="evoTitle">소년 주몽</span>
      </div>
      <div>
        <h1 id="stageTitle" class="text-xs md:text-sm font-bold text-amber-300 truncate max-w-[180px] sm:max-w-md">
          1단계: 신비한 알을 지켜라!
        </h1>
        <p id="stageLocation" class="text-[10px] text-slate-400">부여 유화부인의 처소</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="hidden sm:flex flex-col items-end w-36 md:w-52">
      <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
        <div id="progressBar" class="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 transition-all duration-300" style="width: 10%"></div>
      </div>
      <span class="text-[10px] text-slate-400 mt-0.5">건국 진행도 <span id="progressPercent" class="text-amber-300 font-bold">10%</span></span>
    </div>

    <div class="flex items-center gap-2">
      <button id="homeBtn" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-amber-300 cursor-pointer flex items-center gap-1">
        <span>🏠</span> <span class="hidden sm:inline">타이틀</span>
      </button>
      <button id="soundBtn" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 cursor-pointer">
        🔊 소리
      </button>
      <button id="guideBtn" class="px-2.5 py-1 text-xs bg-amber-600/80 hover:bg-amber-500 border border-amber-500 rounded text-white cursor-pointer font-bold">
        📖 도움말
      </button>
    </div>
  </header>

  <!-- INTERACTION NOTIFICATION PROMPT -->
  <div id="interactPrompt" class="hidden absolute top-16 z-40 bg-slate-900/90 border border-amber-400 text-amber-300 px-4 py-2 rounded-full shadow-xl text-xs sm:text-sm font-bold animate-bounce cursor-pointer flex items-center gap-2">
    <span>💬</span>
    <span>상호작용 가능! [E] 키 또는 화면의 [대화하기] 버튼 터치</span>
  </div>

  <!-- GAME CANVAS STAGE -->
  <main class="relative flex-1 w-full h-full min-h-0 overflow-hidden flex items-center justify-center">
    <canvas id="gameCanvas" width="800" height="600" class="w-full h-full block"></canvas>

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

  <!-- HISTORICAL DIALOGUE & QUIZ MODAL -->
  <div id="quizModal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-3">
    <div class="bg-slate-900 border-2 border-amber-500 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
      <div class="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-amber-500/30 px-5 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div id="modalNpcAvatar" class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-lg font-black text-slate-950 shadow">
            인
          </div>
          <div>
            <h3 id="modalNpcName" class="text-base font-bold text-amber-300">등장인물</h3>
            <p id="modalNpcRole" class="text-xs text-slate-400">역할</p>
          </div>
        </div>
        <span id="modalPhaseTag" class="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
          등장인물 대화
        </span>
      </div>

      <!-- Content Area -->
      <div class="p-5 space-y-4 overflow-y-auto">
        <!-- Quiz Phase Section (Situation & Historical Decision Quiz First) -->
        <div id="quizSection" class="space-y-4">
          <div class="bg-slate-800/80 rounded-xl p-3.5 border border-amber-500/30 text-slate-200 text-xs sm:text-sm leading-relaxed" id="modalStory">
            상황 배경...
          </div>

          <div class="bg-amber-950/40 border-l-4 border-amber-400 p-3.5 rounded-r-lg">
            <span class="text-xs text-amber-400 font-bold block mb-1">⚔️ 역사적 결단의 순간!</span>
            <h4 id="modalQuestion" class="font-bold text-amber-200 text-sm sm:text-base leading-snug">
              Q. 질문 내용이 들어갑니다.
            </h4>
          </div>

          <div class="space-y-2.5 pt-1" id="optionsContainer"></div>

          <div class="text-[11px] text-slate-400 pt-1 text-right">
            <span>정답을 선택하면 등장인물과의 역사적 대화가 이어집니다 ✨</span>
          </div>
        </div>

        <!-- Dialogue Phase Section (Characters converse after correct answer) -->
        <div id="dialogueSection" class="hidden space-y-4">
          <!-- Success banner -->
          <div class="bg-emerald-950/50 border border-emerald-500/50 rounded-xl p-3 flex items-center justify-between text-xs sm:text-sm">
            <div class="flex items-center gap-2">
              <span class="text-base">🎉</span>
              <span class="text-emerald-300 font-bold">지혜로운 역사적 결단입니다!</span>
              <span class="text-slate-300 hidden sm:inline">결단에 따라 인물들의 대화가 펼쳐집니다.</span>
            </div>
            <span class="text-emerald-400 text-xs bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/40">결단 성공</span>
          </div>

          <div id="dialogueBox" class="bg-slate-800 p-4 rounded-xl border border-amber-500/50 space-y-2">
            <div class="flex items-center justify-between">
              <span id="dialogueSpeaker" class="font-bold text-amber-300 text-sm">인물</span>
              <span id="dialogueCount" class="text-xs text-slate-400">1 / 3</span>
            </div>
            <p id="dialogueText" class="text-slate-100 text-sm sm:text-base pl-3 border-l-2 border-amber-400 italic">
              "대화 대사가 표시됩니다."
            </p>
          </div>

          <div class="flex items-center justify-between pt-2">
            <button id="skipDialogueBtn" class="text-xs text-slate-400 hover:text-amber-300 underline cursor-pointer">
              대화 건너뛰고 완료 ⏩
            </button>
            <button id="nextDialogueBtn" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl shadow cursor-pointer text-sm flex items-center gap-2">
              다음 대화 듣기 ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- INTER-STAGE ANIMATED CUTSCENE / STORY BRIDGE MODAL -->
  <div id="transitionModal" class="hidden fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3">
    <div class="bg-slate-900 border-2 border-amber-500 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      <div class="bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-3 flex items-center justify-between">
        <span class="text-xs sm:text-sm font-bold tracking-wide text-amber-100">
          📜 초등 5학년 역사 극장 • 시대의 전환
        </span>
        <span id="transNextBadge" class="bg-slate-950/40 text-amber-200 text-xs px-2.5 py-1 rounded-full font-mono">
          다음 단계로 이동
        </span>
      </div>

      <!-- Animated Scene Banner -->
      <div class="p-4 bg-slate-950 text-center border-b border-amber-500/30">
        <h3 id="transTitle" class="text-base sm:text-lg font-black text-amber-300">영웅의 탄생</h3>
        <p id="transSubtitle" class="text-xs text-slate-400 mt-0.5" id="transSubtitle">부제목</p>
        <p id="transQuote" class="mt-3 text-xs sm:text-sm text-amber-200 font-bold italic bg-slate-900/80 p-2.5 rounded-lg border border-amber-500/30">
          "명대사"
        </p>
      </div>

      <!-- Knowledge Content -->
      <div class="p-4 sm:p-5 space-y-3 overflow-y-auto">
        <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-1.5">
          <div class="text-amber-400 font-bold text-xs sm:text-sm">💡 초등 5학년 역사 콕콕 지식</div>
          <p id="transKnowledge" class="text-xs sm:text-sm text-slate-300 leading-relaxed">
            배경지식 설명...
          </p>
        </div>
      </div>

      <div class="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-end">
        <button id="transProceedBtn" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-sm shadow cursor-pointer">
          다음 단계로 출발! ➡️
        </button>
      </div>
    </div>
  </div>

  <!-- FAIL MODAL -->
  <div id="failModal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
    <div class="bg-slate-900 border-2 border-red-500 rounded-2xl w-full max-w-md p-6 text-center shadow-2xl">
      <div class="w-14 h-14 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl font-black border-2 border-red-500 mb-3">✕</div>
      <h3 class="text-xl font-black text-red-400 mb-2">건국 실패!</h3>
      <p id="failFeedback" class="text-slate-200 text-sm mb-4 leading-relaxed bg-slate-800/80 p-3 rounded-lg border border-red-500/30">설명...</p>
      <div class="bg-red-950/40 border border-red-800/50 p-3 rounded-lg text-xs text-red-200 text-left mb-5">
        <strong>💡 역사 속 진실:</strong> <span id="failHistoryLesson">설명</span>
      </div>
      <button id="retryBtn" class="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 cursor-pointer">
        다시 도전하기
      </button>
    </div>
  </div>

  <!-- VICTORY MODAL -->
  <div id="victoryModal" class="hidden fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-slate-900 border-2 border-amber-400 rounded-3xl w-full max-w-xl p-6 text-center shadow-2xl">
      <div class="w-16 h-16 mx-auto rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-3xl font-black mb-3">👑</div>
      <h2 class="text-2xl font-black text-amber-300 mb-1">고구려 건국 대업 완성!</h2>
      <p class="text-xs text-slate-300 mb-4">기원전 37년, 동명성왕 주몽이 700년 고구려의 새벽을 열었습니다!</p>
      <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-xl text-left text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1.5 mb-5">
        <p class="font-bold text-amber-300">📜 주몽의 10단계 건국 과정 정리:</p>
        <p>1. 난생 설화와 알을 깨고 나온 비범한 탄생</p>
        <p>2. 백발백중 활솜씨로 증명한 명궁의 기개</p>
        <p>3. 대소왕자의 시기와 어머니 유화부인의 남행 권유</p>
        <p>4. 오이, 마리, 협보 3대 개국공신과의 의형제 결의</p>
        <p>5. 부여 정예 기마 추격대와의 결사적 탈출전</p>
        <p>6. 엄호수 강가에서 선포한 천손(天孫)·수신(水神)의 혈통</p>
        <p>7. 어하자교(물고기와 자라의 다리)의 신화적 도강</p>
        <p>8. 졸본의 여걸 소서노와의 강력한 경제·정치 동맹</p>
        <p>9. 천혜의 난공불락 요새 졸본 산성(오녀산성) 수도 결정</p>
        <p>10. 기원전 37년 삼족오 깃발 아래 국호 '고구려' 선포</p>
      </div>
      <div class="flex gap-2">
        <button id="printBtn" class="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 cursor-pointer">
          수업용 인쇄
        </button>
        <button id="restartBtn" class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">
          처음부터 다시 탐험
        </button>
      </div>
    </div>
  </div>

  <!-- HELP MODAL -->
  <div id="helpModal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
    <div class="bg-slate-900 border-2 border-amber-500/80 rounded-2xl w-full max-w-lg p-5 text-slate-200 shadow-2xl">
      <h3 class="text-lg font-bold text-amber-300 mb-2">📖 초등 5학년 사회과 역사 수업 안내</h3>
      <p class="text-xs text-slate-300 leading-relaxed mb-4">
        주몽 캐릭터를 조작하여 1단계부터 10단계까지 부여에서 졸본으로 이동하며 고구려가 세워진 역사적 과정과 신화를 직접 체험합니다.
      </p>
      <div class="text-xs space-y-1.5 bg-slate-800 p-3 rounded-lg border border-slate-700 mb-4">
        <p>🎮 <strong>이동:</strong> 키보드 W/A/S/D 또는 방향키, 화면 가상 D-Pad</p>
        <p>💬 <strong>대화:</strong> 목적지에 다가가서 [E] 키 또는 [대화하기] 터치</p>
        <p>🏹 <strong>외형 진화:</strong> 단계가 진행될수록 소년에서 제왕으로 주몽의 복식이 진화합니다!</p>
        <p>🧭 <strong>길 안내:</strong> 길목에 흐르는 황금빛 유도선과 상단 나침반 화살표를 따라가세요.</p>
      </div>
      <button id="closeHelpBtn" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 cursor-pointer">
        닫기
      </button>
    </div>
  </div>

  <!-- GAME FIRST SCREENS: TITLE & NOTICE OVERLAY -->
  <div id="introOverlay" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-slate-100 overflow-y-auto p-4 sm:p-6" style="background-image: radial-gradient(ellipse at top, #1e293b 0%, #090d16 70%, #020617 100%)">
    <!-- STEP 1: TITLE SCREEN -->
    <div id="stepTitle" class="max-w-2xl w-full bg-slate-900/90 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center my-auto">
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg border-2 border-amber-300/40 mb-4 text-3xl sm:text-4xl">
        👑
      </div>
      <div class="flex flex-wrap items-center justify-center gap-2 mb-3">
        <span class="text-xs sm:text-sm font-bold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
          초등 5학년 사회과 역사 탐구
        </span>
        <span class="text-xs sm:text-sm font-extrabold px-3 py-1 bg-sky-950 text-sky-300 border border-sky-400/50 rounded-full">
          제작자: 이현균선생님
        </span>
      </div>
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-amber-300 tracking-tight leading-tight mb-2 drop-shadow-md">
        고구려의 빛을 밝혀라,
        <br />
        <span class="text-white">소년주몽부터 동명성왕까지</span>
      </h1>
      <p class="text-xs sm:text-sm text-amber-400/90 font-medium mb-6">
        부여의 햇살에서 태어난 영웅, 대제국 고구려의 기틀을 세우다
      </p>

      <div class="w-full bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-2.5 shadow-inner">
        <div class="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base border-b border-slate-800 pb-2">
          <span>🎯 탐험 목표와 학습 목적</span>
        </div>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
          본 게임은 부여의 신비한 알에서 태어난 <strong class="text-amber-200">‘소년 주몽’</strong>이
          수많은 시련과 대소왕자의 시기를 극복하고, 의형제들과 함께 남쪽으로 탈출하여
          압록강 지류 졸본에 <strong class="text-amber-200">‘고구려’</strong>를 건국하기까지의
          생생한 역사와 건국 설화를 직접 체험하는 <strong>2D 역사 탐험 교육 게임</strong>입니다.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
          <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            ✨ 10단계의 역사적 결단과 인물 대화
          </div>
          <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            👑 소년에서 제왕(동명성왕)으로 외형 진화
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
              고구려의 빛을 밝히기 전 반드시 확인하세요!
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
              키보드의 <strong>[W, A, S, D]</strong> 또는 <strong>[방향키]</strong>, 화면 하단의 가상 패드로 이동합니다.
              목적지의 역사 속 인물에 접근하여 <strong>[E] 키</strong> 또는 <strong>[대화하기]</strong> 버튼을 누르면 대화가 시작됩니다.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            2
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-100">⚔️ 역사적 상황 판단과 퀴즈</h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              인물과의 생생한 대화를 읽고 <strong>역사적 결단 퀴즈</strong>를 풉니다. 틀린 선택을 하더라도
              정답과 역사 속 진실 해설을 확인한 뒤 바로 해당 체크포인트에서 다시 도전할 수 있습니다.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            3
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-100">✨ 황금빛 길잡이 유도선 활용</h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              바닥에 표시되는 <strong>황금빛 점선</strong>과 화면 우측 상단의 <strong>나침반/남은 거리 안내</strong>를
              따라가면 넓은 맵에서도 길을 잃지 않고 다음 목적지를 쉽게 찾을 수 있습니다.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            4
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-100">🔊 교실 환경 및 소리 설정</h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              학교 수업 중 소리가 필요 없는 경우 상단 바의 <strong>[소리]</strong> 버튼을 누르세요.
              언제든 상단의 <strong>[타이틀]</strong> 버튼으로 첫 화면으로 돌아올 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <button id="btnNoticeEnter" class="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 active:scale-95 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2">
        <span>✅ 주의사항 확인 완료! 고구려 건국 모험 출발</span>
      </button>
    </div>
  </div>

  <script>
    const STAGES = ${stagesJson};
    const TILE_SIZE = 48;
    const MAP_WIDTH = 60;
    const MAP_HEIGHT = 60;

    const TILES = {
      GRASS: 0,
      PATH: 1,
      STONE_PATH: 2,
      WATER: 3,
      BRIDGE: 4,
      WALL: 5,
      MOUNTAIN: 6,
      FLOOR: 7,
      CARPET: 8,
      FENCE: 9,
      TREE: 10
    };

    // Generate Map Matrix
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
      const row = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
          row.push(TILES.WALL);
        } else if (y >= 30 && y <= 35) {
          row.push((x >= 28 && x <= 32) ? TILES.BRIDGE : TILES.WATER);
        } else if (y >= 45 && y <= 55 && x >= 40 && x <= 55) {
          row.push(TILES.MOUNTAIN);
        } else if (y <= 16 && x <= 25) {
          row.push((y >= 8 && y <= 14 && x >= 8 && x <= 16) ? TILES.FLOOR : TILES.STONE_PATH);
        } else if ((x === 18 || x === 30 || x === 38 || x === 48) || (y === 14 || y === 24 || y === 42 || y === 46)) {
          row.push(TILES.PATH);
        } else if ((x * 7 + y * 13) % 17 === 0) {
          row.push(TILES.TREE);
        } else {
          row.push(TILES.GRASS);
        }
      }
      map.push(row);
    }

    // Player State
    const player = {
      x: 10 * TILE_SIZE,
      y: 10 * TILE_SIZE,
      width: 32,
      height: 32,
      speed: 4,
      dir: 'down',
      isMoving: false
    };

    let currentStageId = 1;
    let isGameStarted = false;
    let isAudioMuted = false;
    let dialogueIndex = 0;
    let pendingNextStage = null;

    // Keys
    const keys = { up: false, down: false, left: false, right: false };

    // Canvas setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function getEvoInfo(stageId) {
      if (stageId <= 2) return { level: 1, title: '소년 주몽', color: '#38bdf8' };
      if (stageId <= 5) return { level: 2, title: '명궁 청년 주몽', color: '#1e3a8a' };
      if (stageId <= 7) return { level: 3, title: '천손 결사대장', color: '#b91c1c' };
      if (stageId <= 9) return { level: 4, title: '졸본 총사령관', color: '#0f172a' };
      return { level: 5, title: '동명성왕 (東明聖王)', color: '#fbbf24' };
    }

    function updateTopBar() {
      const stage = STAGES.find(s => s.id === currentStageId) || STAGES[0];
      const evo = getEvoInfo(currentStageId);

      document.getElementById('stageNum').textContent = stage.id;
      document.getElementById('stageTitle').textContent = stage.title;
      document.getElementById('stageLocation').textContent = '위치: ' + stage.location;
      document.getElementById('evoTitle').textContent = evo.title;

      const pct = Math.round((stage.id / 10) * 100);
      document.getElementById('progressBar').style.width = pct + '%';
      document.getElementById('progressPercent').textContent = pct + '%';
    }

    // Dialogue & Quiz handling (상황 부여 -> 역사 퀴즈 -> 정답 시 등장인물 대화)
    let selectedCorrectOption = null;

    function openQuizModal() {
      const stage = STAGES.find(s => s.id === currentStageId);
      if (!stage) return;

      dialogueIndex = 0;
      selectedCorrectOption = null;
      document.getElementById('modalNpcName').textContent = stage.npcName;
      document.getElementById('modalNpcRole').textContent = stage.npcRole;
      document.getElementById('modalNpcAvatar').textContent = stage.npcName.slice(0, 2);
      document.getElementById('modalNpcAvatar').style.backgroundColor = stage.npcAvatarColor;
      document.getElementById('modalStory').innerHTML = '<div class="flex items-center gap-2 mb-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span><span class="font-bold text-amber-300 text-xs sm:text-sm">📍 역사적 상황 부여 (Situation)</span></div><p class="leading-relaxed">' + stage.story + '</p>';

      // Step 1: Show Quiz Phase First!
      document.getElementById('quizSection').classList.remove('hidden');
      document.getElementById('dialogueSection').classList.add('hidden');
      document.getElementById('modalPhaseTag').textContent = '상황 부여 & 역사 퀴즈';
      document.getElementById('modalQuestion').textContent = stage.question;

      const container = document.getElementById('optionsContainer');
      container.innerHTML = '';
      stage.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-3.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-amber-500/20 hover:border-amber-400 text-slate-100 text-sm font-medium transition cursor-pointer flex items-start gap-2.5';
        btn.innerHTML = '<span class="bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded shrink-0 mt-0.5">' + (idx + 1) + '</span> <span>' + opt.text + '</span>';
        btn.onclick = () => selectOption(opt);
        container.appendChild(btn);
      });

      document.getElementById('quizModal').classList.remove('hidden');
    }

    function selectOption(opt) {
      const stage = STAGES.find(s => s.id === currentStageId);
      if (!stage) return;

      if (opt.isCorrect) {
        playSound('success');
        selectedCorrectOption = opt;
        const lines = stage.dialogueScript || [];

        if (lines.length > 0) {
          // Step 2: Switch to Characters Dialogue Phase!
          document.getElementById('quizSection').classList.add('hidden');
          document.getElementById('dialogueSection').classList.remove('hidden');
          document.getElementById('modalPhaseTag').textContent = '✅ 결단 성공 · 등장인물 대화';
          dialogueIndex = 0;
          showCurrentDialogueLine(stage);
        } else {
          document.getElementById('quizModal').classList.add('hidden');
          showTransitionModal(stage);
        }
      } else {
        playSound('fail');
        document.getElementById('quizModal').classList.add('hidden');
        document.getElementById('failFeedback').textContent = opt.feedback;
        document.getElementById('failHistoryLesson').textContent = stage.historyLesson;
        document.getElementById('failModal').classList.remove('hidden');
      }
    }

    function showCurrentDialogueLine(stage) {
      const lines = stage.dialogueScript || [];
      if (lines.length === 0 || dialogueIndex >= lines.length) {
        document.getElementById('quizModal').classList.add('hidden');
        showTransitionModal(stage);
        return;
      }
      const line = lines[dialogueIndex];
      document.getElementById('dialogueSpeaker').textContent = line.speaker + ' (' + line.speakerRole + ')';
      document.getElementById('dialogueCount').textContent = (dialogueIndex + 1) + ' / ' + lines.length;
      document.getElementById('dialogueText').textContent = '"' + line.text + '"';

      const nextBtn = document.getElementById('nextDialogueBtn');
      if (dialogueIndex < lines.length - 1) {
        nextBtn.innerHTML = '<span>다음 대화 듣기</span> <span>▶</span>';
      } else {
        nextBtn.innerHTML = '<span>역사적 업적 달성! 다음 단계로</span> <span>➔</span>';
      }
    }

    document.getElementById('nextDialogueBtn').onclick = () => {
      const stage = STAGES.find(s => s.id === currentStageId);
      if (!stage) return;
      if (dialogueIndex < (stage.dialogueScript || []).length - 1) {
        dialogueIndex++;
        showCurrentDialogueLine(stage);
      } else {
        document.getElementById('quizModal').classList.add('hidden');
        showTransitionModal(stage);
      }
    };

    document.getElementById('skipDialogueBtn').onclick = () => {
      const stage = STAGES.find(s => s.id === currentStageId);
      document.getElementById('quizModal').classList.add('hidden');
      if (stage) showTransitionModal(stage);
    };

    function showTransitionModal(stage) {
      const trans = stage.transition;
      document.getElementById('transTitle').textContent = trans.title;
      document.getElementById('transSubtitle').textContent = trans.subtitle;
      document.getElementById('transQuote').textContent = trans.quote;
      document.getElementById('transKnowledge').textContent = trans.backgroundKnowledge;
      document.getElementById('transNextBadge').textContent = currentStageId < 10 ? (currentStageId + 1) + '단계로 이동' : '고구려 완성!';

      pendingNextStage = currentStageId < 10 ? currentStageId + 1 : 11;
      document.getElementById('transitionModal').classList.remove('hidden');
    }

    document.getElementById('transProceedBtn').onclick = () => {
      document.getElementById('transitionModal').classList.add('hidden');
      if (pendingNextStage <= 10) {
        currentStageId = pendingNextStage;
        updateTopBar();
      } else {
        document.getElementById('victoryModal').classList.remove('hidden');
      }
    };

    // Collision check
    function isSolid(tx, ty) {
      if (tx < 0 || tx >= MAP_WIDTH || ty < 0 || ty >= MAP_HEIGHT) return true;
      const t = map[ty][tx];
      if (t === TILES.WALL || t === TILES.MOUNTAIN || t === TILES.FENCE) return true;
      if (t === TILES.WATER) return true;
      if (t === TILES.BRIDGE && currentStageId < 7) return true;
      return false;
    }

    function isNearTarget() {
      const stage = STAGES.find(s => s.id === currentStageId);
      if (!stage) return false;
      const tx = stage.targetPos.x * TILE_SIZE + 24;
      const ty = stage.targetPos.y * TILE_SIZE + 24;
      const px = player.x + player.width / 2;
      const py = player.y + player.height / 2;
      return Math.hypot(tx - px, ty - py) < 80;
    }

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
      if (e.code === 'KeyE' || e.code === 'Space') tryInteract();
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
      openQuizModal();
    };
    document.getElementById('restartBtn').onclick = () => {
      currentStageId = 1;
      player.x = 10 * TILE_SIZE;
      player.y = 10 * TILE_SIZE;
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
    document.getElementById('guideBtn').onclick = () => {
      document.getElementById('helpModal').classList.remove('hidden');
    };
    document.getElementById('closeHelpBtn').onclick = () => {
      document.getElementById('helpModal').classList.add('hidden');
    };

    // Game loop
    let lastTime = performance.now();
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

      player.isMoving = dx !== 0 || dy !== 0;

      if (player.isMoving) {
        const len = Math.hypot(dx, dy) || 1;
        const moveX = (dx / len) * player.speed;
        const moveY = (dy / len) * player.speed;

        const nextX = player.x + moveX;
        const tX1 = Math.floor(nextX / TILE_SIZE);
        const tX2 = Math.floor((nextX + player.width) / TILE_SIZE);
        const tY1 = Math.floor(player.y / TILE_SIZE);
        const tY2 = Math.floor((player.y + player.height) / TILE_SIZE);

        if (!isSolid(tX1, tY1) && !isSolid(tX2, tY1) && !isSolid(tX1, tY2) && !isSolid(tX2, tY2)) {
          player.x = nextX;
        }

        const nextY = player.y + moveY;
        const nyX1 = Math.floor(player.x / TILE_SIZE);
        const nyX2 = Math.floor((player.x + player.width) / TILE_SIZE);
        const nyY1 = Math.floor(nextY / TILE_SIZE);
        const nyY2 = Math.floor((nextY + player.height) / TILE_SIZE);

        if (!isSolid(nyX1, nyY1) && !isSolid(nyX2, nyY1) && !isSolid(nyX1, nyY2) && !isSolid(nyX2, nyY2)) {
          player.y = nextY;
        }
      }

      const near = isNearTarget();
      const promptEl = document.getElementById('interactPrompt');
      const btnAction = document.getElementById('btnAction');
      if (near && document.getElementById('quizModal').classList.contains('hidden') && document.getElementById('failModal').classList.contains('hidden')) {
        promptEl.classList.remove('hidden');
        if (btnAction) {
          btnAction.disabled = false;
          btnAction.className = 'w-22 h-22 sm:w-26 sm:h-26 bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 active:scale-90 text-slate-950 font-black rounded-3xl shadow-2xl flex flex-col items-center justify-center border-2 border-white ring-4 ring-amber-400/50 animate-bounce cursor-pointer';
          btnAction.innerHTML = '<span class="text-2xl">💬</span><span class="text-xs sm:text-sm font-black mt-0.5">대화하기</span><span class="text-[10px] font-bold">[터치/E]</span>';
        }
      } else {
        promptEl.classList.add('hidden');
        if (btnAction) {
          btnAction.disabled = true;
          btnAction.className = 'w-20 h-20 sm:w-24 sm:h-24 bg-slate-950/70 text-slate-500 border border-slate-700/50 rounded-3xl flex flex-col items-center justify-center opacity-40 cursor-not-allowed pointer-events-none select-none';
          btnAction.innerHTML = '<span class="text-xl opacity-60">💬</span><span class="text-xs font-bold mt-0.5 text-slate-500">인물 접근 필요</span><span class="text-[10px] opacity-60">[거리 부족]</span>';
        }
      }

      renderWorld(now, near);
      requestAnimationFrame(gameLoop);
    }

    function renderWorld(now, near) {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const camX = Math.max(0, Math.min(MAP_WIDTH * TILE_SIZE - canvas.width, player.x + player.width / 2 - canvas.width / 2));
      const camY = Math.max(0, Math.min(MAP_HEIGHT * TILE_SIZE - canvas.height, player.y + player.height / 2 - canvas.height / 2));

      ctx.save();
      ctx.translate(-camX, -camY);

      // Realistic Map Tiles
      const sx = Math.max(0, Math.floor(camX / TILE_SIZE));
      const ex = Math.min(MAP_WIDTH, Math.ceil((camX + canvas.width) / TILE_SIZE) + 1);
      const sy = Math.max(0, Math.floor(camY / TILE_SIZE));
      const ey = Math.min(MAP_HEIGHT, Math.ceil((camY + canvas.height) / TILE_SIZE) + 1);

      for (let y = sy; y < ey; y++) {
        for (let x = sx; x < ex; x++) {
          const t = map[y][x];
          const px = x * TILE_SIZE;
          const py = y * TILE_SIZE;
          if (t === TILES.GRASS) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#338e4a' : '#2d7d40';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(px + 8, py + 14, 2, 6);
            ctx.fillRect(px + 28, py + 30, 2, 6);
            if ((x * 13 + y * 7) % 9 === 0) {
              ctx.fillStyle = '#fde047';
              ctx.beginPath(); ctx.arc(px + 18, py + 20, 2.5, 0, Math.PI * 2); ctx.fill();
            }
          } else if (t === TILES.PATH) {
            ctx.fillStyle = '#d97706'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#92400e'; ctx.fillRect(px + 8, py + 14, 20, 3);
          } else if (t === TILES.STONE_PATH) {
            ctx.fillStyle = '#64748b'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#94a3b8'; ctx.fillRect(px + 2, py + 2, 20, 20); ctx.fillRect(px + 26, py + 26, 20, 20);
          } else if (t === TILES.WATER) {
            ctx.fillStyle = '#0369a1'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#7dd3fc'; ctx.fillRect(px + 6 + Math.sin(now * 0.003 + x) * 4, py + 16, 20, 2);
          } else if (t === TILES.BRIDGE) {
            if (currentStageId >= 7) {
              ctx.fillStyle = '#047857'; ctx.beginPath();
              ctx.arc(px + 24, py + 24, 18, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = '#f59e0b'; ctx.fillRect(px + 18, py + 18, 12, 12);
            } else {
              ctx.fillStyle = '#075985'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            }
          } else if (t === TILES.FLOOR) {
            ctx.fillStyle = '#b45309'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#78350f'; ctx.fillRect(px, py + 14, TILE_SIZE, 1);
          } else if (t === TILES.CARPET) {
            ctx.fillStyle = '#991b1b'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#f59e0b'; ctx.strokeRect(px + 4, py + 4, 40, 40);
          } else if (t === TILES.WALL) {
            ctx.fillStyle = '#334155'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#475569'; ctx.fillRect(px + 4, py + 4, 40, 16); ctx.fillRect(px + 4, py + 24, 40, 16);
          } else if (t === TILES.MOUNTAIN) {
            ctx.fillStyle = '#3f3f46'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#52525b'; ctx.beginPath(); ctx.moveTo(px, py + 48); ctx.lineTo(px + 24, py + 6); ctx.lineTo(px + 48, py + 48); ctx.closePath(); ctx.fill();
          } else if (t === TILES.FENCE) {
            ctx.fillStyle = '#2d7d40'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#78350f'; ctx.fillRect(px + 8, py + 8, 6, 36); ctx.fillRect(px + 28, py + 8, 6, 36);
          } else if (t === TILES.TREE) {
            ctx.fillStyle = '#266c37'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#78350f'; ctx.fillRect(px + 20, py + 20, 8, 26);
            ctx.fillStyle = '#15803d'; ctx.beginPath(); ctx.arc(px + 24, py + 18, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(px + 22, py + 14, 10, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      // Draw Path Guidance Waypoints
      const activeStage = STAGES.find(s => s.id === currentStageId);
      if (activeStage && activeStage.pathWaypoints) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 12]);
        ctx.lineDashOffset = -(now * 0.04) % 20;
        ctx.beginPath();
        ctx.moveTo(player.x + 16, player.y + 16);
        activeStage.pathWaypoints.forEach(wp => {
          ctx.lineTo(wp.x * TILE_SIZE + 24, wp.y * TILE_SIZE + 24);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw active stage beacon & NPC presence
      if (activeStage) {
        const tPx = activeStage.targetPos.x * TILE_SIZE + 24;
        const tPy = activeStage.targetPos.y * TILE_SIZE + 24;

        // Sky light beacon
        ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
        ctx.fillRect(tPx - 12, tPy - 160, 24, 160);

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(tPx, tPy, 24 + Math.sin(now * 0.006) * 5, 0, Math.PI * 2);
        ctx.stroke();

        // Speech Quest Bubble
        ctx.fillStyle = near ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(tPx, tPy - 36 + Math.sin(now * 0.008) * 4, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(near ? '💬' : '!', tPx, tPy - 31 + Math.sin(now * 0.008) * 4);
      }

      // Draw Evolving Jumong Player
      const cx = player.x + player.width / 2;
      const cy = player.y + player.height / 2;
      const bob = player.isMoving ? Math.sin(now * 0.016) * 2 : 0;
      const evo = getEvoInfo(currentStageId);

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(cx, cy + 14, 12, 5, 0, 0, Math.PI * 2); ctx.fill();

      // Outfit colors based on evolution
      ctx.fillStyle = evo.color;
      ctx.fillRect(cx - 8, cy - 2 + bob, 16, 14);

      if (evo.level >= 4) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - 8, cy - 2 + bob, 16, 14);
      }

      // Head & Headdress
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath(); ctx.arc(cx, cy - 8 + bob, 7.5, 0, Math.PI * 2); ctx.fill();

      // Feathers / Crown
      if (evo.level === 1) {
        ctx.fillStyle = '#ef4444'; ctx.fillRect(cx - 7, cy - 13 + bob, 14, 3);
      } else if (evo.level <= 4) {
        ctx.fillStyle = '#0f172a'; ctx.fillRect(cx - 8, cy - 14 + bob, 16, 3);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(cx - 3, cy - 14 + bob); ctx.lineTo(cx - 6, cy - 22 + bob); ctx.lineTo(cx - 1, cy - 14 + bob); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + 3, cy - 14 + bob); ctx.lineTo(cx + 6, cy - 22 + bob); ctx.lineTo(cx + 1, cy - 14 + bob); ctx.fill();
      } else {
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(cx - 9, cy - 16 + bob, 18, 5);
      }

      // Name Tag
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(cx - 24, cy - 34 + bob, 48, 14);
      ctx.strokeStyle = '#f59e0b';
      ctx.strokeRect(cx - 24, cy - 34 + bob, 48, 14);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(evo.title, cx, cy - 24 + bob);

      ctx.restore();

      // Screen HUD Navigation Arrow
      if (activeStage) {
        const tx = activeStage.targetPos.x * TILE_SIZE + 24;
        const ty = activeStage.targetPos.y * TILE_SIZE + 24;
        const dist = Math.round(Math.hypot(tx - cx, ty - cy) / 20);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(canvas.width - 240, 12, 226, 44, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('목표: ' + activeStage.title, canvas.width - 228, 28);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px sans-serif';
        ctx.fillText('거리: 약 ' + dist + 'm (' + activeStage.navHint.slice(0, 18) + '...)', canvas.width - 228, 44);
      }
    }

    updateTopBar();
    requestAnimationFrame(gameLoop);
  </script>
</body>
</html>`;
}
