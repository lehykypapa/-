export interface EvolutionInfo {
  level: number;
  title: string;
  subTitle: string;
  description: string;
  outfitName: string;
  mainColor: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
}

export function getJumongEvolution(stageId: number): EvolutionInfo {
  if (stageId <= 2) {
    return {
      level: 1,
      title: '소년 주몽',
      subTitle: '난생의 신비와 비범한 소년',
      description: '순백의 삼베옷과 붉은 댕기 머리띠를 두르고, 나무 연습용 활을 든 총명한 소년 시절',
      outfitName: '동자 도포 & 연습용 활',
      mainColor: '#38bdf8', // sky blue
      accentColor: '#ef4444', // red ribbon
      badgeBg: 'bg-sky-950/80',
      badgeBorder: 'border-sky-400/50'
    };
  } else if (stageId <= 5) {
    return {
      level: 2,
      title: '명궁 청년 주몽',
      subTitle: '백발백중 궁사와 망명자',
      description: '부여의 짙은 남색 사냥꾼 도포와 가죽 보호대를 착용하고 날카로운 각궁을 멘 청년 궁사',
      outfitName: '남색 사냥꾼 복식 & 뿔활(각궁)',
      mainColor: '#1e40af', // deep royal blue
      accentColor: '#b45309', // horn bow brown
      badgeBg: 'bg-indigo-950/80',
      badgeBorder: 'border-indigo-400/50'
    };
  } else if (stageId <= 7) {
    return {
      level: 3,
      title: '천손의 결사대장',
      subTitle: '하늘과 물의 신성을 지닌 영웅',
      description: '가슴에 견고한 고구려 찰갑(철비늘 갑옷)을 덧대고 붉은 망토를 두른 위풍당당한 전사',
      outfitName: '고구려 철갑 비늘갑옷 & 진홍 망토',
      mainColor: '#b91c1c', // crimson red
      accentColor: '#f59e0b', // bronze scale
      badgeBg: 'bg-rose-950/80',
      badgeBorder: 'border-rose-400/50'
    };
  } else if (stageId <= 9) {
    return {
      level: 4,
      title: '졸본의 총사령관',
      subTitle: '소서노와 연합한 건국의 기둥',
      description: '황금빛 장식이 들어간 흑철 찰갑과 허리에 환두대도를 찬 졸본의 수장이자 총사령관',
      outfitName: '황금 테두리 장군 갑옷 & 환두대도',
      mainColor: '#0f172a', // dark steel
      accentColor: '#eab308', // gold trim
      badgeBg: 'bg-amber-950/80',
      badgeBorder: 'border-amber-400/50'
    };
  } else {
    return {
      level: 5,
      title: '태조 동명성왕 (東明聖王)',
      subTitle: '기원전 37년 고구려 개국 군주',
      description: '황금 깃털 조우관(황금관)과 찬란한 자주빛 왕실 용포를 걸치고 신성한 태양의 기운을 품은 제왕',
      outfitName: '황금 조우관(鳥羽冠) & 제왕 용포',
      mainColor: '#fbbf24', // radiant gold
      accentColor: '#7c3aed', // imperial purple
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-400'
    };
  }
}

export function getGojoseonEvolution(stageId: number): EvolutionInfo {
  if (stageId <= 2) {
    return {
      level: 1,
      title: '천상의 태자 환웅',
      subTitle: '홍익인간의 뜻을 품은 하늘의 자손',
      description: '순백의 천상 도포와 은빛 허리띠를 두르고, 하늘빛 신비한 후광을 발하는 천제의 아들',
      outfitName: '천상 백의(白衣) 도포 & 천인 관',
      mainColor: '#38bdf8',
      accentColor: '#fbbf24',
      badgeBg: 'bg-sky-950/80',
      badgeBorder: 'border-sky-400/50'
    };
  } else if (stageId <= 4) {
    return {
      level: 2,
      title: '신시의 천왕 환웅',
      subTitle: '천부인을 쥐고 신시를 연 지도자',
      description: '천부인(청동거울·청동방울·청동검)의 신령한 힘을 두르고 풍백·운사·우사를 지휘하는 성왕',
      outfitName: '청동 천부인 무구 & 신시 관복',
      mainColor: '#0284c7',
      accentColor: '#10b981',
      badgeBg: 'bg-cyan-950/80',
      badgeBorder: 'border-cyan-400/50'
    };
  } else if (stageId <= 6) {
    return {
      level: 3,
      title: '자애로운 스승 환웅',
      subTitle: '곰과 호랑이에게 인내를 가르치다',
      description: '백성을 바른길로 인도하는 지혜의 지팡이와 쑥·마늘의 약초 주머니를 찬 자비로운 개척자',
      outfitName: '신선 도복 & 지혜의 석장',
      mainColor: '#059669',
      accentColor: '#d97706',
      badgeBg: 'bg-emerald-950/80',
      badgeBorder: 'border-emerald-400/50'
    };
  } else if (stageId <= 8) {
    return {
      level: 4,
      title: '청년 단군왕검',
      subTitle: '하늘과 땅의 축복을 받은 건국 영웅',
      description: '비파형 동검을 허리에 차고 웅녀의 대지 기운과 환웅의 천상 기운을 물려받은 청년 군장',
      outfitName: '비파형 동검 & 청동 흉갑',
      mainColor: '#b45309',
      accentColor: '#fbbf24',
      badgeBg: 'bg-amber-950/80',
      badgeBorder: 'border-amber-400/50'
    };
  } else {
    return {
      level: 5,
      title: '국조 단군왕검 (檀君王儉)',
      subTitle: '기원전 2333년 우리 겨레의 첫 임금',
      description: '청동기 찬란한 금빛 관과 비파형 동검, 제정일치의 권위를 상징하는 위대한 대제왕',
      outfitName: '황금 청동관 & 국조 제왕 예복',
      mainColor: '#f59e0b',
      accentColor: '#dc2626',
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-400'
    };
  }
}
