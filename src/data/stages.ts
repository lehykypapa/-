import { StageData } from '../types';

export const STAGES: StageData[] = [
  {
    id: 1,
    stageNumber: 1,
    location: '부여 유화부인의 처소 (궁궐 안뜰)',
    title: '신비한 알을 지켜라!',
    subtitle: '1단계: 유화부인이 낳은 커다란 알과 난생 신화',
    npcName: '어머니 유화부인',
    npcRole: '하백의 딸이자 주몽의 어머니',
    npcAvatarColor: '#f43f5e',
    story:
      '하백의 딸 유화부인은 눈부신 햇빛의 기운을 받아 커다란 알 하나를 낳았습니다. 금와왕은 알을 돼지와 말 우리에 던졌으나 동물들이 밟지 않고 오히려 품어 지켜주었습니다. 왕이 알을 돌려주자, 유화부인은 알을 따스한 비단으로 감싸 안으며 주몽을 맞이할 준비를 하고 있습니다.',
    dialogueScript: [
      {
        speaker: '유화부인',
        speakerRole: '어머니',
        speakerAvatarColor: '#f43f5e',
        text: '아가야, 두려워 마라. 너는 하늘의 신 해모수와 물의 신 하백의 피를 이어받은 성스러운 아이란다.'
      },
      {
        speaker: '주몽 (알 속의 기운)',
        speakerRole: '신비한 기운',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '어머니, 따스한 손길이 느껴집니다. 곧 껍질을 깨고 나가 세상을 밝히겠습니다!'
      },
      {
        speaker: '유화부인',
        speakerRole: '어머니',
        speakerAvatarColor: '#f43f5e',
        text: '부여의 왕과 신하들이 네 비범함을 두려워하고 있단다. 이제 우리가 어떻게 해야 할지 지혜를 모으자꾸나.'
      }
    ],
    question: 'Q1. 유화부인은 신비한 알을 어떻게 다루어야 할까요?',
    options: [
      {
        text: '알에서 사람이 나오는 것은 불길하니 깊은 산속 짐승들에게 던져버린다.',
        isCorrect: false,
        feedback:
          '실패! 알을 버리면 훗날 고구려를 세울 영웅 주몽이 태어나지 못해요. 고대 건국 신화에서 알은 하늘의 신성한 생명을 상징합니다.'
      },
      {
        text: '알을 따뜻한 곳에 소중히 감싸 안고 부화할 때를 정성껏 기다린다.',
        isCorrect: true,
        feedback:
          '정답입니다! 유화부인이 알을 따뜻하게 보호하자 껍질이 깨지며 씩씩하고 비범한 사내아이 주몽이 태어났습니다.'
      }
    ],
    historyLesson:
      '고구려의 건국 시조 주몽은 알에서 태어났다는 "난생 설화(卵生說話)"를 지니고 있습니다. 이는 주몽이 보통 사람과 다른 하늘의 신성한 인물임을 나타냅니다.',
    targetPos: { x: 12, y: 10 },
    navHint: '궁궐 침전 앞마당으로 이동하여 신비한 알과 유화부인을 만나세요.',
    pathWaypoints: [
      { x: 10, y: 10 },
      { x: 12, y: 10 }
    ],
    transition: {
      title: '영웅의 탄생: 알을 깨고 나온 비범한 소년',
      subtitle: '알에서 태어나 일곱 살에 스스로 활을 만든 주몽',
      backgroundKnowledge:
        '옛 사람들은 왕이나 영웅이 태어날 때 신비로운 힘을 강조하기 위해 "알"에서 태어났다는 난생 신화를 만들었습니다. 신라의 박혁거세, 가야의 김수로왕도 모두 난생 설화를 지니고 있습니다.',
      animationType: 'egg_hatching',
      quote: '"어머니, 저는 일곱 살이지만 활과 살을 스스로 만들어 백 발을 쏘면 백 발을 모두 맞힐 수 있습니다!"',
      historicalMeaning: '신성한 천손(天孫) 혈통의 증명과 소년 주몽의 범상치 않은 성장'
    },
    targetType: 'egg'
  },
  {
    id: 2,
    stageNumber: 2,
    location: '부여 궁전 활터 (동쪽 연무장)',
    title: '백발백중 활솜씨를 보여라!',
    subtitle: '2단계: 금와왕과 왕자들이 지켜보는 부여의 활터',
    npcName: '금와왕 (金蛙王)',
    npcRole: '부여의 왕이자 활터 시험관',
    npcAvatarColor: '#eab308',
    story:
      '일곱 살 때부터 스스로 활과 화살을 만들어 백발백중으로 쏘았던 주몽! 부여에서는 활을 잘 쏘는 사람을 "주몽"이라 불렀습니다. 부여 궁전의 넓은 활터에서 금와왕과 대소왕자가 지켜보는 가운데, 주몽의 놀라운 궁술 실력을 시험하는 자리가 열렸습니다.',
    dialogueScript: [
      {
        speaker: '금와왕',
        speakerRole: '부여 국왕',
        speakerAvatarColor: '#eab308',
        text: '주몽아! 과녁 100보 밖의 버들잎을 맞힐 수 있겠느냐? 네 솜씨가 소문대로인지 짐 앞에서 보여보아라.'
      },
      {
        speaker: '주몽',
        speakerRole: '소년 궁사',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '전하, 바람의 흐름과 활시위의 팽팽함을 알고 있으니 백 발을 쏘아 백 발 모두 버들잎을 꿰뚫어 보이겠습니다!'
      },
      {
        speaker: '대소왕자 (옆에서 쏘아보며)',
        speakerRole: '부여의 맏왕자',
        speakerAvatarColor: '#ef4444',
        text: '(속으로 혀를 차며) 저 녀석의 기세가 너무 드높다... 후환이 되기 전에 싹을 잘라야겠군.'
      }
    ],
    question: 'Q2. 금와왕과 군사들이 지켜보는 활터에서 주몽은 어떻게 행동해야 할까요?',
    options: [
      {
        text: '화살 100발을 쏘아 모두 명중시키는 백발백중의 실력을 당당히 보여준다.',
        isCorrect: true,
        feedback:
          '정답입니다! 주몽은 백발백중의 솜씨로 백성들의 큰 찬사를 받았습니다. "주몽"이라는 이름 자체가 부여 말로 "활을 잘 쏘는 명궁"을 뜻합니다.'
      },
      {
        text: '왕자들의 질투가 두려우니 화살을 일부러 땅바닥에 빗맞혀 실력을 숨긴다.',
        isCorrect: false,
        feedback:
          '실패! 주몽은 자신의 뛰어난 능력을 당당하게 증명하여 장차 만주벌판을 호령할 영웅의 면모를 백성들에게 각인시켰습니다.'
      }
    ],
    historyLesson:
      '주몽(朱蒙)은 부여 말로 "활을 잘 쏘는 사람"을 뜻합니다. 고구려는 산악 지대에서 말을 타고 활을 쏘는 기마 궁술을 매우 중시한 강력한 무예 국가였습니다.',
    targetPos: { x: 22, y: 8 },
    navHint: '궁전 동쪽 출구를 나와 자갈길을 따라 동쪽 활터(과녁이 서 있는 곳)로 이동하세요.',
    pathWaypoints: [
      { x: 12, y: 10 },
      { x: 15, y: 10 },
      { x: 17, y: 8 },
      { x: 22, y: 8 }
    ],
    transition: {
      title: '대소왕자의 질투와 드리운 위기',
      subtitle: '백발백중의 명궁 주몽을 해치려는 부여 왕자들의 음모',
      backgroundKnowledge:
        '금와왕에게는 일곱 왕자가 있었는데, 맏아들 대소는 주몽의 뛰어난 재주와 신망을 질투하여 "주몽은 사람이 낳지 않았으니 일찍 없애지 않으면 큰 변이 생길 것"이라며 주몽을 해치려 모의했습니다.',
      animationType: 'archery_contest',
      quote: '"어머니, 대소왕자가 칼을 갈며 제 목숨을 노리고 있습니다. 궁궐에 머물수록 죽음의 그림자가 다가옵니다."',
      historicalMeaning: '부여 지배층 내부의 권력 갈등과 주몽의 독자 세력화 계기'
    },
    targetType: 'archery'
  },
  {
    id: 3,
    stageNumber: 3,
    location: '유화부인의 비밀 방 (궁궐 남쪽 내실)',
    title: '어머니의 당부와 결심!',
    subtitle: '3단계: 대소왕자의 암살 위협과 남쪽 탈출 결단',
    npcName: '어머니 유화부인',
    npcRole: '슬기로운 어머니',
    npcAvatarColor: '#f43f5e',
    story:
      '대소왕자의 살해 음모를 미리 알아챈 어머니 유화부인이 주몽을 은밀히 불렀습니다. 방 안에는 등불 하나가 어둠을 밝히고 있고, 유화부인은 눈물을 머금고 남쪽으로의 탈출을 권유합니다.',
    dialogueScript: [
      {
        speaker: '유화부인',
        speakerRole: '어머니',
        speakerAvatarColor: '#f43f5e',
        text: '주몽아, 나라 사람들이 너를 해치려 한다. 재주와 지략을 가진 네가 여기서 남의 손에 죽는 것은 너무도 원통한 일이다.'
      },
      {
        speaker: '주몽',
        speakerRole: '청년 궁사',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '어머니를 홀로 남겨두고 어찌 발걸음이 떨어지겠습니까? 제 뜻을 펼칠 땅이 정녕 남쪽에 있습니까?'
      },
      {
        speaker: '유화부인',
        speakerRole: '어머니',
        speakerAvatarColor: '#f43f5e',
        text: '남쪽으로 가거라! 큰 뜻을 품고 새로운 나라를 열어 백성을 보살피는 것이 네 운명이란다. 속히 떠나거라!'
      }
    ],
    question: 'Q3. 대소왕자의 살해 위협 속에서 주몽은 어떤 결단을 내려야 할까요?',
    options: [
      {
        text: '대소왕자에게 찾아가 무릎 꿇고 활을 부러뜨리며 용서를 빈다.',
        isCorrect: false,
        feedback:
          '실패! 시기심에 눈이 먼 대소왕자에게 항복하면 비참하게 목숨을 잃게 됩니다. 영웅은 고난 속에서 새로운 역사를 개척해야 합니다.'
      },
      {
        text: '어머니의 깊은 뜻을 받들어 남쪽으로 탈출하여 새로운 나라를 건설한다.',
        isCorrect: true,
        feedback:
          '정답입니다! 유화부인은 "큰 그릇을 가진 인재가 시기심에 갇혀 죽을 수 없다"며 남쪽으로 탈출하여 나라를 세울 것을 독려했습니다.'
      }
    ],
    historyLesson:
      '주몽의 부여 탈출은 고구려 건국 집단이 부여의 기득권 세력과 갈등 끝에 남쪽으로 이동하여 독자적인 국가를 세우게 된 역사적 사실을 설화로 전하는 것입니다.',
    targetPos: { x: 10, y: 16 },
    navHint: '활터에서 서쪽 궁궐 안뜰을 거쳐 남쪽 회랑 아래 비밀 내실로 들어가세요.',
    pathWaypoints: [
      { x: 22, y: 8 },
      { x: 16, y: 13 },
      { x: 10, y: 13 },
      { x: 10, y: 16 }
    ],
    transition: {
      title: '달빛 아래 은밀한 탈출: 세 명의 동지를 찾아라',
      subtitle: '어머니의 축복을 안고 궁궐 담을 넘어 저자거리로 향하다',
      backgroundKnowledge:
        '주몽은 준마를 골라 타고 궁궐을 탈출했습니다. 그러나 한 사람의 힘만으로는 거대한 제국을 세울 수 없었습니다. 주몽에게는 생사를 함께할 충직한 동지들이 필요했습니다.',
      animationType: 'escape_palace',
      quote: '"나와 뜻을 함께하여 새 세상을 열 충직한 벗들이 주막에 모여 기다리고 있다!"',
      historicalMeaning: '초기 건국 세력의 동지 규합과 국가 형성의 첫 발걸음'
    },
    targetType: 'yuhwa'
  },
  {
    id: 4,
    stageNumber: 4,
    location: '주막 / 저자거리 (부여 남문 외곽)',
    title: '충직한 세 친구를 규합하라!',
    subtitle: '4단계: 개국공신 오이(烏伊), 마리(摩離), 협보(陝父)와의 결의',
    npcName: '오이, 마리, 협보',
    npcRole: '주몽의 의형제이자 고구려 개국 공신',
    npcAvatarColor: '#10b981',
    story:
      '부여 남문 밖 저자거리 주막에서 평소 주몽과 뜻을 같이하던 세 명의 영걸 오이, 마리, 협보가 기다리고 있었습니다. 그들은 주몽의 탈출 소식을 듣고 기꺼이 목숨을 걸고 함께 따르겠다고 맹세합니다.',
    dialogueScript: [
      {
        speaker: '오이 (창을 꼬나쥐며)',
        speakerRole: '용맹한 창수',
        speakerAvatarColor: '#10b981',
        text: '주몽 님! 우리는 당신의 기개와 인품을 오래전부터 흠모해 왔습니다. 어디든 앞장서서 길을 뚫겠습니다!'
      },
      {
        speaker: '마리 & 협보',
        speakerRole: '충직한 무사들',
        speakerAvatarColor: '#3b82f6',
        text: '대소왕자의 졸개들이 이미 성문을 닫고 추격을 시작했습니다. 우리 넷이 힘을 합치면 두려울 것이 없습니다!'
      },
      {
        speaker: '주몽',
        speakerRole: '결사대장',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '고맙네, 나의 벗들이여! 그대들과 함께라면 만 리 길의 가시밭길도 능히 헤쳐 나갈 수 있소. 남쪽으로 달립시다!'
      }
    ],
    question: 'Q4. 험난한 망명 길목에서 주몽은 어떻게 행동해야 할까요?',
    options: [
      {
        text: '뜻을 같이하는 세 친구(오이, 마리, 협보)와 의형제를 맺고 힘을 합쳐 함께 떠난다.',
        isCorrect: true,
        feedback:
          '정답입니다! 세 친구는 주몽의 든든한 날개가 되어 주었고, 훗날 고구려를 세우는 데 가장 큰 공을 세운 일등공신이 되었습니다.'
      },
      {
        text: '혼자 가는 것이 빠르니 벗들의 청을 거절하고 외롭게 혼자 떠난다.',
        isCorrect: false,
        feedback:
          '실패! 혼자만의 힘으로는 나라를 세울 수 없습니다. 주몽 곁에는 늘 신뢰할 수 있는 훌륭한 동지들이 함께했습니다.'
      }
    ],
    historyLesson:
      '오이, 마리, 협보는 주몽과 함께 고구려를 세운 3대 개국 공신입니다. 이들은 훗날 장군과 재상이 되어 고구려의 기틀을 닦고 주변 영토를 개척했습니다.',
    targetPos: { x: 32, y: 16 },
    navHint: '비밀 방을 나와 동쪽 흙길을 따라 저자거리 주막(테이블과 술통이 있는 곳)으로 가세요.',
    pathWaypoints: [
      { x: 10, y: 16 },
      { x: 11, y: 13 },
      { x: 20, y: 13 },
      { x: 30, y: 13 },
      { x: 32, y: 16 }
    ],
    transition: {
      title: '천지를 뒤흔드는 말발굽 소리',
      subtitle: '대소왕자의 부여 철갑 기마 추격대가 국경 길목을 덮치다',
      backgroundKnowledge:
        '주몽 일행의 탈출을 알게 된 부여 조정은 정예 기마병 수백 명을 파견하여 뒤를 바짝 쫓았습니다. 당시 부여는 강력한 철기 문화를 지닌 강국이어서 철갑 기병의 기동력이 대단했습니다.',
      animationType: 'cavalry_pursuit',
      quote: '"추격대의 깃발이 언덕 너머로 보인다! 말에 박차를 가하라! 결코 붙잡힐 수 없다!"',
      historicalMeaning: '부여 철갑 기병의 추격과 목숨을 건 주몽 결사대의 탈주'
    },
    targetType: 'friends'
  },
  {
    id: 5,
    stageNumber: 5,
    location: '부여 국경 탈출로 (동남쪽 숲길)',
    title: '부여 추격대를 따돌려라!',
    subtitle: '5단계: 대소왕자 기마대의 맹렬한 추격과 국경 돌파',
    npcName: '부여 기마 추격대장',
    npcRole: '대소왕자의 친위대장',
    npcAvatarColor: '#ef4444',
    story:
      '주몽 일행 4명이 말을 타고 남쪽 국경을 향해 질주하자, 언덕 위에서 무장한 부여 추격대장이 번쩍이는 창을 겨누며 포위망을 좁혀오고 있습니다. 흙먼지가 하늘을 가립니다!',
    dialogueScript: [
      {
        speaker: '부여 추격대장',
        speakerRole: '대소왕자의 심복',
        speakerAvatarColor: '#ef4444',
        text: '반역자 주몽은 멈추어라! 대소왕자 전하의 명이다! 네놈들의 목을 베어 부여 궁전에 걸겠다!'
      },
      {
        speaker: '협보 & 오이',
        speakerRole: '호위 무사',
        speakerAvatarColor: '#10b981',
        text: '주몽 님, 저희가 후방을 막아서겠습니다! 먼저 달리십시오!'
      },
      {
        speaker: '주몽',
        speakerRole: '결사대장',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '아니다! 우리 넷은 하나다. 지형의 험준함을 이용해 갈림길로 유인하며 쏜살같이 국경을 뚫는다!'
      }
    ],
    question: 'Q5. 부여 국경 길목에서 맹렬히 뒤쫓아오는 추격대를 어떻게 따돌려야 할까요?',
    options: [
      {
        text: '도망치기 힘드니 말에서 내려 수백 명의 정예 기마병과 4명이서 정면 승부를 벌인다.',
        isCorrect: false,
        feedback:
          '실패! 정예 철갑 기마병 수백 명과 4명이 평지에서 맞서면 포위당해 몰살당하고 맙니다. 지혜로운 기동전이 필수적입니다.'
      },
      {
        text: '신속하게 말에 채찍질을 가하며 험준한 산길로 달려 추격대의 추격을 따돌린다.',
        isCorrect: true,
        feedback:
          '정답입니다! 주몽 일행은 바람처럼 빠른 속도와 지형을 이용해 부여 추격대와의 거리를 벌리며 무사히 국경을 빠져나갔습니다.'
      }
    ],
    historyLesson:
      '주몽의 탈출 과정은 위기관리와 빠른 판단력의 연속이었습니다. 고대 사회에서 말(馬)을 잘 다루는 기마술과 기동력은 생존과 전쟁의 가장 중요한 무기였습니다.',
    targetPos: { x: 48, y: 24 },
    navHint: '저자거리에서 동쪽 돌길을 따라 울창한 숲길 언덕(추격대장이 지키는 곳)으로 이동하세요.',
    pathWaypoints: [
      { x: 32, y: 16 },
      { x: 40, y: 18 },
      { x: 52, y: 18 },
      { x: 52, y: 24 },
      { x: 48, y: 24 }
    ],
    transition: {
      title: '앞을 가로막은 거대한 강: 엄호수의 절벽',
      subtitle: '배 한 척 없는 막다른 골목에서 하늘을 우러러 외치다',
      backgroundKnowledge:
        '부여 국경을 빠져나왔으나 거센 물살이 흐르는 거대한 강 "엄호수(엄체수)"가 길을 가로막았습니다. 배는 없고 뒤에서는 부여 추격대의 고함이 들려오는 절체절명의 위기였습니다.',
      animationType: 'river_crying',
      quote: '"나는 천제(하늘의 신)의 아들이요, 하백(물의 신)의 외손이다! 오늘 도망하는데 뒤쫓는 자들이 닥쳐오니 어찌해야 합니까!"',
      historicalMeaning: '천손(天孫)과 수신(水神)의 결합을 알리는 천명 선포'
    },
    targetType: 'pursuers'
  },
  {
    id: 6,
    stageNumber: 6,
    location: '엄호수 강가 (북쪽 나루터)',
    title: '하늘에 혈통을 외쳐라!',
    subtitle: '6단계: 절체절명의 강가에서 선포한 천손(天孫)의 외침',
    npcName: '엄호수 강변 나루터',
    npcRole: '푸른 엄호수의 신비한 기운',
    npcAvatarColor: '#0284c7',
    story:
      '추격대를 따돌리고 당도한 곳은 푸르고 깊은 엄호수였습니다. 물살이 소용돌이치며 건널 방도가 없는데, 언덕 뒤에서 다시 추격대의 말발굽 소리가 지축을 흔듭니다. 주몽은 활을 높이 쳐들고 채찍으로 수면을 치며 하늘에 외치기 시작합니다.',
    dialogueScript: [
      {
        speaker: '주몽',
        speakerRole: '천손의 영웅',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '하늘이시여, 물의 신이시여! 나는 해모수 천제의 아들이요, 하백의 외손 주몽입니다!'
      },
      {
        speaker: '오이 & 마리',
        speakerRole: '동지들',
        speakerAvatarColor: '#10b981',
        text: '추격대의 먼지구름이 강둑 위로 보입니다! 주몽 님, 강물이 깊어 건널 수 없습니다!'
      },
      {
        speaker: '주몽',
        speakerRole: '천손의 영웅',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '하늘이 나를 내셨다면 결코 이곳에서 목숨을 잃게 두지 않을 것이다! 강물이여, 길을 열어라!'
      }
    ],
    question: 'Q6. 앞을 가로막은 거대한 강가에서 주몽은 무엇이라 당당히 선포해야 할까요?',
    options: [
      {
        text: '"나는 천제(하늘의 신)의 아들이요, 하백(물의 신)의 외손이다! 나를 도우라!" 외친다.',
        isCorrect: true,
        feedback:
          '정답입니다! 주몽이 당당하게 하늘과 물의 신의 혈통임을 선포하자, 강물 속에서 기적과 같은 응답이 일어납니다.'
      },
      {
        text: '어쩔 수 없으니 하늘을 원망하며 스스로 깊은 강물 속으로 뛰어든다.',
        isCorrect: false,
        feedback:
          '실패! 거친 소용돌이에 휩쓸려 목숨을 잃게 됩니다. 주몽은 자신의 신성한 정체성을 자각하고 하늘에 구원을 청했습니다.'
      }
    ],
    historyLesson:
      '주몽은 천제(하늘) 해모수와 수신(물) 하백의 딸 유화의 피를 이어받았습니다. 이는 고구려가 하늘과 물의 보살핌을 받는 신성한 나라라는 "천손 의식"을 백성들에게 심어주었습니다.',
    targetPos: { x: 30, y: 30 },
    navHint: '숲길에서 남서쪽으로 내려와 엄호수 강변 나루터(나무 표지판이 서 있는 곳)로 가세요.',
    pathWaypoints: [
      { x: 48, y: 24 },
      { x: 40, y: 26 },
      { x: 30, y: 26 },
      { x: 30, y: 30 }
    ],
    transition: {
      title: '어하자교(魚鼈之橋)의 기적',
      subtitle: '물고기와 자라들이 수면 위로 솟구쳐 살아있는 다리를 놓다',
      backgroundKnowledge:
        '주몽의 외침에 감응한 수만 마리의 물고기와 커다란 자라들이 떠올라 등을 맞대어 다리를 놓아주었습니다. 주몽 일행이 건너자마자 다리는 흩어져 부여 추격대는 강을 건너지 못했습니다.',
      animationType: 'turtle_bridge_rising',
      quote: '"자라와 물고기들이 우리를 돕는다! 어서 저들의 등을 밟고 남쪽 기슭으로 건너가자!"',
      historicalMeaning: '설화적 장치를 통해 표현된 자연의 도움과 부여 추격의 완전한 차단'
    },
    targetType: 'river_sign'
  },
  {
    id: 7,
    stageNumber: 7,
    location: '엄호수 물결 위 (신비한 거북과 자라의 다리)',
    title: '자라와 물고기 다리를 건너라!',
    subtitle: '7단계: 어하자교(魚鼈之橋)의 신화적 기적과 남쪽 도강',
    npcName: '영험한 거대 자라',
    npcRole: '하백의 수신 사자',
    npcAvatarColor: '#059669',
    story:
      '주몽의 말이 끝나기 무섭게 강물에서 거대한 자라들과 황금빛 잉어 떼가 수면 위로 솟구쳐 올랐습니다. 그들은 서로 껍데기와 등을 단단히 맞대어 강 양쪽을 잇는 살아있는 다리를 완성했습니다!',
    dialogueScript: [
      {
        speaker: '영험한 거대 자라',
        speakerRole: '물의 신 사자',
        speakerAvatarColor: '#059669',
        text: '하백 님의 외손 주몽이시여! 물의 권능으로 그대에게 길을 열어드리니 지체 말고 등을 밟고 건너소서!'
      },
      {
        speaker: '주몽',
        speakerRole: '천손의 영웅',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '신령한 생물들이여, 참으로 고맙소! 형제들이여, 서둘러 강을 건너자!'
      },
      {
        speaker: '부여 추격병 (강 건너편에서)',
        speakerRole: '부여 기병',
        speakerAvatarColor: '#ef4444',
        text: '어, 어떻게 사람이 강 위를 걸어간단 말인가?! 신의 조화다! 쫓아갈 수 없다!'
      }
    ],
    question: 'Q7. 물고기와 자라들이 만들어 준 기적의 다리 앞에서 주몽은 어떻게 해야 할까요?',
    options: [
      {
        text: '미끄러워 보이니 강물이 추운 겨울에 얼어붙을 때까지 며칠 동안 기다린다.',
        isCorrect: false,
        feedback:
          '실패! 며칠을 기다리는 사이 뒤쫓아온 대소왕자의 추격대에게 붙잡히고 맙니다. 신화 속 절호의 기회를 놓쳐서는 안 됩니다.'
      },
      {
        text: '물고기와 자라들이 등을 맞대어 만들어 준 다리를 밟고 신속하게 남쪽으로 건넌다.',
        isCorrect: true,
        feedback:
          '정답입니다! 주몽 일행이 강을 건너자마자 물고기와 자라들은 흩어졌고, 뒤쫓아온 부여 추격대는 강을 건너지 못하고 발만 굴렀습니다.'
      }
    ],
    historyLesson:
      '물고기와 자라가 다리를 놓아주었다는 설화를 "어하자교(魚鼈之橋)"라고 부릅니다. 이는 부여의 가혹한 추격을 따돌리고 무사히 새로운 삶의 터전으로 옮겨갔음을 극적으로 상징합니다.',
    targetPos: { x: 30, y: 33 },
    navHint: '강가 나루터에서 강물 위로 솟아오른 거북이와 자라 다리의 중심부로 건너가세요.',
    pathWaypoints: [
      { x: 30, y: 30 },
      { x: 30, y: 33 }
    ],
    transition: {
      title: '남쪽의 풍요로운 땅: 졸본과 여걸 소서노',
      subtitle: '엄호수를 건너 졸본의 토착 세력 연타발과 그의 딸 소서노를 만나다',
      backgroundKnowledge:
        '남쪽 졸본에 도착한 주몽은 그곳의 유력한 상인 가문이자 부족장이었던 연타발의 딸 "소서노"를 만났습니다. 소서노는 풍부한 재력과 뛰어난 정치적 감각을 지닌 뛰어난 여걸이었습니다.',
      animationType: 'soseono_alliance',
      quote: '"주몽 님의 드높은 이상과 용기라면, 저의 재력과 백성들을 합쳐 천하를 호령할 나라를 세울 수 있습니다!"',
      historicalMeaning: '이주민 세력(주몽)과 토착 세력(소서노)의 평화적이고 강력한 결합'
    },
    targetType: 'turtle_bridge'
  },
  {
    id: 8,
    stageNumber: 8,
    location: '졸본 마을 (연타발의 저택 앞마당)',
    title: '현명한 소서노와의 건국 동맹!',
    subtitle: '8단계: 졸본 토착 세력의 재력과 주몽의 리더십이 융합되다',
    npcName: '소서노 (召西奴)',
    npcRole: '졸본의 여장부이자 연타발의 딸',
    npcAvatarColor: '#8b5cf6',
    story:
      '엄호수를 무사히 건넌 주몽 일행은 풍요로운 졸본(卒本) 땅에 당도했습니다. 비단과 철기를 교역하던 졸본의 여걸 소서노는 주몽의 영웅적 풍모를 알아보고, 건국의 든든한 동반자가 되어 주겠다고 제안합니다.',
    dialogueScript: [
      {
        speaker: '소서노',
        speakerRole: '졸본의 여걸',
        speakerAvatarColor: '#8b5cf6',
        text: '북쪽 부여에서 비범한 영웅이 오셨다는 소문을 들었습니다. 저 소서노는 그대와 뜻을 합치고 싶습니다.'
      },
      {
        speaker: '주몽',
        speakerRole: '영웅 주몽',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '부인의 명망은 익히 들었소. 우리는 새로운 나라를 세워 백성들이 외적의 침략 없이 평화롭게 살 터전을 만들고자 하오.'
      },
      {
        speaker: '소서노',
        speakerRole: '졸본의 여걸',
        speakerAvatarColor: '#8b5cf6',
        text: '제게는 군량미와 철기, 그리고 충성스러운 졸본의 백성들이 있습니다. 우리의 힘을 합쳐 새 시대를 엽시다!'
      }
    ],
    question: 'Q8. 새로운 터전 졸본에서 나라의 기틀을 다지기 위해 소서노와 어떤 관계를 맺어야 할까요?',
    options: [
      {
        text: '소서노와 뜻을 합쳐 동맹과 혼인을 맺고 경제적·정치적 기반을 확고히 한다.',
        isCorrect: true,
        feedback:
          '정답입니다! 소서노의 풍부한 재력과 졸본 토착민의 지지를 얻어 주몽은 흔들리지 않는 건국의 단단한 기반을 마련했습니다.'
      },
      {
        text: '토착 세력을 불신하고 무작정 칼을 뽑아 무력으로 졸본 마을을 약탈한다.',
        isCorrect: false,
        feedback:
          '실패! 낯선 땅에서 무력으로 주민들을 핍박하면 민심을 잃고 건국에 실패합니다. 소서노와의 평화적 연합은 고구려 건국의 결정적 원동력이었습니다.'
      }
    ],
    historyLesson:
      '소서노는 주몽을 도와 고구려를 건국하고, 훗날 두 아들(비류와 온조)을 데리고 남쪽으로 내려가 한강 유역에 백제를 세우는 데도 결정적 역할을 한 한국사 최고의 여성 지도자입니다.',
    targetPos: { x: 18, y: 46 },
    navHint: '강을 건너 남쪽 길을 따라 서쪽 졸본 마을(보라색 깃발과 기와가 있는 저택)로 이동하세요.',
    pathWaypoints: [
      { x: 30, y: 36 },
      { x: 30, y: 42 },
      { x: 18, y: 42 },
      { x: 18, y: 46 }
    ],
    transition: {
      title: '천혜의 요새: 오녀산성의 깎아지른 절벽',
      subtitle: '사방이 절벽으로 둘러싸인 천연 요새를 첫 도읍으로 정하다',
      backgroundKnowledge:
        '주몽과 소서노는 나라의 첫 도읍(수도)으로 해발 800m의 험준한 절벽 산성인 "졸본 산성(오녀산성)"을 택했습니다. 적이 사방에서 쳐들어와도 한 곳의 좁은 성문만 지키면 적을 쉽게 막아낼 수 있는 난공불락의 요새였습니다.',
      animationType: 'mountain_fortress',
      quote: '"이 험준한 바위산 위에 성벽을 쌓으면, 수만의 적군이 몰려와도 우리 백성들을 안전하게 지켜낼 수 있다!"',
      historicalMeaning: '고구려 특유의 산성 방어 전술과 방어에 유리한 수도 입지 선정'
    },
    targetType: 'soseono'
  },
  {
    id: 9,
    stageNumber: 9,
    location: '오녀산성 입구 (졸본 산성 요새 관문)',
    title: '천혜의 산성 수도를 세워라!',
    subtitle: '9단계: 방어에 유리한 졸본 산성(오녀산성)을 첫 도읍으로 결정',
    npcName: '졸본 산성 수문장',
    npcRole: '오녀산성 요새의 석공이자 수비대장',
    npcAvatarColor: '#64748b',
    story:
      '소서노와 연합한 주몽은 국가의 첫 수도를 정하고자 합니다. 주변에는 말갈족 등 사나운 부족들이 호시탐탐 기회를 엿보고 있습니다. 깎아지른 절벽 위에 단단한 돌을 쌓아 올린 오녀산성 관문에 선 주몽의 눈빛이 빛납니다.',
    dialogueScript: [
      {
        speaker: '산성 수문장',
        speakerRole: '요새 수비대장',
        speakerAvatarColor: '#64748b',
        text: '주몽 님! 이곳 오녀산성은 해발 800m에 달하며 삼면이 칼로 자른 듯한 수직 절벽입니다. 정면 관문만 지키면 난공불락입니다!'
      },
      {
        speaker: '주몽',
        speakerRole: '졸본의 총사령관',
        speakerAvatarColor: '#38bdf8',
        isJumong: true,
        text: '초기 국가에서는 백성의 안전과 튼튼한 방어가 국력의 근본이다. 평지가 아닌 이 산성 요새를 도읍으로 삼겠다!'
      },
      {
        speaker: '오이 & 협보',
        speakerRole: '장군들',
        speakerAvatarColor: '#10b981',
        text: '탁월하신 선택입니다! 이곳에서 힘을 길러 장차 만주벌판으로 뻗어나갈 기틀을 닦겠습니다!'
      }
    ],
    question: 'Q9. 고구려의 첫 번째 수도(도읍)로 어떤 지형을 선택해야 안전할까요?',
    options: [
      {
        text: '깎아지른 절벽으로 둘러싸여 적의 침략을 쉽게 막을 수 있는 험준한 졸본 산성(오녀산성)을 선택한다.',
        isCorrect: true,
        feedback:
          '정답입니다! 초기 고구려는 나라의 힘이 아직 강대하지 않았기에, 천혜의 자연 방어막인 험준한 산악 요새를 수도로 정해 외적의 침략을 완벽히 방어했습니다.'
      },
      {
        text: '적이 사방에서 언제든 쉽게 쳐들어올 수 있는 방어벽 없는 허허벌판 평지를 도읍으로 삼는다.',
        isCorrect: false,
        feedback:
          '실패! 초기 고구려가 방어벽 없는 평지에 도읍을 두면 주변 강한 적들의 기습 공격을 막아내지 못하고 위태로워집니다.'
      }
    ],
    historyLesson:
      '고구려의 첫 도읍인 졸본 산성(오늘날 중국 환인 오녀산성)은 수직 절벽 위에 지어진 철벽 요새로, 평지성과 산성을 함께 활용했던 고구려의 독창적인 산성 문화를 잘 보여줍니다.',
    targetPos: { x: 38, y: 46 },
    navHint: '졸본 마을에서 동쪽 돌길을 따라 우뚝 솟은 오녀산성 석축 성문으로 이동하세요.',
    pathWaypoints: [
      { x: 18, y: 46 },
      { x: 26, y: 46 },
      { x: 34, y: 46 },
      { x: 38, y: 46 }
    ],
    transition: {
      title: '하늘에 올리는 제사와 건국의 환호',
      subtitle: '기원전 37년, 동명성왕이 삼족오 깃발 아래 국호 "고구려"를 선포하다',
      backgroundKnowledge:
        '마침내 기원전 37년, 오녀산성 정상의 하늘 제단에서 제사를 지내며 나라 이름을 "고구려(高句麗)"라 선포했습니다. 주몽은 첫 임금 "동명성왕"으로 즉위하여 700년 고구려 역사의 위대한 새벽을 열었습니다.',
      animationType: 'altar_coronation',
      quote: '"하늘과 땅이 감응하사, 오늘 이 자리에 영원히 빛날 위대한 제국 \'고구려\'의 탄생을 온 천하에 선포하노라!"',
      historicalMeaning: '동북아시아의 패자로 우뚝 서게 될 대제국 고구려의 공식 건국'
    },
    targetType: 'fortress'
  },
  {
    id: 10,
    stageNumber: 10,
    location: '고구려 건국 제단 (오녀산성 정상)',
    title: '위대한 고구려의 탄생!',
    subtitle: '10단계: 기원전 37년, 국호 고구려 선포와 동명성왕 즉위',
    npcName: '고구려 건국 대제관 & 삼족오 깃발',
    npcRole: '천제 봉헌 제관과 환호하는 백성들',
    npcAvatarColor: '#dc2626',
    story:
      '기원전 37년, 오녀산성 정상의 신성한 하늘 제단에 백성들과 군사들이 구름처럼 모였습니다. 붉은 불꽃이 피어오르고, 태양 속의 신성한 세 발 달린 까마귀 "삼족오(三足烏)" 깃발이 바람에 장엄하게 펄럭입니다. 주몽은 마침내 제단에 올랐습니다.',
    dialogueScript: [
      {
        speaker: '건국 대제관',
        speakerRole: '하늘의 제관',
        speakerAvatarColor: '#dc2626',
        text: '천제의 아드님이시여! 향불이 하늘에 닿았습니다. 만백성이 그대를 군주로 모시고자 엎드려 기다리고 있습니다!'
      },
      {
        speaker: '주몽 (동명성왕)',
        speakerRole: '고구려 건국 대왕',
        speakerAvatarColor: '#fbbf24',
        isJumong: true,
        text: '나 주몽은 하늘의 뜻을 받들어 오늘 이 땅에 새로운 나라를 세운다! 우리의 국호는 "고구려(高句麗)"다!'
      },
      {
        speaker: '백성들과 장수들 (오이, 마리, 협보, 소서노)',
        speakerRole: '고구려의 백성들',
        speakerAvatarColor: '#f59e0b',
        text: '동명성왕 만세! 고구려 만세! 천손의 나라 고구려여, 영원히 번영하라!'
      }
    ],
    question: 'Q10. 하늘 제단에 오른 주몽은 모인 백성들에게 무엇이라 선포해야 할까요?',
    options: [
      {
        text: '나라 세우기를 포기하고 부여의 대소왕자에게 다시 돌아가 신하로 머리를 숙인다.',
        isCorrect: false,
        feedback:
          '실패! 숱한 고난을 이겨내고 이룩한 건국의 문턱에서 굴복할 수 없습니다. 당당하게 고구려의 개국을 선포해야 합니다!'
      },
      {
        text: '국호를 당당히 "고구려(高句麗)"로 선포하고 첫 번째 임금 동명성왕(東明聖王)이 된다.',
        isCorrect: true,
        feedback:
          '정답입니다! 기원전 37년, 동명성왕 주몽은 고구려를 건국하며 한민족 역사상 가장 용맹하고 찬란했던 대제국의 서막을 열었습니다!'
      }
    ],
    historyLesson:
      '기원전 37년 주몽에 의해 건국된 고구려는 이후 700여 년 동안 광개토대왕, 장수왕 등 위대한 군주들을 거치며 만주와 한반도를 호령하는 동북아시아의 당당한 강대국으로 우뚝 섰습니다.',
    targetPos: { x: 50, y: 46 },
    navHint: '산성 관문을 통과하여 동쪽 정상의 거대한 제단(삼족오 깃발과 불꽃이 타오르는 곳)으로 오르세요.',
    pathWaypoints: [
      { x: 38, y: 46 },
      { x: 44, y: 46 },
      { x: 50, y: 46 }
    ],
    transition: {
      title: '축하합니다! 위대한 고구려 건국 완성!',
      subtitle: '기원전 37년, 동명성왕 주몽의 대서사시 완성',
      backgroundKnowledge:
        '초등 5학년 역사 수업: 주몽의 건국 과정은 난생 설화, 무예 중시, 부여로부터의 이주, 동지 규합, 토착 세력(소서노)과의 연합, 산성 방어 체제 등 고대 국가 성립의 모든 핵심 요소를 생생하게 보여줍니다.',
      animationType: 'altar_coronation',
      quote: '"우리의 영토는 넓어질 것이며, 고구려의 기상은 수천 년 역사 속에 길이 빛날 것이다!"',
      historicalMeaning: '700년 대제국 고구려의 공식 출범과 한민족 역사의 위대한 전환점'
    },
    targetType: 'altar'
  }
];
