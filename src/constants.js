export const teams = {
  A: 'teamA',
  B: 'teamB'
};

export const ASSASSIN = 'assassin';
export const NEUTRAL = 'neutral';
export const UNFLIPPED = 'unflipped';

export const scoreToWin = {
  [teams.A]: 9,
  [teams.B]: 8
}

export const actionTypes = {
  FLIP: 'flip',
  RESET: 'reset',
  TOGGLE_SPY: 'toggleSpy'
};
