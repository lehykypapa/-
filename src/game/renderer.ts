import { Player, Particle } from '../types';
import { STAGES } from '../data/stages';
import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE, TILES } from './worldMap';
import { getJumongEvolution } from '../utils/evolution';

interface RenderOptions {
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

export function renderGameWorld({
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
}: RenderOptions) {
  // 0. Base dark background
  ctx.fillStyle = '#090d16';
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

  // 2. Draw Realistic Environment Tiles
  for (let ty = startTileY; ty < endTileY; ty++) {
    for (let tx = startTileX; tx < endTileX; tx++) {
      const tile = map[ty][tx];
      const px = tx * TILE_SIZE;
      const py = ty * TILE_SIZE;
      drawRealisticTile(ctx, tile, px, py, tx, ty, currentStageId, gameTime);
    }
  }

  // 3. Draw Path Breadcrumb Trail (길 안내 가이드 경로)
  drawPathBreadcrumbs(ctx, currentStageId, player, gameTime);

  // 4. Draw Interactive Stage NPCs and Detailed Props
  drawStageNpcCharacters(ctx, currentStageId, gameTime, inRangeOfTarget);

  // 5. Draw Footstep and Spark Particles
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // 6. Draw Player (Jumong) with Evolutionary Appearance
  drawEvolvingJumong(ctx, player, currentStageId, gameTime);

  // 7. Ambient Petals / Golden Pollen / Mountain Leaves
  ambientPetals.forEach(pt => {
    ctx.save();
    ctx.globalAlpha = pt.alpha;
    ctx.fillStyle = currentStageId >= 8 ? '#fde047' : '#fed7aa';
    ctx.beginPath();
    ctx.ellipse(pt.x, pt.y, pt.size * 1.5, pt.size, gameTime * 0.002, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // 8. Active Target Sky Beacon & Pulsing Aura
  drawTargetLightBeacon(ctx, currentStageId, gameTime, inRangeOfTarget);

  ctx.restore(); // Exit camera coordinates

  // 9. Screen Overlay: Directional Navigation Arrow, Road Guidance & Mini Compass
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

// ==========================================
// 1. Realistic Environment Tiles
// ==========================================
function drawRealisticTile(
  ctx: CanvasRenderingContext2D,
  tile: number,
  px: number,
  py: number,
  tx: number,
  ty: number,
  currentStageId: number,
  gameTime: number
) {
  // Deterministic seed for tile variations
  const seed = (tx * 73856093) ^ (ty * 19349663);
  const hash = Math.abs(seed) % 100;

  switch (tile) {
    case TILES.GRASS: {
      // Lush multi-tone grass base
      const isAlt = (tx + ty) % 2 === 0;
      ctx.fillStyle = isAlt ? '#338e4a' : '#2d7d40';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Subtle turf texture
      ctx.fillStyle = '#266c37';
      ctx.fillRect(px + 4, py + 8, 14, 2);
      ctx.fillRect(px + 26, py + 28, 16, 2);

      // Grass blade clumps with wind sway
      const sway = Math.sin(gameTime * 0.003 + tx + ty) * 1.5;
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(px + 12 + sway, py + 16, 2, 6);
      ctx.fillRect(px + 15 + sway * 1.2, py + 14, 2, 8);
      ctx.fillRect(px + 32 - sway, py + 34, 2, 7);

      // Wildflowers (yellow, soft pink, white)
      if (hash < 18) {
        const flowerX = px + 10 + (hash % 28);
        const flowerY = py + 10 + ((hash * 3) % 28);
        const fColor = hash < 7 ? '#fde047' : hash < 13 ? '#f472b6' : '#ffffff';
        ctx.fillStyle = fColor;
        ctx.beginPath();
        ctx.arc(flowerX, flowerY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(flowerX, flowerY, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case TILES.PATH: {
      // Natural packed dirt path
      ctx.fillStyle = '#d97706'; // Warm sandy earth base
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(px, py, TILE_SIZE, 3); // top border shadow
      ctx.fillRect(px, py + TILE_SIZE - 3, TILE_SIZE, 3);

      // Soil texture and small pebbles
      ctx.fillStyle = '#92400e';
      ctx.fillRect(px + 6, py + 12, 18, 3); // cart track rut
      ctx.fillRect(px + 22, py + 32, 20, 3);

      // Scattered pebbles
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(px + 12, py + 22, 2, 0, Math.PI * 2);
      ctx.arc(px + 36, py + 14, 2.5, 0, Math.PI * 2);
      ctx.arc(px + 26, py + 40, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px + 11, py + 21, 1, 1);
      break;
    }

    case TILES.STONE_PATH: {
      // Dressed granite cobblestones
      ctx.fillStyle = '#64748b'; // Darker mortar base
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      const drawPavingStone = (sx: number, sy: number, sw: number, sh: number) => {
        // Stone body
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(sx + 1, sy + 1, sw - 2, sh - 2);
        // Bevel highlight
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(sx + 1, sy + 1, sw - 2, 1);
        ctx.fillRect(sx + 1, sy + 1, 1, sh - 2);
        // Shadow edge
        ctx.fillStyle = '#475569';
        ctx.fillRect(sx + sw - 2, sy + 1, 1, sh - 2);
        ctx.fillRect(sx + 1, sy + sh - 2, sw - 2, 1);
      };

      const half = TILE_SIZE / 2;
      drawPavingStone(px, py, half, half);
      drawPavingStone(px + half, py, half, half);
      drawPavingStone(px, py + half, half, half);
      drawPavingStone(px + half, py + half, half, half);

      // Moss in crevices
      if (hash < 30) {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(px + half - 2, py + 4, 3, 8);
      }
      break;
    }

    case TILES.WATER: {
      // Deep majestic river gradient
      const waveOffset = Math.sin(gameTime * 0.003 + tx * 0.6 + ty * 0.4) * 4;
      const grad = ctx.createLinearGradient(px, py, px, py + TILE_SIZE);
      grad.addColorStop(0, '#0369a1');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Specular waves
      ctx.fillStyle = '#7dd3fc';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(px + 4 + waveOffset, py + 10, 20, 2);
      ctx.fillRect(px + 20 - waveOffset, py + 26, 22, 2);
      ctx.fillRect(px + 10 + waveOffset * 0.8, py + 38, 16, 2);
      ctx.globalAlpha = 1.0;

      // Silvery fish shadows swimming
      if (hash < 12) {
        const fishX = px + 12 + ((gameTime * 0.02 + hash * 5) % (TILE_SIZE + 10)) - 5;
        const fishY = py + 18 + Math.sin(gameTime * 0.005 + hash) * 4;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(fishX, fishY, 5, 2, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case TILES.BRIDGE: {
      if (currentStageId >= 7) {
        // Glorious Turtle & Fish mythical living bridge
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Giant living turtle shell
        const bob = Math.sin(gameTime * 0.005 + tx) * 2;
        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2 + bob, 19, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Turtle shell plates (scutes) with golden ancient pattern
        ctx.fillStyle = '#10b981';
        ctx.fillRect(px + 18, py + 18 + bob, 12, 12);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(px + 22, py + 22 + bob, 4, 4);

        // Swimming flippers
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.ellipse(px + 10, py + 16 + bob, 6, 3, -0.6, 0, Math.PI * 2);
        ctx.ellipse(px + 38, py + 16 + bob, 6, 3, 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Leaping salmon/carp with water splash
        const jumpPhase = Math.sin(gameTime * 0.007 + tx * 2);
        if (jumpPhase > 0.4) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(px + 24, py + 8 - jumpPhase * 8, 7, 3, 0.4, 0, Math.PI * 2);
          ctx.fill();
          // Splash droplets
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(px + 22, py + 12, 2, 2);
          ctx.fillRect(px + 26, py + 13, 2, 2);
        }
      } else {
        // Deep uncrossable water torrent
        ctx.fillStyle = '#075985';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#38bdf8';
        ctx.globalAlpha = 0.7;
        const wave = Math.sin(gameTime * 0.006 + tx) * 6;
        ctx.fillRect(px + 6 + wave, py + 20, 32, 4);
        ctx.globalAlpha = 1.0;
      }
      break;
    }

    case TILES.TREE: {
      // Grass floor under the tree
      ctx.fillStyle = '#266c37';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Cast ground shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(px + 24, py + 42, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ancient Korean Red Pine trunk (소나무 등걸)
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(px + 18, py + 44);
      ctx.quadraticCurveTo(px + 24, py + 28, px + 22, py + 16);
      ctx.lineTo(px + 26, py + 16);
      ctx.quadraticCurveTo(px + 28, py + 28, px + 30, py + 44);
      ctx.closePath();
      ctx.fill();

      // Bark fissures
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px + 22, py + 40);
      ctx.lineTo(px + 25, py + 26);
      ctx.stroke();

      // Multi-tiered Pine Needle clusters (솔잎 층)
      const sway = Math.sin(gameTime * 0.002 + tx * 0.5) * 1.5;

      // Bottom layer
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.arc(px + 16 + sway, py + 24, 14, 0, Math.PI * 2);
      ctx.arc(px + 32 + sway, py + 24, 14, 0, Math.PI * 2);
      ctx.fill();

      // Mid layer
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(px + 24 + sway * 1.2, py + 16, 16, 0, Math.PI * 2);
      ctx.fill();

      // Top highlighted canopy
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(px + 22 + sway * 1.5, py + 12, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case TILES.WALL: {
      // Ancient Goguryeo stone rampart (고구려 산성 석축)
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Staggered stone blocks
      const stoneH = 14;
      for (let row = 0; row < 3; row++) {
        const sy = py + row * 16;
        const offset = row % 2 === 0 ? 0 : 12;

        ctx.fillStyle = '#475569';
        ctx.fillRect(px + offset + 2, sy + 2, 20, stoneH - 2);
        ctx.fillRect(px + offset + 24, sy + 2, 20, stoneH - 2);

        // Highlight
        ctx.fillStyle = '#64748b';
        ctx.fillRect(px + offset + 2, sy + 2, 20, 2);
        ctx.fillRect(px + offset + 24, sy + 2, 20, 2);

        // Mortar lines
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px, sy + stoneH, TILE_SIZE, 2);
      }
      break;
    }

    case TILES.MOUNTAIN: {
      // Rugged Onyeosan cliffs (오녀산성 절벽)
      ctx.fillStyle = '#3f3f46';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Rocky crag peak
      ctx.fillStyle = '#52525b';
      ctx.beginPath();
      ctx.moveTo(px, py + TILE_SIZE);
      ctx.lineTo(px + 14, py + 10);
      ctx.lineTo(px + 28, py + 4);
      ctx.lineTo(px + TILE_SIZE, py + TILE_SIZE);
      ctx.closePath();
      ctx.fill();

      // Sunlit cliff face
      ctx.fillStyle = '#71717a';
      ctx.beginPath();
      ctx.moveTo(px + 14, py + 10);
      ctx.lineTo(px + 28, py + 4);
      ctx.lineTo(px + 36, py + TILE_SIZE);
      ctx.lineTo(px + 20, py + TILE_SIZE);
      ctx.closePath();
      ctx.fill();

      // Cliff foliage bush
      ctx.fillStyle = '#166534';
      ctx.fillRect(px + 20, py + 28, 8, 5);
      break;
    }

    case TILES.FLOOR: {
      // Polished traditional timber plank (대청마루)
      ctx.fillStyle = '#b45309';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Plank planks with wood grain
      const plankH = 12;
      for (let i = 0; i < 4; i++) {
        const y = py + i * plankH;
        ctx.fillStyle = i % 2 === 0 ? '#d97706' : '#c2410c';
        ctx.fillRect(px, y + 1, TILE_SIZE, plankH - 2);

        // Plank joint line
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px, y + plankH - 1, TILE_SIZE, 1);

        // Wooden nail pegs
        ctx.fillStyle = '#451a03';
        ctx.fillRect(px + 4, y + 4, 2, 2);
        ctx.fillRect(px + TILE_SIZE - 6, y + 4, 2, 2);
      }
      break;
    }

    case TILES.CARPET: {
      // Royal crimson carpet with Goguryeo golden motif
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Ornate gold border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);

      // Central gold diamond motif
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(px + TILE_SIZE / 2, py + 10);
      ctx.lineTo(px + TILE_SIZE - 10, py + TILE_SIZE / 2);
      ctx.lineTo(px + TILE_SIZE / 2, py + TILE_SIZE - 10);
      ctx.lineTo(px + 10, py + TILE_SIZE / 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case TILES.FENCE: {
      // Grass underneath
      ctx.fillStyle = '#2d7d40';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Wooden rail fence (목책)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 6, py + 8, 6, 36);
      ctx.fillRect(px + 22, py + 8, 6, 36);
      ctx.fillRect(px + 38, py + 8, 6, 36);
      // Horizontal crossbeams
      ctx.fillRect(px, py + 16, TILE_SIZE, 5);
      ctx.fillRect(px, py + 30, TILE_SIZE, 5);
      // Tops sharpened
      ctx.fillStyle = '#92400e';
      ctx.fillRect(px + 6, py + 6, 6, 2);
      ctx.fillRect(px + 22, py + 6, 6, 2);
      ctx.fillRect(px + 38, py + 6, 6, 2);
      break;
    }

    default: {
      ctx.fillStyle = '#2d7d40';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    }
  }
}

// ==========================================
// 2. Path Breadcrumb Trail (길 안내 가이드 경로)
// ==========================================
function drawPathBreadcrumbs(
  ctx: CanvasRenderingContext2D,
  currentStageId: number,
  player: Player,
  gameTime: number
) {
  const currentStage = STAGES.find(s => s.id === currentStageId);
  if (!currentStage || !currentStage.pathWaypoints) return;

  const points = currentStage.pathWaypoints;
  if (points.length < 2) return;

  ctx.save();

  // Animated flowing golden pulse
  const flowOffset = (gameTime * 0.05) % 24;

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 16]);
  ctx.lineDashOffset = -flowOffset;

  ctx.beginPath();
  // Start from player position to the first waypoint
  ctx.moveTo(player.x + player.width / 2, player.y + player.height / 2);

  points.forEach((wp, idx) => {
    const wx = wp.x * TILE_SIZE + TILE_SIZE / 2;
    const wy = wp.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.lineTo(wx, wy);

    // Glowing waypoint chevron dots
    const pulse = Math.sin(gameTime * 0.008 + idx) * 2;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(wx, wy, 4 + pulse, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

// ==========================================
// 3. Stage NPCs & In-Field Interactive Characters
// ==========================================
function drawStageNpcCharacters(
  ctx: CanvasRenderingContext2D,
  currentStageId: number,
  gameTime: number,
  _inRangeOfTarget: boolean
) {
  STAGES.forEach(stage => {
    const px = stage.targetPos.x * TILE_SIZE;
    const py = stage.targetPos.y * TILE_SIZE;
    const isCurrent = stage.id === currentStageId;
    const isCompleted = stage.id < currentStageId;

    ctx.save();

    // Stage 1: Lady Yuhwa kneeling by the Mystical Golden Egg in Silk Cradle
    if (stage.targetType === 'egg') {
      // Ornate Wooden Altar Cradle
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 6, py + 28, 36, 16);
      ctx.fillStyle = '#dc2626'; // Red silk cushion
      ctx.fillRect(px + 8, py + 22, 32, 8);

      // Glowing Sacred Egg
      const glow = Math.sin(gameTime * 0.006) * 5;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(px + 24, py + 14, 13, 17 + glow * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Egg golden shimmer
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(px + 20, py + 10, 4, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Mother Lady Yuhwa standing gently beside the egg
      drawDetailedLadyYuhwa(ctx, px + 40, py + 20, gameTime);

      drawStageHeaderLabel(ctx, px + 24, py - 16, '1단계: 신비한 알과 유화부인', isCurrent, isCompleted);
    }

    // Stage 2: Archery Range with King Geumwa & Practice Targets
    else if (stage.targetType === 'archery') {
      // 1. Straw Target Dummies (과녁) with real arrows stuck
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 6, py + 12, 4, 32);
      ctx.fillRect(px + 24, py + 12, 4, 32);

      // Target face
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(px + 16, py + 18, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(px + 16, py + 18, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px + 16, py + 18, 5, 0, Math.PI * 2);
      ctx.fill();

      // Arrow struck right in the bullseye
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + 26, py + 10);
      ctx.lineTo(px + 16, py + 18);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 25, py + 8, 4, 3); // arrow fletching

      // 2. King Geumwa in Imperial Yellow Hanbok
      drawDetailedKingGeumwa(ctx, px + 40, py + 18, gameTime);

      drawStageHeaderLabel(ctx, px + 24, py - 16, '2단계: 금와왕과 궁전 활터', isCurrent, isCompleted);
    }

    // Stage 3: Lady Yuhwa in Candlelit Secret Chamber
    else if (stage.targetType === 'yuhwa') {
      // Secret folding screen (병풍)
      ctx.fillStyle = '#fce7f3';
      ctx.fillRect(px + 2, py + 2, 44, 26);
      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 2, py + 2, 44, 26);

      // Glowing Candle Stand
      const flame = Math.sin(gameTime * 0.015) * 2;
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px + 4, py + 26, 4, 14);
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(px + 6, py + 23 + flame, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Lady Yuhwa presenting the secret traveler's scroll
      drawDetailedLadyYuhwa(ctx, px + 24, py + 22, gameTime);

      drawStageHeaderLabel(ctx, px + 24, py - 16, '3단계: 유화부인의 비밀 방', isCurrent, isCompleted);
    }

    // Stage 4: Three Friends at Tavern (오이, 마리, 협보)
    else if (stage.targetType === 'friends') {
      // Tavern table & pottery cups
      ctx.fillStyle = '#92400e';
      ctx.fillRect(px + 12, py + 24, 26, 14);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 6, py + 30, 6, 8); // tavern stool

      // Three distinct heroic companions!
      drawDetailedFriend(ctx, px + 8, py + 16, '#10b981', '오이', 'spear');
      drawDetailedFriend(ctx, px + 24, py + 12, '#3b82f6', '마리', 'bow');
      drawDetailedFriend(ctx, px + 40, py + 16, '#d97706', '협보', 'sword');

      drawStageHeaderLabel(ctx, px + 24, py - 16, '4단계: 오이·마리·협보', isCurrent, isCompleted);
    }

    // Stage 5: Buyeo Cavalry Pursuers with War Horse
    else if (stage.targetType === 'pursuers') {
      // Armored War Horse
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px + 8, py + 22, 28, 16); // body
      ctx.fillRect(px + 30, py + 14, 10, 16); // neck & head
      ctx.fillStyle = '#dc2626'; // horse harness
      ctx.fillRect(px + 12, py + 24, 20, 3);

      // Armored Cavalry Officer with Spear
      drawDetailedPursuerCommander(ctx, px + 20, py + 10, gameTime);

      drawStageHeaderLabel(ctx, px + 24, py - 16, '5단계: 부여 기마 추격대', isCurrent, isCompleted);
    }

    // Stage 6: Eomho River Shore Shrine & Roaring Waters
    else if (stage.targetType === 'river_sign') {
      // Wooden Signpost & Ritual stone
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 20, py + 14, 8, 30);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(px + 4, py + 6, 40, 20);
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 4, py + 6, 40, 20);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('엄호수 나루터', px + 24, py + 19);

      // Water swirls
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px + 36, py + 34, 6, 0, Math.PI * 2);
      ctx.fill();

      drawStageHeaderLabel(ctx, px + 24, py - 16, '6단계: 엄호수 강가 (천손 선포)', isCurrent, isCompleted);
    }

    // Stage 7: Giant Turtles & Leaping Salmon Bridge
    else if (stage.targetType === 'turtle_bridge') {
      // Massive ancient turtle mother
      const bob = Math.sin(gameTime * 0.005) * 3;
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.ellipse(px + 24, py + 24 + bob, 20, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.ellipse(px + 40, py + 24 + bob, 7, 6, 0, 0, Math.PI * 2); // turtle head
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 42, py + 22 + bob, 2, 2); // eye

      // Shell golden hex rune
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px + 18, py + 18 + bob, 12, 12);

      drawStageHeaderLabel(ctx, px + 24, py - 16, '7단계: 어하자교 (자라 다리)', isCurrent, isCompleted);
    }

    // Stage 8: Lady Soseono & Jolbon Merchant Caravan
    else if (stage.targetType === 'soseono') {
      // Jolbon Silk trade chest
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(px + 4, py + 26, 14, 12);
      ctx.fillStyle = '#fbbf24'; // Gold lock
      ctx.fillRect(px + 10, py + 30, 3, 4);

      // Lady Soseono in royal violet and gold dress
      drawDetailedSoseono(ctx, px + 28, py + 18, gameTime);

      drawStageHeaderLabel(ctx, px + 24, py - 16, '8단계: 소서노와의 동맹', isCurrent, isCompleted);
    }

    // Stage 9: Onyeosan Fortress Gatekeeper & Battlements
    else if (stage.targetType === 'fortress') {
      // Fortress ramparts
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + 4, py + 4, 40, 40);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 12, py + 14, 24, 30); // arched gate

      // Stone fortress defender in iron armor
      drawDetailedFortressGuard(ctx, px + 36, py + 18, gameTime);

      drawStageHeaderLabel(ctx, px + 24, py - 16, '9단계: 졸본 산성 요새', isCurrent, isCompleted);
    }

    // Stage 10: Grand Founding Altar & Three-Legged Crow (삼족오) Flag
    else if (stage.targetType === 'altar') {
      // High stone ceremonial platform
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 4, py + 14, 40, 30);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 2, py + 10, 44, 6);

      // Three-Legged Crow Sun Banner (삼족오 깃발) fluttering
      const flagWave = Math.sin(gameTime * 0.008) * 4;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 22, py - 20, 3, 34); // flagpole
      ctx.fillStyle = '#dc2626'; // crimson banner
      ctx.beginPath();
      ctx.moveTo(px + 25, py - 20);
      ctx.lineTo(px + 46 + flagWave, py - 14);
      ctx.lineTo(px + 43 + flagWave, py - 2);
      ctx.lineTo(px + 25, py - 6);
      ctx.closePath();
      ctx.fill();

      // Golden Sun Disk with Three-Legged Crow
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(px + 33 + flagWave * 0.5, py - 11, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Holy bronze braziers with burning fire
      const fire = Math.sin(gameTime * 0.015) * 3;
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(px + 8, py + 10 + fire, 6, 0, Math.PI * 2);
      ctx.arc(px + 40, py + 10 - fire, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(px + 8, py + 8 + fire, 3, 0, Math.PI * 2);
      ctx.arc(px + 40, py + 8 - fire, 3, 0, Math.PI * 2);
      ctx.fill();

      // High Priest in white ritual robes
      drawDetailedPriest(ctx, px + 24, py + 22, gameTime);

      drawStageHeaderLabel(ctx, px + 24, py - 24, '10단계: 고구려 건국 제단', isCurrent, isCompleted);
    }

    ctx.restore();
  });
}

// Stage Title Badge
function drawStageHeaderLabel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  text: string,
  isCurrent: boolean,
  isCompleted: boolean
) {
  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';

  const textW = ctx.measureText(text).width + 16;
  const h = 20;

  if (isCurrent) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
  } else if (isCompleted) {
    ctx.fillStyle = 'rgba(6, 78, 59, 0.9)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.2;
  } else {
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
  }

  ctx.beginPath();
  ctx.roundRect(cx - textW / 2, cy - h / 2, textW, h, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isCurrent ? '#fde047' : isCompleted ? '#6ee7b7' : '#94a3b8';
  ctx.fillText(text, cx, cy + 4);
  ctx.restore();
}

// Detailed NPC Drawings
function drawDetailedLadyYuhwa(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  gameTime: number
) {
  const sway = Math.sin(gameTime * 0.003) * 1;
  // Silk skirt
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(cx - 9, cy + 16);
  ctx.lineTo(cx, cy - 2);
  ctx.lineTo(cx + 9, cy + 16);
  ctx.closePath();
  ctx.fill();

  // White silk sash
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - 7, cy + 2, 14, 3);

  // Head & graceful hairdo
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(cx + sway, cy - 7, 7, 0, Math.PI * 2);
  ctx.fill();

  // Hair & Jade hairpin (비녀)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(cx + sway, cy - 10, 7, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#10b981'; // jade
  ctx.fillRect(cx - 8 + sway, cy - 11, 16, 2);
}

function drawDetailedKingGeumwa(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  _gameTime: number
) {
  // Imperial Yellow Royal Robe (황포)
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy + 16);
  ctx.lineTo(cx, cy - 4);
  ctx.lineTo(cx + 10, cy + 16);
  ctx.closePath();
  ctx.fill();

