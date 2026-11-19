import React, { useState, useRef } from 'react';
import { MessageSquare } from 'lucide-react';

interface TouchControlsProps {
  onMove?: (vector: { x: number; y: number }) => void;
  onDirStart?: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onDirEnd?: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onInteract: () => void;
  inRangeOfTarget: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onDirStart,
  onDirEnd,
  onInteract,
  inRangeOfTarget
}) => {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const activeDirsRef = useRef<{ [key: string]: boolean }>({});

  const [knobOffset, setKnobOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);

  const processJoystickMovement = (clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const maxRadius = Math.max(20, rect.width / 2 - 18);

    let knobX = 0;
    let knobY = 0;
    let normX = 0;
    let normY = 0;

    if (dist > 0) {
      const clampedDist = Math.min(dist, maxRadius);
      const factor = clampedDist / dist;
      knobX = dx * factor;
      knobY = dy * factor;
      normX = knobX / maxRadius;
      normY = knobY / maxRadius;
    }

    setKnobOffset({ x: knobX, y: knobY });
    onMove?.({ x: normX, y: normY });

    // Provide discrete direction triggers for fallback listeners
    const threshold = 0.35;
    const newDirs: { [key: string]: boolean } = {
      up: normY < -threshold,
      down: normY > threshold,
      left: normX < -threshold,
      right: normX > threshold
    };

    (['up', 'down', 'left', 'right'] as const).forEach(dir => {
      if (newDirs[dir] && !activeDirsRef.current[dir]) {
        activeDirsRef.current[dir] = true;
        onDirStart?.(dir);
      } else if (!newDirs[dir] && activeDirsRef.current[dir]) {
        activeDirsRef.current[dir] = false;
        onDirEnd?.(dir);
      }
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // pointer capture fallback
    }
    pointerIdRef.current = e.pointerId;
    setIsDragging(true);
    processJoystickMovement(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== e.pointerId) return;
    e.preventDefault();
    processJoystickMovement(e.clientX, e.clientY);
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture fallback
      }
      pointerIdRef.current = null;
      setIsDragging(false);
      setKnobOffset({ x: 0, y: 0 });
      onMove?.({ x: 0, y: 0 });

      // End all active fallback directions
      (['up', 'down', 'left', 'right'] as const).forEach(dir => {
        if (activeDirsRef.current[dir]) {
          activeDirsRef.current[dir] = false;
          onDirEnd?.(dir);
        }
      });
    }
  };

  const handleActionClick = () => {
    if (inRangeOfTarget) {
      onInteract();
    }
  };

  return (
    <div
      id="on-screen-touch-hud"
      className="absolute inset-x-0 bottom-0 p-3 sm:p-5 pointer-events-none z-30 flex items-end justify-between select-none touch-none"
    >
      {/* 1. Left: Virtual Analog Joystick */}
      <div className="pointer-events-auto flex flex-col items-center select-none">
        <div
          ref={baseRef}
          id="virtual-joystick-base"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onContextMenu={e => e.preventDefault()}
          className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none transition-all shadow-2xl border-2 backdrop-blur-md ${
            isDragging
              ? 'bg-slate-950/85 border-amber-400 ring-4 ring-amber-500/30'
              : 'bg-slate-950/70 border-amber-500/40 hover:border-amber-400/70'
          }`}
          aria-label="가상 조이스틱"
        >
          {/* Subtle concentric rings for depth */}
          <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-amber-500/20 pointer-events-none" />
          <div className="absolute w-10 h-10 rounded-full border border-dashed border-amber-500/30 pointer-events-none" />

          {/* Direction Marks */}
          <span className="absolute top-1 text-[10px] text-amber-400/60 font-black pointer-events-none">▲ 상</span>
          <span className="absolute bottom-1 text-[10px] text-amber-400/60 font-black pointer-events-none">하 ▼</span>
          <span className="absolute left-1.5 text-[10px] text-amber-400/60 font-black pointer-events-none">◀ 좌</span>
          <span className="absolute right-1.5 text-[10px] text-amber-400/60 font-black pointer-events-none">우 ▶</span>

          {/* Dynamic Joystick Knob / Thumbstick */}
          <div
            id="virtual-joystick-knob"
            style={{
              transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`
            }}
            className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center pointer-events-none transition-transform duration-75 shadow-xl border-2 ${
              isDragging
                ? 'bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-300 border-white text-slate-950 scale-105 shadow-amber-500/60 ring-2 ring-amber-300'
                : 'bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 border-amber-200 text-slate-950 shadow-amber-900/40'
            }`}
          >
            {/* Grip pattern inside knob */}
            <div className="w-6 h-6 rounded-full border border-slate-950/30 flex items-center justify-center bg-amber-400/30">
              <div className={`w-2 h-2 rounded-full ${isDragging ? 'bg-slate-950' : 'bg-slate-900'}`} />
            </div>
          </div>
        </div>

        {/* Joystick Label Badge */}
        <div className="mt-1.5 px-3 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/40 backdrop-blur-xs text-[10px] sm:text-xs font-bold text-amber-300 flex items-center gap-1 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>가상 조이스틱</span>
        </div>
      </div>

      {/* 2. Right: On-Screen Action & Talk Button */}
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        {/* Not in range tip bubble */}
        {tipVisible && !inRangeOfTarget && (
          <div className="bg-slate-900/95 border border-amber-400 text-amber-200 text-xs px-3 py-1.5 rounded-xl shadow-2xl animate-fade-in text-center max-w-[180px]">
            🚶‍♂️ 황금 점선을 따라 인물에 더 다가가세요!
          </div>
        )}

        {/* Action Button: Strictly active only when near target NPC */}
        <button
          id="btn-action-interact"
          type="button"
          disabled={!inRangeOfTarget}
          onClick={handleActionClick}
          className={`relative rounded-3xl flex flex-col items-center justify-center font-black shadow-2xl transition-all border-2 select-none ${
            inRangeOfTarget
              ? 'w-22 h-22 sm:w-26 sm:h-26 bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-200 shadow-amber-500/50 ring-4 ring-amber-400/50 animate-bounce cursor-pointer active:scale-90'
              : 'w-20 h-20 sm:w-24 sm:h-24 bg-slate-950/70 text-slate-500 border-slate-700/50 opacity-40 cursor-not-allowed pointer-events-none'
          }`}
          aria-label={inRangeOfTarget ? "인물 대화하기" : "인물에 접근 필요"}
        >
          {inRangeOfTarget && (
            <span className="absolute -top-2.5 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full shadow border border-rose-300">
              대화 가능!
            </span>
          )}
          <MessageSquare className={`${inRangeOfTarget ? 'w-8 h-8 sm:w-10 sm:h-10 text-slate-950 stroke-[2.5]' : 'w-6 h-6 sm:w-7 sm:h-7 text-slate-500'}`} />
          <span className={`text-xs sm:text-sm font-black mt-0.5 ${inRangeOfTarget ? 'text-slate-950 font-black' : 'text-slate-400'}`}>
            {inRangeOfTarget ? '대화하기' : '인물 접근 필요'}
          </span>
          <span className="text-[10px] font-semibold opacity-80">
            {inRangeOfTarget ? '[터치 / E]' : '[거리 부족]'}
          </span>
        </button>
      </div>
    </div>
  );
};

