import React from 'react';
import { X, BookOpen, Compass, ShieldCheck, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  gameMode?: 'gojoseon' | 'jumong';
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ gameMode = 'gojoseon', onClose }) => {
  const isGojoseon = gameMode === 'gojoseon';

  return (
    <div
      id="help-modal-backdrop"
      className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        id="help-modal-card"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 sm:p-6 text-left text-xs sm:text-sm text-slate-200 shadow-2xl relative max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-amber-300">
              {isGojoseon ? '고조선 건국 신화 탐험 수업 안내' : '고구려 건국 탐험대 수업 안내'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 leading-relaxed">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <h4 className="font-bold text-amber-200 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>수업 연계: 초등학교 5학년 사회 (역사 영역) · 제작: 이현균선생님</span>
            </h4>
            <p className="text-slate-300 text-xs">
              {isGojoseon ? (
                <>
                  우리 역사상 최초의 국가 성립 단원의 핵심인 <strong>'단군 신화와 고조선의 건국(홍익인간, 널리 인간을 이롭게 하라)'</strong>을 2D 메타버스 탐험을 통해 즐겁게 배울 수 있도록 구성되었습니다.
                </>
              ) : (
                <>
                  삼국과 가야의 성립 단원의 핵심인 <strong>'주몽의 고구려 건국 신화와 역사적 의미'</strong>를 2D 메타버스 탐험을 통해 즐겁게 배울 수 있도록 구성되었습니다.
                </>
              )}
            </p>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-amber-200 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>탐험 10단계 동선</span>
            </h4>
            {isGojoseon ? (
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs">
                <li>하늘나라 환인의 궁전 (인간 세상에 뜻을 품다)</li>
                <li>천상의 신전 (천부인 세 개를 수여받다)</li>
                <li>바람·비·구름의 언덕 (풍백, 운사, 우사와의 결속)</li>
                <li>태백산 신단수 (신시를 열고 360여 가지 일을 주관)</li>
                <li>태백산 어두운 동굴 (곰과 호랑이의 소원)</li>
                <li>동굴 깊은 곳 (인내의 시험, 쑥과 마늘)</li>
                <li>신단수 아래 (웅녀와의 만남, 단군왕검 탄생)</li>
                <li>평양성 건국 터 (기원전 2333년 고조선 건국)</li>
                <li>백악산 아사달 언덕 (도읍을 옮기고 백성을 보살핌)</li>
                <li>고조선 천제단 (홍익인간 정신, 역사의 시작)</li>
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs">
                <li>부여 유화부인의 처소 (신비한 알)</li>
                <li>부여 궁전 활터 (백발백중 활솜씨)</li>
                <li>유화부인의 비밀 방 (탈출 결심)</li>
                <li>주막 저자거리 (오이, 마리, 협보와의 만남)</li>
                <li>부여 국경 탈출로 (추격대 따돌리기)</li>
                <li>엄호수 강가 (천손 선포)</li>
                <li>엄호수 다리 (물고기와 자라의 기적)</li>
                <li>졸본 마을 (소서노와의 동맹)</li>
                <li>오녀산성 입구 (천혜의 산성 수도 선정)</li>
                <li>고구려 건국 제단 (기원전 37년, 국호 고구려 선포)</li>
              </ol>
            )}
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
            <h4 className="font-bold text-amber-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>조작 및 힌트</span>
            </h4>
            <p className="text-slate-300 text-xs">
              • <strong>이동:</strong> 키보드 W/A/S/D, 방향키 또는 화면 하단의 터치 방향키<br />
              • <strong>상호작용:</strong> 목표에 가까이 다가가면 나타나는 [E] 키 또는 [대화하기] 버튼 클릭<br />
              • <strong>방향 안내:</strong> 바닥의 황금빛 유도선과 화면 우측 상단 나침반이 다음 목표 위치를 항상 안내합니다.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