  // Red royal collar
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(cx - 6, cy - 3, 12, 4);

  // Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Golden Royal Crown with beads
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cx - 7, cy - 16, 14, 5);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(cx - 2, cy - 19, 4, 3);
}

function drawDetailedFriend(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color: string,
  _name: string,
  weapon: 'spear' | 'bow' | 'sword'
) {
  // Body tunic
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy + 14);
  ctx.lineTo(cx, cy - 3);
  ctx.lineTo(cx + 8, cy + 14);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(cx, cy - 7, 6.5, 0, Math.PI * 2);
  ctx.fill();

  // Headband
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(cx - 7, cy - 11, 14, 3);

  // Weapon
  if (weapon === 'spear') {
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 9, cy + 14);
    ctx.lineTo(cx - 9, cy - 16);
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - 11, cy - 20, 4, 6);
  } else if (weapon === 'bow') {
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + 8, cy, 8, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx + 8, cy - 4, 3, 16);
  }
}

function drawDetailedPursuerCommander(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  _gameTime: number
) {
  // Black iron armor
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cx - 8, cy - 6, 16, 16);
  ctx.fillStyle = '#dc2626'; // red cape
  ctx.fillRect(cx - 10, cy - 4, 4, 16);

  // Helm
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(cx, cy - 10, 7, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#ef4444'; // plume
  ctx.fillRect(cx - 2, cy - 16, 4, 5);

  // Spear
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy + 14);
  ctx.lineTo(cx - 12, cy - 18);
  ctx.stroke();
}

