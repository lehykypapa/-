export const TILE_SIZE = 48;
export const MAP_WIDTH = 64;
export const MAP_HEIGHT = 56;

// Tile types
export const TILES = {
  GRASS: 0,
  PATH: 1,
  WATER: 2,
  WALL: 3,
  TREE: 4,
  BRIDGE: 5,
  FLOOR: 6,
  MOUNTAIN: 7,
  FENCE: 8,
  CARPET: 9,
  STONE_PATH: 10,
} as const;

export type TileType = typeof TILES[keyof typeof TILES];

// Generate world tilemap
export function generateMap(): number[][] {
  const map: number[][] = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      // Map borders
      if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        row.push(TILES.TREE);
        continue;
      }

      // 1. Great Eomho River (엄호수) across the middle (y: 31 to 35)
      if (y >= 31 && y <= 35) {
        // Turtle & Fish bridge at x: 29, 30
        if (x === 29 || x === 30) {
          row.push(TILES.BRIDGE);
        } else {
          row.push(TILES.WATER);
        }
        continue;
      }

      // 2. Buyeo Palace Courtyard (Top Left: x: 3..25, y: 3..18)
      if (x >= 4 && x <= 24 && y >= 3 && y <= 18) {
        // Palace main hall walls
        if ((y === 4 && x >= 5 && x <= 17) || (y === 12 && x >= 5 && x <= 17)) {
          if (x === 11) {
            row.push(TILES.FLOOR); // Palace door
          } else {
            row.push(TILES.WALL);
          }
          continue;
        }
        if ((x === 5 || x === 17) && y >= 4 && y <= 12) {
          row.push(TILES.WALL);
          continue;
        }
        // Palace interior floor
        if (x > 5 && x < 17 && y > 4 && y < 12) {
          if (x >= 9 && x <= 13) {
            row.push(TILES.CARPET);
          } else {
            row.push(TILES.FLOOR);
          }
          continue;
        }

        // Archery range ground (x: 19..24, y: 5..12)
        if (x >= 19 && x <= 24 && y >= 5 && y <= 12) {
          if (y === 5 || y === 12) {
            row.push(TILES.FENCE);
          } else {
            row.push(TILES.PATH);
          }
          continue;
        }

        // Secret room for Lady Yuhwa (x: 7..13, y: 14..18)
        if (y === 14 && x >= 7 && x <= 13) {
          if (x === 10) row.push(TILES.FLOOR);
          else row.push(TILES.WALL);
          continue;
        }
        if (y === 18 && x >= 7 && x <= 13) {
          row.push(TILES.WALL);
          continue;
        }
        if ((x === 7 || x === 13) && y >= 14 && y <= 18) {
          row.push(TILES.WALL);
          continue;
        }
        if (x > 7 && x < 13 && y > 14 && y < 18) {
          row.push(TILES.FLOOR);
          continue;
        }
      }

      // 3. Buyeo Market & Tavern (x: 27..42, y: 8..22)
      // Path connecting Palace to Market
      if (y === 13 && x >= 11 && x <= 40) {
        row.push(TILES.PATH);
        continue;
      }
      if (x === 30 && y >= 13 && y <= 31) {
        row.push(TILES.PATH);
        continue;
      }

      // 4. Forest trail for Escape route (x: 35..56, y: 16..29)
      if (
        (y === 18 && x >= 40 && x <= 52) ||
        (x === 52 && y >= 18 && y <= 26) ||
        (y === 26 && x >= 30 && x <= 52)
      ) {
        row.push(TILES.STONE_PATH);
        continue;
      }

      // Scatter natural trees and rocks along the frontier
      if (
        x >= 43 &&
        x <= 58 &&
        y >= 12 &&
        y <= 28 &&
        (x * 7 + y * 13) % 7 === 0 &&
        row[row.length - 1] !== TILES.STONE_PATH
      ) {
        row.push(TILES.TREE);
        continue;
      }

      // 5. Southern Area: Jolbon Village (x: 6..28, y: 38..52)
      // Village pathway
      if ((y === 42 && x >= 12 && x <= 30) || (x === 18 && y >= 36 && y <= 50)) {
        row.push(TILES.PATH);
        continue;
      }
      // Village houses & fences
      if (
        (x >= 8 && x <= 14 && y >= 39 && y <= 41) ||
        (x >= 8 && x <= 14 && y >= 45 && y <= 47) ||
        (x >= 22 && x <= 26 && y >= 45 && y <= 47)
      ) {
        if (x === 11 && y === 41) row.push(TILES.PATH);
        else if (x === 11 && y === 47) row.push(TILES.PATH);
        else row.push(TILES.FENCE);
        continue;
      }

      // 6. Southern East: Onyeosanseong Mountain Fortress & Altar (x: 34..60, y: 38..53)
      // Mountain cliffs forming natural rampart
      if (
        (x === 36 && y >= 38 && y <= 52 && y !== 46 && y !== 47) ||
        (x === 58 && y >= 38 && y <= 52) ||
        (y === 38 && x >= 36 && x <= 58) ||
        (y === 52 && x >= 36 && x <= 58)
      ) {
        row.push(TILES.MOUNTAIN);
        continue;
      }

      // Fortress Wall at entrance (x: 38, y: 44..49)
      if (x === 38 && y >= 44 && y <= 49) {
        if (y === 46 || y === 47) {
          row.push(TILES.STONE_PATH); // Fortress gate
        } else {
          row.push(TILES.WALL);
        }
        continue;
      }

      // Stone path to Grand Altar
      if (y === 46 && x >= 30 && x <= 52) {
        row.push(TILES.STONE_PATH);
        continue;
      }

      // Grand Altar platform (x: 48..53, y: 44..48)
      if (x >= 48 && x <= 53 && y >= 44 && y <= 48) {
        if (x === 48 || x === 53 || y === 44 || y === 48) {
          row.push(TILES.WALL);
        } else {
          row.push(TILES.CARPET);
        }
        continue;
      }

      // Default grass with subtle random trees
      if ((x * 11 + y * 19) % 23 === 0 && x > 2 && y > 2 && x < MAP_WIDTH - 2 && y < MAP_HEIGHT - 2) {
        row.push(TILES.TREE);
      } else {
        row.push(TILES.GRASS);
      }
    }
    map.push(row);
  }

  return map;
}

export function isTileSolid(
  tileX: number,
  tileY: number,
  map: number[][],
  currentStageId: number
): boolean {
  if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) {
    return true;
  }

  const tile = map[tileY][tileX];

  // Water is impassable unless it is the mythical bridge AND stage >= 7
  if (tile === TILES.WATER) {
    return true;
  }
  if (tile === TILES.BRIDGE) {
    // Unlocked in stage 7 and later!
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
