export interface StageOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface DialogueLine {
  speaker: string;
  speakerRole: string;
  speakerAvatarColor: string;
  text: string;
  isJumong?: boolean;
}

export interface StoryTransition {
  title: string;
  subtitle: string;
  backgroundKnowledge: string;
  animationType:
    | 'egg_hatching'
    | 'archery_contest'
    | 'escape_palace'
    | 'friends_oath'
    | 'cavalry_pursuit'
    | 'river_crying'
    | 'turtle_bridge_rising'
    | 'soseono_alliance'
    | 'mountain_fortress'
    | 'altar_coronation';
  quote: string;
  historicalMeaning: string;
}

export interface StageData {
  id: number;
  stageNumber: number;
  location: string;
  title: string;
  subtitle: string;
  npcName: string;
  npcRole: string;
  npcAvatarColor: string;
  story: string;
  dialogueScript: DialogueLine[];
  question: string;
  options: StageOption[];
  historyLesson: string;
  targetPos: { x: number; y: number }; // Tile coordinates
  navHint: string;
  pathWaypoints?: Array<{ x: number; y: number }>;
  transition: StoryTransition;
  targetType:
    | 'egg'
    | 'archery'
    | 'yuhwa'
    | 'friends'
    | 'pursuers'
    | 'river_sign'
    | 'turtle_bridge'
    | 'soseono'
    | 'fortress'
    | 'altar';
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Player {
  x: number; // World pixel X
  y: number; // World pixel Y
  width: number;
  height: number;
  speed: number;
  dir: Direction;
  isMoving: boolean;
  frame: number;
  stepTimer: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  gravity?: number;
}