function drawDetailedSoseono(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  _gameTime: number
) {
  // Royal purple & lavender silk gown
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy + 16);
  ctx.lineTo(cx, cy - 4);
  ctx.lineTo(cx + 10, cy + 16);
  ctx.closePath();
  ctx.fill();

  // Gold sash
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(cx - 8, cy + 2, 16, 3);

  // Head & noble hairdo
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Hair with golden comb
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(cx, cy - 11, 7.5, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cx - 6, cy - 14, 12, 3);
}

function drawDetailedFortressGuard(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  _gameTime: number
) {
  // Scale armor
  ctx.fillStyle = '#334155';
  ctx.fillRect(cx - 8, cy - 4, 16, 18);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(cx - 6, cy - 2, 12, 14);

  // Iron helmet
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cx, cy - 9, 7, Math.PI, 0);
  ctx.fill();
}

function drawDetailedPriest(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  _gameTime: number
) {
  // White ritual robe
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy + 16);
  ctx.lineTo(cx, cy - 4);
  ctx.lineTo(cx + 10, cy + 16);
  ctx.closePath();
  ctx.fill();

  // Red ceremonial sash
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cx - 8, cy + 3, 16, 3);

  // Head & Ritual Hat
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(cx - 6, cy - 16, 12, 7);
}

