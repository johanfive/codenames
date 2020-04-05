import words from './words';
import { teams, ASSASSIN, UNFLIPPED, NEUTRAL, actionTypes } from './constants';

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const contains = (val, values) => {
  for (let i = 0; i < values.length; i++) {
    if (val === values[i]) {
      return true;
    }
  }
  return false;
}

const getUnselectedRandom = (selection, max) => {
  const i = getRandomInt(max);
  if (contains(i, selection)) {
    return getUnselectedRandom(selection, max);
  }
  return i;
}

const shuffleTiles = (tilesCount) => {
  const tiles = [];
  const assassinId = getRandomInt(tilesCount); // ass placed differently because it would almost always be on the 1st row otherwise
  const toDistribute = {
    values: [teams.A, teams.B, NEUTRAL], // these guys have similar enough odds that this strategy makes sense
    [teams.A]: 9,
    [teams.B]: 8,
    [NEUTRAL]: 7
  };
  for (let i = 0; i < tilesCount; i++) {
    const wordIndex = getUnselectedRandom(tiles.map(tile => tile.id), words.length);
    const tileValue = i === assassinId
      ? ASSASSIN
      : toDistribute.values[getRandomInt(toDistribute.values.length)];
    if (toDistribute[tileValue] > 0) {
      toDistribute[tileValue]--;
    }
    if (toDistribute[tileValue] === 0) {
      toDistribute.values = toDistribute.values.filter(val => val !== tileValue);
    }
    tiles.push({ id: wordIndex , word: words[wordIndex], value: tileValue });
  }
  return tiles.map(tile => ({ word: tile.word, value: tile.value, color: UNFLIPPED }));
};


const reset = () => ({
  tiles: shuffleTiles(25),
  teamAscore: 0,
  teamBscore: 0,
  spy: false
});
export const initialState = reset();

export default (state, action) => {
  switch (action.type) {
    case actionTypes.FLIP:
      const flippedTile = { ...state.tiles[action.id] };
      flippedTile.color = flippedTile.value;
      let newState = {
        ...state,
        tiles: state.tiles.slice(0, action.id),
      };
      newState.tiles.push(flippedTile);
      newState.tiles = newState.tiles.concat(state.tiles.slice(action.id + 1));
      if (flippedTile.color === teams.A) {
        newState.teamAscore = state.teamAscore + 1;
      }
      if (flippedTile.color === teams.B) {
        newState.teamBscore = state.teamBscore + 1;
      }
      if (flippedTile.color === ASSASSIN) {
        newState.tiles = state.tiles.map(tile => ({ ...tile, color: tile.value }));
      }
      return newState;
    case actionTypes.RESET:
      return reset();
    case actionTypes.TOGGLE_SPY:
      return { ...state, spy: !state.spy };
    default:
      return state;
  }
};
