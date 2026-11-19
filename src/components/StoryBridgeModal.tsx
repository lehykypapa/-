import React, { useEffect, useRef, useState } from 'react';
import { StoryTransition } from '../types';

interface StoryBridgeModalProps {
  transition: StoryTransition;
  nextStageNumber: number;
  onProceed: () => void;
  onClose?: () => void;
}

export const StoryBridgeModal: React.FC<StoryBridgeModalProps> = ({
  transition,
  nextStageNumber,
  onProceed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(8);

  // Auto countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animated canvas illustration for each transition type
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const renderAnim = () => {
      time += 1;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw specific animated scene
      switch (transition.animationType) {
        case 'egg_hatching':
          drawEggHatchingScene(ctx, w, h, time);
          break;
        case 'archery_contest':
          drawArcheryScene(ctx, w, h, time);
          break;
        case 'escape_palace':
          drawEscapeScene(ctx, w, h, time);
          break;
        case 'friends_oath':
          drawFriendsOathScene(ctx, w, h, time);
          break;
        case 'cavalry_pursuit':
          drawCavalryPursuitScene(ctx, w, h, time);
          break;
        case 'river_crying':
          drawRiverCryingScene(ctx, w, h, time);
          break;
        case 'turtle_bridge_rising':
          drawTurtleBridgeScene(ctx, w, h, time);
          break;
        case 'soseono_alliance':
          drawSoseonoScene(ctx, w, h, time);
          break;
        case 'mountain_fortress':
          drawMountainFortressScene(ctx, w, h, time);
          break;
        case 'altar_coronation':
          drawAltarCoronationScene(ctx, w, h, time);
          break;
        default:
          drawAltarCoronationScene(ctx, w, h, time);
      }

      animId = requestAnimationFrame(renderAnim);
    };

    animId = requestAnimationFrame(renderAnim);
    return () => cancelAnimationFrame(animId);
  }, [transition.animationType]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-amber-100 uppercase">
              초등 5학년 역사 극장 • 시대의 전환
            </span>
          </div>
          <div className="bg-slate-950/40 text-amber-200 text-xs px-2.5 py-1 rounded-full font-mono">
            {nextStageNumber <= 10 ? `${nextStageNumber}단계로 이동` : '고구려 건국 완성'}
          </div>
        </div>

        {/* Animated Canvas Banner */}
        <div className="relative w-full h-44 sm:h-52 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-amber-500/30">
          <canvas
            ref={canvasRef}
            width={600}
            height={220}
            className="w-full h-full object-cover"
          />
          {/* Quote overlay */}
          <div className="absolute bottom-2 inset-x-4 bg-slate-950/75 backdrop-blur-sm border border-amber-500/40 rounded-lg px-3 py-1.5 text-center">
            <p className="text-xs sm:text-sm text-amber-200 font-bold italic tracking-wide">
              {transition.quote}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300">
              {transition.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {transition.subtitle}
            </p>
          </div>

          {/* Historical Fact Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
              <span>💡</span>
              <span>초등 5학년 역사 콕콕 지식</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {transition.backgroundKnowledge}
            </p>
          </div>

          {/* Historical Meaning Tag */}
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-2 rounded-lg">
            <span className="font-bold shrink-0">역사적 의의:</span>
            <span>{transition.historicalMeaning}</span>
          </div>
        </div>

        {/* Bottom Button Action */}
        <div className="bg-slate-950/80 px-5 py-3.5 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            {secondsLeft > 0 ? `${secondsLeft}초 후 자동 이동 가능` : '준비 완료!'}
          </span>
          <button
            onClick={onProceed}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>다음 단계로 출발!</span>
            <span>➡️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Canvas Scene Drawing Helpers for Animations
// ==========================================

function drawEggHatchingScene(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const cx = w / 2;
  const cy = h / 2 + 10;

  // Divine Sun Rays
  const rays = 12;
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < rays; i++) {
    const angle = (i * Math.PI * 2) / rays + time * 0.01;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0.05)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 160, angle - 0.15, angle + 0.15);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Nest / Silk Cushion
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 30, 45, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glowing Golden Egg
  const eggGlow = Math.sin(time * 0.08) * 4;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 26, 36 + eggGlow * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(cx - 8, cy - 10, 8, 16, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Crack lines
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 4, cy - 20);
  ctx.lineTo(cx + 6, cy - 5);
  ctx.lineTo(cx - 5, cy + 10);
  ctx.lineTo(cx + 8, cy + 24);
  ctx.stroke();

  // Light bursts from crack
  for (let j = 0; j < 5; j++) {
    const burst = (time * 2 + j * 30) % 60;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(cx + Math.sin(j) * 20, cy + Math.cos(j) * 20, (burst / 60) * 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawArcheryScene(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  // Archery field with flying arrows hitting targets
  const cx = w / 2;
  const cy = h / 2;

  // Green turf
  ctx.fillStyle = '#1e3a2b';
  ctx.fillRect(0, cy + 20, w, h);

  // Target on right
  const targetX = w - 100;
  const targetY = cy;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(targetX, targetY - 40, 6, 80);
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(targetX - 2, targetY, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(targetX - 2, targetY, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(targetX - 2, targetY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Jumong Archer on left
  const archerX = 80;
  const archerY = cy + 10;
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(archerX - 10, archerY - 20, 20, 30);
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(archerX, archerY - 30, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(archerX - 10, archerY - 37, 20, 4); // headband

  // Bow
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(archerX + 10, archerY - 10, 18, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // Flying arrows loop
  const arrowProg = (time * 4) % (targetX - archerX);
  const arrowX = archerX + 20 + arrowProg;
  const arrowY = archerY - 10;

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(arrowX - 24, arrowY);
  ctx.lineTo(arrowX, arrowY);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY - 3);
  ctx.lineTo(arrowX + 6, arrowY);
  ctx.lineTo(arrowX, arrowY + 3);
  ctx.closePath();
  ctx.fill();
}

function drawEscapeScene(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  // Midnight blue sky & Giant Silver Moon
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(w - 90, 50, 36, 0, Math.PI * 2);
  ctx.fill();

  // Distant Palace rampart silhouette
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h - 70);
  ctx.lineTo(120, h - 70);
  ctx.lineTo(120, h - 90);
  ctx.lineTo(200, h - 90);
  ctx.lineTo(200, h - 60);
  ctx.lineTo(w, h - 60);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Galloping horse & Jumong
  const runX = ((time * 3) % (w + 100)) - 50;
  const horseY = h - 60 + Math.sin(time * 0.2) * 5;

  ctx.fillStyle = '#78350f';
  ctx.fillRect(runX, horseY - 15, 34, 18); // horse body
  ctx.fillRect(runX + 28, horseY - 28, 12, 20); // neck
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(runX + 10, horseY - 30, 14, 16); // Jumong
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(runX + 17, horseY - 37, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(runX + 8, horseY - 32, 4, 14); // cape
}

function drawFriendsOathScene(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const cx = w / 2;
  const cy = h / 2 + 10;

  // Warm tavern lantern
  const lanternPulse = Math.sin(time * 0.08) * 6;
  ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.beginPath();
  ctx.arc(cx, cy - 30, 80 + lanternPulse, 0, Math.PI * 2);
  ctx.fill();

  // 4 Heroes standing in circle with weapons raised!
  const heroes = [
    { name: '주몽', color: '#38bdf8', x: cx - 45 },
    { name: '오이', color: '#10b981', x: cx - 15 },
    { name: '마리', color: '#3b82f6', x: cx + 15 },
    { name: '협보', color: '#d97706', x: cx + 45 }
  ];

  heroes.forEach(hero => {
    ctx.fillStyle = hero.color;
    ctx.fillRect(hero.x - 10, cy - 10, 20, 30);
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(hero.x, cy - 18, 9, 0, Math.PI * 2);
    ctx.fill();
  });

  // Crossed weapons in the center
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy + 10);
  ctx.lineTo(cx + 30, cy - 25);
  ctx.moveTo(cx + 30, cy + 10);
  ctx.lineTo(cx - 30, cy - 25);
  ctx.stroke();

  // Central oath spark
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 8 + Math.sin(time * 0.1) * 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawCavalryPursuitScene(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  // Dusty battlefield & red sky
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(0, 0, w, h / 2);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(0, h / 2, w, h / 2);

  // Dust cloud
  for (let i = 0; i < 8; i++) {
    const dx = (time * 3 + i * 70) % w;
    const dy = h / 2 + 10 + Math.sin(i + time * 0.05) * 15;
    ctx.fillStyle = 'rgba(217, 119, 6, 0.4)';
    ctx.beginPath();
    ctx.arc(dx, dy, 20 + (i % 3) * 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Multiple pursuit cavalry silhouettes
  for (let k = 0; k < 3; k++) {
    const kx = 100 + k * 90 + Math.sin(time * 0.15 + k) * 10;
    const ky = h / 2 - 10 + k * 12;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(kx, ky, 36, 20); // horse
    ctx.fillRect(kx + 10, ky - 20, 16, 22); // rider
    ctx.strokeStyle = '#dc2626'; // spear
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(kx + 14, ky - 5);
    ctx.lineTo(kx + 44, ky - 30);
    ctx.stroke();
  }
}

function drawRiverCryingScene(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  // Raging turbulent river
  const cy = h / 2 + 20;

  // Storm clouds
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, cy - 30);

  // Lightning flash
  if (Math.sin(time * 0.2) > 0.85) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, w, h);
  }

  // Raging blue waters
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, cy, w, h - cy);

  for (let i = 0; i < 5; i++) {
    const wave = Math.sin(time * 0.05 + i) * 10;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, cy + i * 14 + wave, w, 4);
  }

  // Jumong on cliff shouting to the sky
  const jx = 120;
  const jy = cy - 10;
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(0, cy + 20);
  ctx.lineTo(jx + 20, jy);
  ctx.lineTo(jx + 20, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Jumong raising bow to heavens
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(jx - 10, jy - 30, 16, 26);
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(jx - 2, jy - 38, 8, 0, Math.PI * 2);
  ctx.fill();

  // Bow raised up
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(jx + 14, jy - 50, 14, -Math.PI / 4, (3 * Math.PI) / 4);
  ctx.stroke();
}

function drawTurtleBridgeScene(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  // River base
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(0, 0, w, h);

  // Stepping turtles forming bridge
  const count = 7;
  const bridgeY = h / 2 + 10;

  for (let i = 0; i < count; i++) {
    const tx = 60 + i * 65;
    const ty = bridgeY + Math.sin(time * 0.08 + i) * 5;

    // Turtle body
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.ellipse(tx, ty, 26, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Shell pattern
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(tx - 6, ty - 6, 12, 12);

    // Leaping fish
    const fishJump = Math.sin(time * 0.1 + i * 2);
    if (fishJump > 0.3) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(tx + 20, ty - 20 - fishJump * 15, 8, 3, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Jumong running across
  const runProg = (time * 2.5) % (w - 100);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(60 + runProg, bridgeY - 30, 14, 20);
  ctx.fillStyle = '#dc2626'; // cape
  ctx.fillRect(52 + runProg, bridgeY - 26, 8, 16);
}

function drawSoseonoScene(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const cx = w / 2;
  const cy = h / 2 + 15;

  // Bustling Jolbon market & pavilions
  ctx.fillStyle = '#b45309';
  ctx.fillRect(cx - 150, cy - 70, 80, 50); // Trade stall
  ctx.fillStyle = '#dc2626'; // roof
  ctx.beginPath();
  ctx.moveTo(cx - 160, cy - 70);
  ctx.lineTo(cx - 110, cy - 95);
  ctx.lineTo(cx - 60, cy - 70);
  ctx.closePath();
  ctx.fill();

  // Lady Soseono in purple silk on right
  const sX = cx + 50;
  ctx.fillStyle = '#7c3aed';
  ctx.fillRect(sX - 12, cy - 20, 24, 34);
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(sX, cy - 30, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(sX - 8, cy - 42, 16, 5); // gold comb

  // Jumong in armor on left
  const jX = cx - 50;
  ctx.fillStyle = '#334155';
  ctx.fillRect(jX - 12, cy - 20, 24, 34);
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(jX, cy - 30, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626'; // red cape
  ctx.fillRect(jX - 18, cy - 16, 6, 26);

  // Alliance Scroll glowing between their hands
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(cx - 15, cy - 12, 30, 16);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - 15, cy - 12, 30, 16);

  // Glowing handshake rays
  const pulse = Math.sin(time * 0.1) * 3;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy - 4, 18 + pulse, 0, Math.PI * 2);
  ctx.stroke();
}

function drawMountainFortressScene(ctx: CanvasRenderingContext2D, w: number, h: number, _time: number) {
  // Majestic Onyeosan Clifftop Fortress
  const cx = w / 2;
  const cy = h / 2 + 20;

  // Sky with floating mountain mist
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, w, h);

  // High Mountain Cliffs
  ctx.fillStyle = '#3f3f46';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(80, cy - 50);
  ctx.lineTo(cx + 80, cy - 50);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Stone ramparts atop the cliff
  ctx.fillStyle = '#64748b';
  ctx.fillRect(100, cy - 75, cx, 25);
  // Battlements
  for (let i = 0; i < 7; i++) {
    ctx.fillRect(100 + i * 36, cy - 85, 20, 10);
  }

  // Stone arch gateway
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cx - 20, cy - 75, 40, 25);
}

function drawAltarCoronationScene(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const cx = w / 2;
  const cy = h / 2 + 10;

  // Golden Celestial Sun Disk
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(cx, cy - 40, 50, 0, Math.PI * 2);
  ctx.fill();

  // Sacred Three-Legged Crow (삼족오) Silhouette
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(cx, cy - 42, 18, 0, Math.PI * 2); // crow body
  ctx.fill();
  // Crow wings
  ctx.beginPath();
  ctx.ellipse(cx - 20, cy - 46, 16, 6, -0.4, 0, Math.PI * 2);
  ctx.ellipse(cx + 20, cy - 46, 16, 6, 0.4, 0, Math.PI * 2);
  ctx.fill();
  // Three legs!
  ctx.fillRect(cx - 6, cy - 24, 3, 10);
  ctx.fillRect(cx - 1, cy - 24, 3, 10);
  ctx.fillRect(cx + 4, cy - 24, 3, 10);

  // Ceremonial Stone Altar
  ctx.fillStyle = '#475569';
  ctx.fillRect(cx - 80, cy + 20, 160, 40);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(cx - 90, cy + 14, 180, 8);

  // Holy Braziers
  const flame = Math.sin(time * 0.15) * 4;
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(cx - 70, cy + 12 + flame, 12, 0, Math.PI * 2);
  ctx.arc(cx + 70, cy + 12 - flame, 12, 0, Math.PI * 2);
  ctx.fill();

  // King Dongmyeongseongwang in Golden Headdress
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cx - 14, cy - 8, 28, 28);
  ctx.fillStyle = '#fbbf24'; // Golden Sun Medallion
  ctx.beginPath();
  ctx.arc(cx, cy + 4, 6, 0, Math.PI * 2);
  ctx.fill();

  // Head & Crown
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(cx, cy - 16, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24'; // Golden Twin Feathers Crown
  ctx.fillRect(cx - 10, cy - 26, 20, 5);
  ctx.fillRect(cx - 6, cy - 35, 4, 10);
  ctx.fillRect(cx + 2, cy - 35, 4, 10);
}