// ==========================================
// 4. Jumong Evolutionary Appearance (5단계 진화)
// ==========================================
function drawEvolvingJumong(
  ctx: CanvasRenderingContext2D,
  player: Player,
  stageId: number,
  gameTime: number
) {
  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;
  const evo = getJumongEvolution(stageId);

  ctx.save();

  // 1. Shadow on the ground
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 16, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walking bobbing animation
  const bob = player.isMoving ? Math.sin(gameTime * 0.016) * 2.5 : 0;
  const walkLeg = player.isMoving ? Math.sin(gameTime * 0.018) * 4 : 0;

  // 2. Divine aura for Level 5 (태조 동명성왕) or Level 3~4
  if (evo.level >= 5) {
    const auraPulse = Math.sin(gameTime * 0.008) * 4;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4 + bob, 22 + auraPulse, 26 + auraPulse, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Floating golden sparks
    for (let i = 0; i < 3; i++) {
      const sparkAngle = gameTime * 0.004 + (i * Math.PI * 2) / 3;
      const sx = cx + Math.cos(sparkAngle) * 20;
      const sy = cy + Math.sin(sparkAngle) * 16 + bob;
      ctx.fillStyle = '#fde047';
      ctx.fillRect(sx - 1.5, sy - 1.5, 3, 3);
    }
  } else if (evo.level >= 3) {
    // Subtle warrior glow
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 6 + bob, 18, 22, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Legs / Boots
  ctx.fillStyle = evo.level >= 4 ? '#0f172a' : '#451a03';
  if (player.dir === 'left' || player.dir === 'right') {
    ctx.fillRect(cx - 5 + walkLeg, cy + 10, 4, 8);
    ctx.fillRect(cx + 1 - walkLeg, cy + 10, 4, 8);
  } else {
    ctx.fillRect(cx - 6, cy + 10 + walkLeg, 5, 7);
    ctx.fillRect(cx + 1, cy + 10 - walkLeg, 5, 7);
  }

  // 4. Robe & Armor based on Evolution Level
  if (evo.level === 1) {
    // Level 1: Young boy Jumong in simple sky-blue linen hanbok
    ctx.fillStyle = '#38bdf8'; // sky blue
    ctx.fillRect(cx - 7, cy - 2 + bob, 14, 13);
    ctx.fillStyle = '#ffffff'; // white collar
    ctx.fillRect(cx - 3, cy - 3 + bob, 6, 4);
    ctx.fillStyle = '#ef4444'; // red cloth sash
    ctx.fillRect(cx - 7, cy + 5 + bob, 14, 2);

    // Small training wooden bow
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx - 5, cy + bob, 7, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.stroke();
  } else if (evo.level === 2) {
    // Level 2: Skilled young archer Jumong in deep navy coat & leather bracers
    ctx.fillStyle = '#1e3a8a'; // navy coat
    ctx.fillRect(cx - 8, cy - 3 + bob, 16, 14);
    ctx.fillStyle = '#b45309'; // leather bracers
    ctx.fillRect(cx - 9, cy + 1 + bob, 3, 5);
    ctx.fillRect(cx + 6, cy + 1 + bob, 3, 5);
    ctx.fillStyle = '#dc2626'; // red sash
    ctx.fillRect(cx - 8, cy + 4 + bob, 16, 3);

    // Horn composite bow (각궁)
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx - 7, cy + bob, 9, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.stroke();
  } else if (evo.level === 3) {
    // Level 3: Iron lamellar warrior Jumong with red cape
    // Fluttering red cape behind
    const capeFlutter = Math.sin(gameTime * 0.01) * 3;
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 2 + bob);
    ctx.lineTo(cx - 12 + capeFlutter, cy + 14 + bob);
    ctx.lineTo(cx + 12 - capeFlutter, cy + 14 + bob);
    ctx.lineTo(cx + 8, cy - 2 + bob);
    ctx.closePath();
    ctx.fill();

    // Iron lamellar scale armor (철갑 비늘)
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx - 8, cy - 3 + bob, 16, 14);
    // Bronze scale rivets
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(cx - 5, cy + bob, 3, 3);
    ctx.fillRect(cx + 2, cy + bob, 3, 3);
    ctx.fillRect(cx - 5, cy + 5 + bob, 3, 3);
    ctx.fillRect(cx + 2, cy + 5 + bob, 3, 3);

    // Horn bow
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx - 7, cy + bob, 9, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.stroke();
  } else if (evo.level === 4) {
    // Level 4: Commander Jumong with gold-trimmed armor and sword
    // Royal red cape
    const capeFlutter = Math.sin(gameTime * 0.012) * 4;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(cx - 9, cy - 3 + bob);
    ctx.lineTo(cx - 14 + capeFlutter, cy + 16 + bob);
    ctx.lineTo(cx + 14 - capeFlutter, cy + 16 + bob);
    ctx.lineTo(cx + 9, cy - 3 + bob);
    ctx.closePath();
    ctx.fill();

    // Black & Gold Armor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 8, cy - 3 + bob, 16, 15);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 8, cy - 3 + bob, 16, 15);

    // Sword (환두대도) at hip
    ctx.fillStyle = '#eab308';
    ctx.fillRect(cx + 7, cy + 2 + bob, 4, 4); // pommel ring
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx + 8, cy + 6 + bob, 2, 9); // scabbard
  } else {
    // Level 5: King Dongmyeongseongwang in Imperial Regalia
    // Flowing royal crimson & imperial gold cape
    const capeFlutter = Math.sin(gameTime * 0.015) * 4;
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy - 4 + bob);
    ctx.lineTo(cx - 16 + capeFlutter, cy + 18 + bob);
    ctx.lineTo(cx + 16 - capeFlutter, cy + 18 + bob);
    ctx.lineTo(cx + 10, cy - 4 + bob);
    ctx.closePath();
    ctx.fill();

    // Golden Dragon Robe (용포)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx - 9, cy - 4 + bob, 18, 16);

    // Golden chest emblem (삼족오/태양 문양)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx, cy + 3 + bob, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Royal gold belt
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(cx - 9, cy + 7 + bob, 18, 3);
  }

  // 5. Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(cx, cy - 8 + bob, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Face / Eyes
  ctx.fillStyle = '#0f172a';
  if (player.dir === 'down') {
    ctx.fillRect(cx - 3, cy - 9 + bob, 2, 2);
    ctx.fillRect(cx + 2, cy - 9 + bob, 2, 2);
  } else if (player.dir === 'left') {
    ctx.fillRect(cx - 5, cy - 9 + bob, 2, 2);
  } else if (player.dir === 'right') {
    ctx.fillRect(cx + 3, cy - 9 + bob, 2, 2);
  }

  // 6. Headdress Evolution
  if (evo.level === 1) {
    // Simple red cloth ribbon headband
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx - 8, cy - 13 + bob, 16, 3);
  } else if (evo.level === 2) {
    // Headband with twin small feathers
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 8, cy - 14 + bob, 16, 3.5);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 14 + bob);
    ctx.lineTo(cx - 7, cy - 21 + bob);
    ctx.lineTo(cx - 2, cy - 14 + bob);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 2, cy - 14 + bob);
    ctx.lineTo(cx + 5, cy - 21 + bob);
    ctx.lineTo(cx + 4, cy - 14 + bob);
    ctx.fill();
  } else if (evo.level === 3 || evo.level === 4) {
    // Official Goguryeo Feathered Cap (조우관 / 절풍) with bronze clip
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(cx - 8, cy - 15 + bob, 16, 4.5);
    ctx.fillStyle = '#f59e0b'; // bronze clip
    ctx.fillRect(cx - 2, cy - 15 + bob, 4, 3);

    // Twin elegant feathers
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 15 + bob);
    ctx.lineTo(cx - 9, cy - 26 + bob);
    ctx.lineTo(cx - 2, cy - 15 + bob);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 2, cy - 15 + bob);
    ctx.lineTo(cx + 7, cy - 26 + bob);
    ctx.lineTo(cx + 4, cy - 15 + bob);
    ctx.fill();
  } else {
    // Level 5: Golden Emperor Feather Crown (황금 조우관) with curved jade beads!
    ctx.fillStyle = '#fbbf24'; // pure gold crown band
    ctx.fillRect(cx - 9, cy - 16 + bob, 18, 5);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(cx - 3, cy - 19 + bob, 6, 4);

    // Golden Bird Feathers
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy - 16 + bob);
    ctx.lineTo(cx - 11, cy - 29 + bob);
    ctx.lineTo(cx - 2, cy - 16 + bob);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 3, cy - 16 + bob);
    ctx.lineTo(cx + 9, cy - 29 + bob);
    ctx.lineTo(cx + 5, cy - 16 + bob);
    ctx.fill();

    // Green Jade Pendant (곡옥) hanging
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(cx - 8, cy - 10 + bob, 2, 0, Math.PI * 2);
    ctx.arc(cx + 8, cy - 10 + bob, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Character Name Tag over player
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(cx - 22, cy - 38 + bob, 44, 15);
  ctx.strokeStyle = evo.accentColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - 22, cy - 38 + bob, 44, 15);

  ctx.fillStyle = '#fef08a';
  ctx.fillText(evo.title, cx, cy - 27 + bob);

  ctx.restore();
}

