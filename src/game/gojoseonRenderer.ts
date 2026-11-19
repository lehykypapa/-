import { Player, Particle } from '../types';
import { GOJOSEON_STAGES } from '../data/gojoseonStages';
import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE, TILES } from './worldMap';
import { getGojoseonEvolution } from '../utils/evolution';

interface GojoseonRenderOptions {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  map: number[][];
  player: Player;
  currentStageId: number;
  particles: Particle[];
  ambientPetals: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }>;
  gameTime: number;
  inRangeOfTarget: boolean;
}

export function renderGojoseonWorld({
  ctx,
  canvasWidth,
  canvasHeight,
  map,
  player,
  currentStageId,
  particles,
  ambientPetals,
  gameTime,
  inRangeOfTarget
}: GojoseonRenderOptions) {
  // 0. Base dark background
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 1. Camera calculation
  const targetCamX = player.x + player.width / 2 - canvasWidth / 2;
  const targetCamY = player.y + player.height / 2 - canvasHeight / 2;

  const worldPixelW = MAP_WIDTH * TILE_SIZE;
  const worldPixelH = MAP_HEIGHT * TILE_SIZE;

  const camX = Math.max(0, Math.min(worldPixelW - canvasWidth, targetCamX));
  const camY = Math.max(0, Math.min(worldPixelH - canvasHeight, targetCamY));

  ctx.save();
  ctx.translate(-camX, -camY);

  const startTileX = Math.max(0, Math.floor(camX / TILE_SIZE));
  const endTileX = Math.min(MAP_WIDTH, Math.ceil((camX + canvasWidth) / TILE_SIZE) + 1);
  const startTileY = Math.max(0, Math.floor(camY / TILE_SIZE));
  const endTileY = Math.min(MAP_HEIGHT, Math.ceil((camY + canvasHeight) / TILE_SIZE) + 1);

  // 2. Render Tiles
  for (let ty = startTileY; ty < endTileY; ty++) {
    for (let tx = startTileX; tx < endTileX; tx++) {
      const tile = map[ty]?.[tx] ?? TILES.GRASS;
      const px = tx * TILE_SIZE;
      const py = ty * TILE_SIZE;

      drawGojoseonTile(ctx, tile, px, py, tx, ty, currentStageId, gameTime);
    }
  }

  // 3. Golden Breadcrumbs Trail to Current Mission Target
  drawGuidanceBreadcrumbs(ctx, player, currentStageId, gameTime);

  // 4. Draw Interactive NPCs and Stage Objects
  drawGojoseonStageObjects(ctx, currentStageId, gameTime, inRangeOfTarget);

  // 5. Draw Particles
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // 6. Draw Player (Hwanung / Dangun Wanggeom) with 5-Tier Evolution
  drawEvolvingGojoseonHero(ctx, player, currentStageId, gameTime);

  // 7. Ambient Golden Pollen / Sacred Mist
  ambientPetals.forEach(pt => {
    ctx.save();
    ctx.globalAlpha = pt.alpha;
    ctx.fillStyle = currentStageId <= 4 ? '#38bdf8' : (currentStageId <= 7 ? '#a7f3d0' : '#fbbf24');
    ctx.beginPath();
    ctx.ellipse(pt.x, pt.y, pt.size * 1.4, pt.size, gameTime * 0.002, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore(); // Exit camera coordinates

  // 8. Draw Screen Overlay HUD Navigation Compass & Distance
  drawScreenNavigationHud(
    ctx,
    canvasWidth,
    canvasHeight,
    camX,
    camY,
    player,
    currentStageId,
    gameTime
  );
}

// ----------------------------------------------------
// Tile Renderer
// ----------------------------------------------------
function drawGojoseonTile(
  ctx: CanvasRenderingContext2D,
  tile: number,
  px: number,
  py: number,
  tx: number,
  ty: number,
  _currentStageId: number,
  gameTime: number
) {
  switch (tile) {
    case TILES.GRASS: {
      const isAlt = (tx + ty) % 2 === 0;
      ctx.fillStyle = isAlt ? '#15803d' : '#166534';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#14532d';
      ctx.fillRect(px + 4, py + 8, 8, 2);
      ctx.fillRect(px + 24, py + 26, 12, 2);
      break;
    }
    case TILES.PATH: {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(px + 10, py + 12, 6, 4);
      break;
    }
    case TILES.STONE_PATH: {
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
      break;
    }
    case TILES.FLOOR: {
      if (ty < 16) {
        // Heavenly Palace marble floor
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      } else {
        // Cave or ancient house floor
        ctx.fillStyle = '#334155';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      }
      break;
    }
    case TILES.CARPET: {
      if (ty < 16) {
        // Heavenly Gold Throne Carpet
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(px + 12, py + 12, TILE_SIZE - 24, TILE_SIZE - 24);
      } else {
        // Sacred Altar Crimson Carpet
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      }
      break;
    }
    case TILES.WATER: {
      const wave = Math.sin(gameTime * 0.003 + tx * 0.5 + ty * 0.5) * 3;
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px + 4 + wave, py + 14, TILE_SIZE - 10, 3);
      ctx.fillRect(px + 8 - wave, py + 32, TILE_SIZE - 16, 2);
      break;
    }
    case TILES.BRIDGE: {
      ctx.fillStyle = '#9a3412';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(px + 2, py + 4, TILE_SIZE - 4, 3);
      ctx.fillRect(px + 2, py + 22, TILE_SIZE - 4, 3);
      ctx.fillRect(px + 2, py + 40, TILE_SIZE - 4, 3);
      break;
    }
    case TILES.WALL: {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, 10);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 2, py + 16, TILE_SIZE - 4, TILE_SIZE - 18);
      break;
    }
    case TILES.TREE: {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 20, py + 24, 8, 20);
      // Canopy
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.arc(px + 24, py + 18, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(px + 22, py + 15, 12, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case TILES.MOUNTAIN: {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(px + 24, py + 4);
      ctx.lineTo(px + 44, py + 44);
      ctx.lineTo(px + 4, py + 44);
      ctx.closePath();
      ctx.fill();
      // Rock highlight
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(px + 24, py + 4);
      ctx.lineTo(px + 30, py + 28);
      ctx.lineTo(px + 14, py + 44);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case TILES.FENCE: {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(px + 4, py + 14, TILE_SIZE - 8, 6);
      ctx.fillRect(px + 4, py + 28, TILE_SIZE - 8, 6);
      ctx.fillRect(px + 10, py + 6, 6, 36);
      ctx.fillRect(px + 32, py + 6, 6, 36);
      break;
    }
  }
}

// ----------------------------------------------------
// Breadcrumbs Trail
// ----------------------------------------------------
function drawGuidanceBreadcrumbs(
  ctx: CanvasRenderingContext2D,
  player: Player,
  currentStageId: number,
  gameTime: number
) {
  const currentStage = GOJOSEON_STAGES.find(s => s.id === currentStageId);
  if (!currentStage) return;

  const targetPxX = currentStage.targetPos.x * TILE_SIZE + TILE_SIZE / 2;
  const targetPxY = currentStage.targetPos.y * TILE_SIZE + TILE_SIZE / 2;
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = -gameTime * 0.04;
  ctx.beginPath();
  ctx.moveTo(playerCenterX, playerCenterY);
  ctx.lineTo(targetPxX, targetPxY);
  ctx.stroke();
  ctx.restore();
}

// ----------------------------------------------------
// Stage Objects & Detailed NPCs
// ----------------------------------------------------
function drawGojoseonStageObjects(
  ctx: CanvasRenderingContext2D,
  currentStageId: number,
  gameTime: number,
  near: boolean
) {
  GOJOSEON_STAGES.forEach(stage => {
    const px = stage.targetPos.x * TILE_SIZE;
    const py = stage.targetPos.y * TILE_SIZE;
    const isCurrent = stage.id === currentStageId;
    const isCompleted = stage.id < currentStageId;

    ctx.save();

    // Stage 1: Heavenly Palace Throne of Hwanin
    if (stage.id === 1) {
      // Golden Throne Platform
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px - 4, py + 12, 56, 32);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 2, py + 4, 44, 12);

      // Father Hwanin
      drawDetailedHwanin(ctx, px + 24, py + 16, gameTime);
      drawStageNameTag(ctx, px + 24, py - 14, '1단계: 환인의 옥좌', isCurrent, isCompleted);
    }
    // Stage 2: Three Sacred Heavenly Treasures (천부인 제단)
    else if (stage.id === 2) {
      // Altar Table
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(px + 6, py + 22, 36, 18);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(px + 8, py + 18, 32, 6);

      // Three Treasures: Mirror, Bell, Sword
      const pulse = Math.sin(gameTime * 0.006) * 3;
      // Mirror (거울)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px + 14, py + 12 + pulse, 6, 0, Math.PI * 2);
      ctx.fill();
      // Bell (방울)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(px + 24, py + 10 - pulse, 6, 0, Math.PI * 2);
      ctx.fill();
      // Sword (검)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(px + 32, py + 6 + pulse, 4, 16);

      // Guardian NPC
      drawDetailedNPC(ctx, px + 44, py + 18, '#a855f7', '수호관');
      drawStageNameTag(ctx, px + 24, py - 14, '2단계: 천부인 3개 제단', isCurrent, isCompleted);
    }
    // Stage 3: Sacred Sindansu Tree & 3 Ministers (Pungbaek, Unsa, Usa)
    else if (stage.id === 3) {
      // Massive Sindansu Tree
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 18, py - 10, 12, 48);
      // Sacred Canopy
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.arc(px + 24, py - 24, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(px + 24, py - 26, 26, 0, Math.PI * 2);
      ctx.fill();

      // Pungbaek, Unsa, Usa NPCs
      drawDetailedNPC(ctx, px - 6, py + 18, '#0ea5e9', '풍백(바람)');
      drawDetailedNPC(ctx, px + 24, py + 22, '#64748b', '운사(구름)');
      drawDetailedNPC(ctx, px + 52, py + 18, '#0284c7', '우사(비)');

      drawStageNameTag(ctx, px + 24, py - 60, '3단계: 신단수와 세 신하', isCurrent, isCompleted);
    }
    // Stage 4: Sinsi Governance Plaza & Village Elder
    else if (stage.id === 4) {
      // Platform with Governance Scrolls
      ctx.fillStyle = '#b45309';
      ctx.fillRect(px + 6, py + 24, 36, 16);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(px + 12, py + 16, 24, 10);

      drawDetailedNPC(ctx, px + 24, py + 12, '#10b981', '원로 백성');
      drawStageNameTag(ctx, px + 24, py - 14, '4단계: 360여 가지 인간사 정비', isCurrent, isCompleted);
    }
    // Stage 5: Mount Taebaek Cave Entrance (Bear & Tiger)
    else if (stage.id === 5) {
      // Cave Entrance Arch
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(px + 24, py + 24, 22, Math.PI, 0);
      ctx.fill();

      // Mugwort & Garlic baskets
      ctx.fillStyle = '#84cc16'; // Mugwort
      ctx.fillRect(px + 8, py + 28, 8, 8);
      ctx.fillStyle = '#f8fafc'; // Garlic
      ctx.fillRect(px + 32, py + 28, 8, 8);

      // Bear and Tiger standing side by side
      drawDetailedBear(ctx, px + 14, py + 14, gameTime);
      drawDetailedTiger(ctx, px + 36, py + 14, gameTime);

      drawStageNameTag(ctx, px + 24, py - 16, '5단계: 곰과 호랑이의 간청', isCurrent, isCompleted);
    }
    // Stage 6: Dark Cave Interior & Ungnyeo's Transformation
    else if (stage.id === 6) {
      // Holy Light in Cave
      const pulse = Math.sin(gameTime * 0.005) * 6;
      ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      ctx.beginPath();
      ctx.arc(px + 24, py + 20, 26 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Ungnyeo (Newly transformed maiden)
      drawDetailedUngnyeo(ctx, px + 24, py + 16, gameTime);

      // Fleeting Tiger tracks
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(px + 4, py + 30, 6, 4);
      ctx.fillRect(px - 10, py + 34, 6, 4);

      drawStageNameTag(ctx, px + 24, py - 14, '6단계: 인내와 웅녀의 탄생', isCurrent, isCompleted);
    }
    // Stage 7: Sindansu Altar & Dangun Wanggeom's Birth
    else if (stage.id === 7) {
      // Altar
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(px + 4, py + 22, 40, 18);

      // Ungnyeo & Baby Dangun
      drawDetailedUngnyeo(ctx, px + 18, py + 16, gameTime);
      // Baby cradle
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px + 32, py + 20, 16, 10);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(px + 40, py + 20, 5, 0, Math.PI * 2);
      ctx.fill();

      drawStageNameTag(ctx, px + 24, py - 14, '7단계: 단군왕검의 탄생', isCurrent, isCompleted);
    }
    // Stage 8: Gojoseon Founding Altar & Banner
    else if (stage.id === 8) {
      // Grand Stone Altar
      ctx.fillStyle = '#475569';
      ctx.fillRect(px - 4, py + 16, 56, 26);
      // National Banner: "조선"
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(px + 36, py - 16, 20, 28);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('朝鮮', px + 38, py - 2);

      drawDetailedNPC(ctx, px + 14, py + 16, '#eab308', '건국 대장군');
      drawStageNameTag(ctx, px + 24, py - 24, '8단계: 기원전 2333년 고조선 건국', isCurrent, isCompleted);
    }
    // Stage 9: Asadal Capital & Bronze Crafting
    else if (stage.id === 9) {
      // Table Dolmen (탁자식 고인돌)
      ctx.fillStyle = '#64748b';
      // Supporting leg stones
      ctx.fillRect(px + 4, py + 16, 8, 20);
      ctx.fillRect(px + 36, py + 16, 8, 20);
      // Giant capstone
      ctx.fillRect(px - 2, py + 10, 52, 10);

      // Bronze craftsman with Mandolin Dagger
      drawDetailedNPC(ctx, px + 24, py + 18, '#0284c7', '청동 장인');
      drawStageNameTag(ctx, px + 24, py - 14, '9단계: 아사달 천도와 태평성대', isCurrent, isCompleted);
    }
    // Stage 10: Chamseongdan Grand Altar & Hongik Ingan Eternal Light
    else if (stage.id === 10) {
      // Chamseongdan Stone Pyramid Steps
      ctx.fillStyle = '#334155';
      ctx.fillRect(px - 10, py + 16, 68, 26);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px - 4, py + 10, 56, 12);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 4, py + 4, 40, 8);

      // Eternal Flame of Hongik Ingan
      const flame = Math.sin(gameTime * 0.01) * 4;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px + 24, py - 2 + flame, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(px + 24, py - 2 + flame, 6, 0, Math.PI * 2);
      ctx.fill();

      drawDetailedNPC(ctx, px + 24, py + 14, '#f59e0b', '대제천관');
      drawStageNameTag(ctx, px + 24, py - 18, '10단계: 홍익인간 영원한 빛', isCurrent, isCompleted);
    }

    // Active Mission Aura
    if (isCurrent) {
      const pulse = Math.sin(gameTime * 0.005) * 6;
      ctx.fillStyle = near ? 'rgba(251, 191, 36, 0.4)' : 'rgba(251, 191, 36, 0.2)';
      ctx.beginPath();
      ctx.arc(px + 24, py + 24, 28 + pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

// ----------------------------------------------------
// Specific Character Visuals
// ----------------------------------------------------
function drawDetailedHwanin(ctx: CanvasRenderingContext2D, x: number, y: number, gameTime: number) {
  // Heavenly Halo
  const halo = Math.sin(gameTime * 0.004) * 4;
  ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.beginPath();
  ctx.arc(x, y - 6, 16 + halo, 0, Math.PI * 2);
  ctx.fill();

  // Robe
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x - 8, y, 16, 20);

  // Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(x, y - 6, 8, 0, Math.PI * 2);
  ctx.fill();

  // White Beard
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(x - 6, y - 2);
  ctx.lineTo(x + 6, y - 2);
  ctx.lineTo(x, y + 8);
  ctx.closePath();
  ctx.fill();

  // Golden Heavenly Crown
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x - 7, y - 14, 14, 5);
}

function drawDetailedUngnyeo(ctx: CanvasRenderingContext2D, x: number, y: number, _gameTime: number) {
  // Pure White & Soft Rose Hanbok
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(x - 7, y + 6, 14, 16);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x - 6, y, 12, 8);

  // Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(x, y - 6, 7, 0, Math.PI * 2);
  ctx.fill();

  // Hair & Ribbon
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(x, y - 8, 7, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 2, y + 1, 4, 12);
}

function drawDetailedBear(ctx: CanvasRenderingContext2D, x: number, y: number, _gameTime: number) {
  // Deep Brown Bear Body
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(x, y + 8, 12, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(x, y - 4, 9, 0, Math.PI * 2);
  ctx.fill();
  // Ears
  ctx.beginPath();
  ctx.arc(x - 6, y - 10, 3, 0, Math.PI * 2);
  ctx.arc(x + 6, y - 10, 3, 0, Math.PI * 2);
  ctx.fill();
  // Snout
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(x, y - 3, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawDetailedTiger(ctx: CanvasRenderingContext2D, x: number, y: number, _gameTime: number) {
  // Orange Striped Tiger Body
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(x, y + 8, 11, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(x, y - 4, 8, 0, Math.PI * 2);
  ctx.fill();
  // Stripes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 8, y + 4, 16, 2);
  ctx.fillRect(x - 6, y + 9, 12, 2);
  // Ears
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(x - 5, y - 10, 3, 0, Math.PI * 2);
  ctx.arc(x + 5, y - 10, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawDetailedNPC(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  name: string
) {
  // Body
  ctx.fillStyle = color;
  ctx.fillRect(x - 6, y + 2, 12, 18);

  // Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(x, y - 4, 7, 0, Math.PI * 2);
  ctx.fill();

  // Hat
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 6, y - 10, 12, 4);

  // Name
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(name, x, y + 27);
}

function drawStageNameTag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  isCurrent: boolean,
  isCompleted: boolean
) {
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';

  if (isCurrent) {
    ctx.fillStyle = '#fef08a';
    ctx.fillText('⭐ ' + text, x, y);
  } else if (isCompleted) {
    ctx.fillStyle = '#86efac';
    ctx.fillText('✔ ' + text, x, y);
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(text, x, y);
  }
}

// ----------------------------------------------------
// Hero Character (Hwanung -> Dangun Wanggeom)
// ----------------------------------------------------
function drawEvolvingGojoseonHero(
  ctx: CanvasRenderingContext2D,
  player: Player,
  currentStageId: number,
  gameTime: number
) {
  const px = player.x;
  const py = player.y;
  const evo = getGojoseonEvolution(currentStageId);

  // Evolutionary Aura
  const auraPulse = Math.sin(gameTime * 0.006) * 3;
  ctx.fillStyle = evo.level >= 4 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(56, 189, 248, 0.25)';
  ctx.beginPath();
  ctx.arc(px + 16, py + 18, 18 + auraPulse, 0, Math.PI * 2);
  ctx.fill();

  // Robe / Armor Body
  ctx.fillStyle = evo.mainColor;
  ctx.fillRect(px + 6, py + 12, 20, 20);

  // Trim / Accent
  ctx.fillStyle = evo.accentColor;
  ctx.fillRect(px + 10, py + 16, 12, 4);

  // Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(px + 16, py + 6, 8, 0, Math.PI * 2);
  ctx.fill();

  // Crown / Hair band
  if (evo.level === 5) {
    // Grand Golden Crown
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(px + 8, py - 3, 16, 5);
    ctx.beginPath();
    ctx.moveTo(px + 16, py - 7);
    ctx.lineTo(px + 20, py - 2);
    ctx.lineTo(px + 12, py - 2);
    ctx.closePath();
    ctx.fill();
  } else if (evo.level >= 3) {
    ctx.fillStyle = '#b45309';
    ctx.fillRect(px + 9, py - 1, 14, 4);
  } else {
    // Heavenly Ribbon
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(px + 10, py - 1, 12, 3);
  }

  // Name Tag
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(evo.title, px + 16, py - 7);
}

// ----------------------------------------------------
// Navigation Compass HUD
// ----------------------------------------------------
function drawScreenNavigationHud(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  _canvasHeight: number,
  _camX: number,
  _camY: number,
  player: Player,
  currentStageId: number,
  gameTime: number
) {
  const stage = GOJOSEON_STAGES.find(s => s.id === currentStageId);
  if (!stage) return;

  const targetPxX = stage.targetPos.x * TILE_SIZE + TILE_SIZE / 2;
  const targetPxY = stage.targetPos.y * TILE_SIZE + TILE_SIZE / 2;
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const dx = targetPxX - playerCenterX;
  const dy = targetPxY - playerCenterY;
  const angle = Math.atan2(dy, dx);
  const dist = Math.round(Math.hypot(dx, dy) / 4);

  // Compass Widget in Top-Right
  const compassX = canvasWidth - 56;
  const compassY = 48;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(compassX, compassY, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Compass needle
  ctx.save();
  ctx.translate(compassX, compassY);
  ctx.rotate(angle);

  // Golden Pointer
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(2, 6);
  ctx.lineTo(4, 0);
  ctx.lineTo(2, -6);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Distance label
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(dist + 'm', compassX, compassY + 36);

  // Pulsing prompt when very close
  if (dist <= 25) {
    const pulse = Math.sin(gameTime * 0.008) * 2;
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('접근 완료! [E/대화]', canvasWidth / 2, 60 + pulse);
  }

  ctx.restore();
}
