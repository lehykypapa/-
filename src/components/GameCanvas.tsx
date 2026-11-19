import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Player, Particle } from '../types';
import { MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, generateMap, isTileSolid } from '../game/worldMap';
import { generateGojoseonMap, isGojoseonTileSolid } from '../game/gojoseonWorldMap';
import { renderGameWorld } from '../game/renderer';
import { renderGojoseonWorld } from '../game/gojoseonRenderer';
import { STAGES } from '../data/stages';
import { GOJOSEON_STAGES } from '../data/gojoseonStages';
import { sounds } from '../utils/audio';

interface GameCanvasProps {
  gameMode?: 'gojoseon' | 'jumong';
  currentStageId: number;
  onOpenDialog: () => void;
  isDialogOpen: boolean;
  touchDir?: { up: boolean; down: boolean; left: boolean; right: boolean };
  touchVector?: { x: number; y: number };
  setInRangeOfTarget: (inRange: boolean) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameMode = 'gojoseon',
  currentStageId,
  onOpenDialog,
  isDialogOpen,
  touchDir,
  touchVector,
  setInRangeOfTarget
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Map state depending on gameMode
  const isGojoseon = gameMode === 'gojoseon';
  const activeStages = isGojoseon ? GOJOSEON_STAGES : STAGES;
  const mapRef = useRef<number[][]>(isGojoseon ? generateGojoseonMap() : generateMap());

  // Reset map when gameMode changes
  useEffect(() => {
    mapRef.current = isGojoseon ? generateGojoseonMap() : generateMap();
    playerRef.current.x = isGojoseon ? 12 * TILE_SIZE : 10 * TILE_SIZE;
    playerRef.current.y = isGojoseon ? 12 * TILE_SIZE : 10 * TILE_SIZE;
  }, [isGojoseon]);

  // Player state
  const playerRef = useRef<Player>({
    x: (isGojoseon ? 12 : 10) * TILE_SIZE,
    y: (isGojoseon ? 12 : 10) * TILE_SIZE,
    width: 32,
    height: 32,
    speed: 3.6,
    dir: 'down',
    isMoving: false,
    frame: 0,
    stepTimer: 0
  });