// ==========================================
// 5. Active Target Light Beacon
// ==========================================
function drawTargetLightBeacon(
  ctx: CanvasRenderingContext2D,
  currentStageId: number,
  gameTime: number,
  inRangeOfTarget: boolean
) {
  const currentStage = STAGES.find(s => s.id === currentStageId);
  if (!currentStage) return;

  const targetPx = currentStage.targetPos.x * TILE_SIZE + TILE_SIZE / 2;
  const targetPy = currentStage.targetPos.y * TILE_SIZE + TILE_SIZE / 2;

  ctx.save();

  // Vertical radiant beam of light from the heavens
  const beamGrad = ctx.createLinearGradient(targetPx, targetPy - 200, targetPx, targetPy);
  beamGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
  beamGrad.addColorStop(1, 'rgba(251, 191, 36, 0.35)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(targetPx - 16, targetPy - 200, 32, 200);

  // Ground glowing rings
  const pulse = Math.sin(gameTime * 0.007) * 7;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(targetPx, targetPy + 16, 28 + pulse, 13 + pulse * 0.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Floating Bouncing Quest Marker / Speech Balloon
  const bounce = Math.sin(gameTime * 0.009) * 6;
  const markY = targetPy - 42 + bounce;

  // Background speech circle
  ctx.fillStyle = inRangeOfTarget ? '#10b981' : '#f59e0b';
  ctx.beginPath();
  ctx.arc(targetPx, markY, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(inRangeOfTarget ? '💬' : '!', targetPx, markY + 5);

  // Interaction prompt if in range
  if (inRangeOfTarget) {
    const tooltipText = `${currentStage.npcName}와 대화하기 [E]`;
    ctx.font = 'bold 12px sans-serif';
    const textW = ctx.measureText(tooltipText).width + 20;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(targetPx - textW / 2, markY - 32, textW, 24, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(tooltipText, targetPx, markY - 16);
  }

  ctx.restore();
}

// ==========================================
// 6. Screen Navigation HUD & Highway Guide Arrow
// ==========================================
function drawScreenNavigationHud(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  camX: number,
  camY: number,
  player: Player,
  currentStageId: number,
  gameTime: number
) {
  const currentStage = STAGES.find(s => s.id === currentStageId);
  if (!currentStage) return;

  const targetWorldX = currentStage.targetPos.x * TILE_SIZE + TILE_SIZE / 2;
  const targetWorldY = currentStage.targetPos.y * TILE_SIZE + TILE_SIZE / 2;

  const targetScreenX = targetWorldX - camX;
  const targetScreenY = targetWorldY - camY;

  const dx = targetWorldX - (player.x + player.width / 2);
  const dy = targetWorldY - (player.y + player.height / 2);
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const meters = Math.max(1, Math.round(distance / 20));

  ctx.save();

  // 1. Navigation Banner at Top Right
  const bannerW = Math.min(320, canvasWidth - 32);
  const bannerH = 68;
  const bannerX = canvasWidth - bannerW - 14;
  const bannerY = 14;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 12);
  ctx.fill();
  ctx.stroke();

  // Rotating compass arrow
  ctx.save();
  ctx.translate(bannerX + 24, bannerY + bannerH / 2);
  ctx.rotate(angle);
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(14, 0);
  ctx.lineTo(-8, -8);
  ctx.lineTo(-3, 0);
  ctx.lineTo(-8, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Text inside navigation banner
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`목표: ${currentStage.title}`, bannerX + 46, bannerY + 20);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(`남은 거리: 약 ${meters}m (${Math.round(distance)}px)`, bannerX + 46, bannerY + 36);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '10px sans-serif';
  ctx.fillText(currentStage.navHint, bannerX + 46, bannerY + 54);

  // 2. Off-screen Pulsing Edge Indicator Arrow
  const margin = 48;
  const isOffScreen =
    targetScreenX < margin ||
    targetScreenX > canvasWidth - margin ||
    targetScreenY < margin ||
    targetScreenY > canvasHeight - margin;

  if (isOffScreen) {
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    const angleFromCenter = Math.atan2(targetScreenY - cy, targetScreenX - cx);

    const arrowX = Math.max(
      margin,
      Math.min(canvasWidth - margin, cx + Math.cos(angleFromCenter) * (canvasWidth / 2 - margin))
    );
    const arrowY = Math.max(
      margin,
      Math.min(canvasHeight - margin, cy + Math.sin(angleFromCenter) * (canvasHeight / 2 - margin))
    );

    const pulse = Math.sin(gameTime * 0.012) * 4;

    ctx.save();
    ctx.translate(arrowX, arrowY);
    ctx.rotate(angleFromCenter);

    // Arrow body
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(18 + pulse, 0);
    ctx.lineTo(-10, -12);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-10, 12);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // Distance tag under offscreen arrow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(arrowX - 22, arrowY + 16, 44, 16);
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${meters}m`, arrowX, arrowY + 28);
  }

  ctx.restore();
}
