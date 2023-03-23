export const SQUARE = 3;
export const SQUARE_SIZE = 100;
export const DRAW = 0;
export const PLAYER_X = 1;
export const PLAYER_O = 2;

export const GAME_STATES = {
  notStarted: "ot_started",
  inProgress: "in_progress",
  over: "over",
};

// record is one of typescript utility types

export const SCORES: Record<string, number> = {
  1: 1,
  0: 0,
  2: -1,
}

export const GAME_MODES:Record<string, string> = {
  easy: 'easy',
  medium: 'medium',
  difficult: 'difficult',
};