  // Particles
  const particlesRef = useRef<Particle[]>([]);
  const ambientPetalsRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }>
  >([]);

  // Key state
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const [inRange, setLocalInRange] = useState(false);

  // Initialize ambient petals
  useEffect(() => {
    const petals = [];
    const worldW = MAP_WIDTH * TILE_SIZE;
    const worldH = MAP_HEIGHT * TILE_SIZE;
    for (let i = 0; i < 30; i++) {
      petals.push({
        x: Math.random() * worldW,
        y: Math.random() * worldH,
        vx: 0.6 + Math.random() * 0.7,
        vy: 0.4 + Math.random() * 0.6,
        size: 2.5 + Math.random() * 2,
        alpha: 0.25 + Math.random() * 0.45
      });
    }
    ambientPetalsRef.current = petals;
  }, []);

  // Distance check helper
  const checkDistanceToTarget = useCallback(() => {
    const stage = activeStages.find(s => s.id === currentStageId);
    if (!stage) return false;

    const tX = stage.targetPos.x * TILE_SIZE + TILE_SIZE / 2;
    const tY = stage.targetPos.y * TILE_SIZE + TILE_SIZE / 2;
    const pX = playerRef.current.x + playerRef.current.width / 2;
    const pY = playerRef.current.y + playerRef.current.height / 2;

    const dist = Math.hypot(tX - pX, tY - pY);
    return dist < 68;
  }, [currentStageId, activeStages]);

  // Try interact
  const handleInteract = useCallback(() => {
    if (isDialogOpen) return;
    if (checkDistanceToTarget()) {
      sounds.playInteract();
      onOpenDialog();
    }
  }, [isDialogOpen, checkDistanceToTarget, onOpenDialog]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.up = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.down = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;

      if (['KeyE', 'Space', 'Enter'].includes(e.code)) {
        if (!isDialogOpen) {
          e.preventDefault();
          handleInteract();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.down = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isDialogOpen, handleInteract]);

  // Canvas ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = Math.floor(width);
        canvas.height = Math.floor(height);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Main Game Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(60, now - lastTime);
      lastTime = now;

      const player = playerRef.current;
      const keys = keysRef.current;
      const map = mapRef.current;

      // Combine joystick, keyboard, and virtual touch controls
      let dx = 0;
      let dy = 0;

      if (!isDialogOpen) {
        // 1. Analog Joystick input
        if (touchVector && (Math.abs(touchVector.x) > 0.08 || Math.abs(touchVector.y) > 0.08)) {
          dx = touchVector.x;
          dy = touchVector.y;
          if (Math.abs(dx) > Math.abs(dy)) {
            player.dir = dx > 0 ? 'right' : 'left';
          } else {
            player.dir = dy > 0 ? 'down' : 'up';
          }
        } else {
          // 2. Keyboard & fallback directional input
          const isUp = keys.up || (touchDir && touchDir.up);
          const isDown = keys.down || (touchDir && touchDir.down);
          const isLeft = keys.left || (touchDir && touchDir.left);
          const isRight = keys.right || (touchDir && touchDir.right);

          if (isUp) {
            dy -= 1;
            player.dir = 'up';
          }
          if (isDown) {
            dy += 1;
            player.dir = 'down';
          }
          if (isLeft) {
            dx -= 1;
            player.dir = 'left';
          }
          if (isRight) {
            dx += 1;
            player.dir = 'right';
          }
        }
      }

      player.isMoving = Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05;

      // Update movement with precise box-tile collision
      if (player.isMoving) {
        const len = Math.hypot(dx, dy) || 1;
        const speedFactor = touchVector && (Math.abs(touchVector.x) > 0.08 || Math.abs(touchVector.y) > 0.08)
          ? Math.max(0.65, Math.min(1.0, len))
          : 1.0;

        const moveX = (dx / len) * player.speed * speedFactor;
        const moveY = (dy / len) * player.speed * speedFactor;

        // Try move X
        const nextX = player.x + moveX;
        const pad = 4;
        const tx1 = Math.floor((nextX + pad) / TILE_SIZE);
        const tx2 = Math.floor((nextX + player.width - pad) / TILE_SIZE);
        const ty1 = Math.floor((player.y + pad) / TILE_SIZE);
        const ty2 = Math.floor((player.y + player.height - pad) / TILE_SIZE);

        // Collision checker based on active game mode
        const solidFn = isGojoseon ? isGojoseonTileSolid : isTileSolid;

        if (
          !solidFn(tx1, ty1, map, currentStageId) &&
          !solidFn(tx2, ty1, map, currentStageId) &&
          !solidFn(tx1, ty2, map, currentStageId) &&
          !solidFn(tx2, ty2, map, currentStageId)
        ) {
          player.x = nextX;
        }

        // Try move Y
        const nextY = player.y + moveY;
        const nyX1 = Math.floor((player.x + pad) / TILE_SIZE);
        const nyX2 = Math.floor((player.x + player.width - pad) / TILE_SIZE);
        const nyY1 = Math.floor((nextY + pad) / TILE_SIZE);
        const nyY2 = Math.floor((nextY + player.height - pad) / TILE_SIZE);

        if (
          !solidFn(nyX1, nyY1, map, currentStageId) &&
          !solidFn(nyX2, nyY1, map, currentStageId) &&
          !solidFn(nyX1, nyY2, map, currentStageId) &&
          !solidFn(nyX2, nyY2, map, currentStageId)
        ) {
          player.y = nextY;
        }

        // Footstep sounds & dust particles
        player.stepTimer += dt;
        if (player.stepTimer > 290) {
          player.stepTimer = 0;
          sounds.playStep();
          particlesRef.current.push({
            x: player.x + player.width / 2 + (Math.random() - 0.5) * 8,
            y: player.y + player.height - 2,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.4,
            color: '#cbd5e1',
            size: 3,
            life: 16,
            maxLife: 16
          });
        }
      }

      // Update footstep particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Update ambient petals
      const worldW = MAP_WIDTH * TILE_SIZE;
      const worldH = MAP_HEIGHT * TILE_SIZE;
      ambientPetalsRef.current.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x > worldW) pt.x = 0;
        if (pt.y > worldH) pt.y = 0;
      });

      // Target range check
      const near = checkDistanceToTarget();
      setLocalInRange(near);
      setInRangeOfTarget(near);

      // Render World
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx && canvas.width > 0 && canvas.height > 0) {
          if (isGojoseon) {
            renderGojoseonWorld({
              ctx,
              canvasWidth: canvas.width,
              canvasHeight: canvas.height,
              map,
              player,
              currentStageId,
              particles: particlesRef.current,
              ambientPetals: ambientPetalsRef.current,
              gameTime: now,
              inRangeOfTarget: near
            });
          } else {
            renderGameWorld({
              ctx,
              canvasWidth: canvas.width,
              canvasHeight: canvas.height,
              map,
              player,
              currentStageId,
              particles: particlesRef.current,
              ambientPetals: ambientPetalsRef.current,
              gameTime: now,
              inRangeOfTarget: near
            });
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentStageId, isDialogOpen, touchDir, checkDistanceToTarget, setInRangeOfTarget, isGojoseon]);

  return (
    <div
      ref={containerRef}
      id="game-canvas-container"
      className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-slate-950 select-none"
    >
      <canvas
        ref={canvasRef}
        id="game-viewport-canvas"
        className="block w-full h-full"
      />

      {/* Floating Prompt Banner when in range */}
      {inRange && !isDialogOpen && (
        <button
          id="canvas-interact-prompt-btn"
          onClick={handleInteract}
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2 rounded-full font-black text-xs sm:text-sm shadow-2xl border-2 border-white animate-bounce cursor-pointer flex items-center gap-1.5 z-20"
        >
          <span>💬 대화하기 (E 키 또는 터치)</span>
        </button>
      )}
    </div>
  );
};
