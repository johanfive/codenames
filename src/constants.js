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
};

export const defaultPlayer = { isCaptain: false, team: NEUTRAL };

export const colors = {
  [teams.A]: '#00539f',
  [teams.B]: '#d5003a',
  [NEUTRAL]: '#999999'
};

export const teamNames = {
  [teams.A]: 'Team that goes 1st',
  [teams.B]: 'The other team...?',
  [NEUTRAL]: 'Audience'
};
