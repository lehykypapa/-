import { MAP_HEIGHT, MAP_WIDTH, TILES } from './worldMap';

// Generate Gojoseon world tilemap
export function generateGojoseonMap(): number[][] {
  const map: number[][] = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      // Map borders
      if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        row.push(TILES.TREE);
        continue;
      }

      // 1. Heavenly Realm of Hwanin (Zone 1: Top, x: 4..30, y: 3..14)
      if (x >= 4 && x <= 26 && y >= 3 && y <= 14) {
        // Heavenly Palace Walls
        if ((y === 3 && x >= 5 && x <= 25) || (y === 14 && x >= 5 && x <= 25)) {
          if (x === 12 || x === 13) {
            row.push(TILES.FLOOR); // Palace gates
          } else {
            row.push(TILES.WALL);
          }
          continue;
        }
        if ((x === 5 || x === 25) && y >= 3 && y <= 14) {
          row.push(TILES.WALL);
          continue;
        }
        // Palace interior
        if (x > 5 && x < 25 && y > 3 && y < 14) {
          // Golden Carpet for Hwanin Throne
          if (x >= 10 && x <= 14 && y >= 6 && y <= 12) {
            row.push(TILES.CARPET);
          } else if (x >= 18 && x <= 22 && y >= 6 && y <= 10) {
            row.push(TILES.CARPET); // Heavenly Treasury carpet
          } else {
            row.push(TILES.FLOOR);
          }
          continue;
        }
      }

      // Clouds separating Heaven and Earth (y: 15..17)
      if (y >= 15 && y <= 17) {
        // Rainbow stair path at x: 12..14
        if (x >= 12 && x <= 14) {
          row.push(TILES.STONE_PATH);
        } else if (x % 3 === 0) {
          row.push(TILES.FLOOR); // Soft cloud puffs
        } else {
          row.push(TILES.GRASS);
        }
        continue;
      }

      // 2. Sinsi at the Summit of Mount Taebaek (Zone 2: x: 6..28, y: 18..32)
      // Path connecting Stair to Sindansu
      if (x === 13 && y >= 17 && y <= 24) {
        row.push(TILES.STONE_PATH);
        continue;
      }
      // Sinsi Main Square & Sindansu platform (x: 10..26, y: 20..28)
      if (x >= 10 && x <= 26 && y >= 20 && y <= 28) {
        if (y === 24 && x >= 11 && x <= 25) {
          row.push(TILES.STONE_PATH);
          continue;
        }
        if (x >= 12 && x <= 16 && y >= 22 && y <= 26) {
          row.push(TILES.CARPET); // Sacred Tree Grove carpet
          continue;
        }
        row.push(TILES.PATH);
        continue;
      }

      // Path connecting Sinsi to Mountain Cave (x: 26..38, y: 22..24)
      if (y === 24 && x >= 25 && x <= 38) {
        row.push(TILES.PATH);
        continue;
      }

      // 3. Mount Taebaek Cave of Trials (Zone 3: x: 38..58, y: 16..30)
      // Natural Rocky Mountain Cliffs enclosing the Cave
      if (
        (x === 40 && y >= 18 && y <= 26 && y !== 22) ||
        (x === 56 && y >= 18 && y <= 26) ||
        (y === 18 && x >= 40 && x <= 56) ||
        (y === 26 && x >= 40 && x <= 56)
      ) {
        row.push(TILES.MOUNTAIN);
        continue;
      }

      // Cave entrance at x: 40, y: 22
      if (x === 40 && y === 22) {
        row.push(TILES.STONE_PATH);
        continue;
      }

      // Inside Cave Floor
      if (x > 40 && x < 56 && y > 18 && y < 26) {
        if (x >= 48 && x <= 53 && y >= 20 && y <= 24) {
          row.push(TILES.CARPET); // Ungnyeo holy spring
        } else {
          row.push(TILES.FLOOR);
        }
        continue;
      }

      // Surrounding mountains for the Cave region
      if (
        (x >= 38 && x <= 58 && y >= 16 && y <= 30) &&
        ((x * 13 + y * 7) % 5 === 0)
      ) {
        row.push(TILES.MOUNTAIN);
        continue;
      }

      // Great Daedong River (대동강) dividing Sinsi and Asadal (y: 33..36)
      if (y >= 33 && y <= 36) {
        // Holy stone bridge crossing at x: 17..19 and x: 30..32
        if ((x >= 17 && x <= 19) || (x >= 30 && x <= 32)) {
          row.push(TILES.BRIDGE);
        } else {
          row.push(TILES.WATER);
        }
        continue;
      }

      // 4. Founding Altar, Asadal Capital & Chamseongdan (Zone 4: South, y: 37..55, x: 6..58)
      // Path from Bridge to Altar
      if ((x === 17 || x === 18) && y >= 36 && y <= 44) {
        row.push(TILES.STONE_PATH);
        continue;
      }

      // Main East-West Highway connecting all southern sites
      if ((y === 43 || y === 44) && x >= 16 && x <= 52) {
        row.push(TILES.STONE_PATH);
        continue;
      }

      // Ceremonial North-South Avenue connecting Asadal & Highway to Chamseongdan Altar
      if (x >= 49 && x <= 51 && y >= 44 && y <= 48) {
        row.push(TILES.STONE_PATH);
        continue;
      }

      // Southern connector avenue between Asadal south gate and Chamseongdan
      if (x >= 45 && x <= 51 && (y === 46 || y === 47)) {
        row.push(TILES.STONE_PATH);
        continue;
      }

      // Ungnyeo Prayer Sanctuary (x: 15..21, y: 37..41)
      if (x >= 16 && x <= 20 && y >= 37 && y <= 40) {
        row.push(TILES.CARPET);
        continue;
      }

      // Gojoseon Founding Altar Platform (Stage 8: x: 29..35, y: 41..47)
      if (x >= 29 && x <= 35 && y >= 41 && y <= 47) {
        // Gates on West, East, North, South
        const isGate =
          ((x === 29 || x === 35) && (y === 43 || y === 44)) ||
          ((y === 41 || y === 47) && (x >= 31 && x <= 33));

        if (isGate) {
          row.push(TILES.STONE_PATH);
        } else if (x === 29 || x === 35 || y === 41 || y === 47) {
          row.push(TILES.WALL);
        } else {
          row.push(TILES.CARPET);
        }
        continue;
      }

      // Asadal Palace & Houses (Stage 9: x: 43..49, y: 41..47)
      if (x >= 43 && x <= 49 && y >= 41 && y <= 47) {
        // Gates on West, East, North, South so player can easily enter and exit
        const isGate =
          ((x === 43 || x === 49) && (y === 43 || y === 44)) ||
          ((y === 41 || y === 47) && (x >= 45 && x <= 47));

        if (isGate) {
          row.push(TILES.STONE_PATH);
        } else if (x === 43 || x === 49 || y === 41 || y === 47) {
          row.push(TILES.FENCE);
        } else {
          row.push(TILES.FLOOR);
        }
        continue;
      }

      // Chamseongdan Grand Altar (Stage 10: x: 47..54, y: 48..53)
      if (x >= 47 && x <= 54 && y >= 48 && y <= 53) {
        // Grand North Gate from road, plus West Gate and South Gate
        const isGrandNorthGate = y === 48 && (x >= 49 && x <= 52);
        const isWestGate = x === 47 && (y === 50 || y === 51);
        const isSouthGate = y === 53 && (x >= 50 && x <= 51);

        if (isGrandNorthGate || isWestGate || isSouthGate) {
          row.push(TILES.STONE_PATH);
        } else if (x === 47 || x === 54 || y === 48 || y === 53) {
          row.push(TILES.WALL);
        } else if (x >= 49 && x <= 52 && y >= 49 && y <= 52) {
          row.push(TILES.CARPET); // Sacred Altar Carpet around (50, 50)
        } else {
          row.push(TILES.FLOOR);
        }
        continue;
      }

      // Clear space around Asadal and Chamseongdan - NO random trees here
      const isAsadalChamsengdanZone = x >= 42 && x <= 56 && y >= 40 && y <= 55;

      // Default grass with ancient dolmens / trees
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

export function isGojoseonTileSolid(
  tileX: number,
  tileY: number,
  map: number[][],
  currentStageId: number
): boolean {
  if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) {
    return true;
  }

  const tile = map[tileY][tileX];

  // Water is impassable
  if (tile === TILES.WATER) {
    return true;
  }

  // Heavenly stair/bridge unlocks
  if (tile === TILES.BRIDGE) {
    // Unlocked in stage 7+
    return currentStageId < 7;
  }

  if (
    tile === TILES.WALL ||
    tile === TILES.TREE ||
    tile === TILES.MOUNTAIN ||
    tile === TILES.FENCE
  ) {
    return true;
  }

  return false;
}
