import words from './words';

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

const shuffleTiles = () => {
  const tiles = [];
  const assassinId = getRandomInt(25); // ass placed differently because it would almost always be on the 1st row otherwise
  const toDistribute = {
    values: ['teamA', 'teamB', 'neutral'], // these guys have similar enough odds that this strategy makes sense
    'teamA': 9,
    'teamB': 8,
    'neutral': 7
  };
  for (let i = 0; i < 25; i++) {
    const wordIndex = getUnselectedRandom(tiles.map(tile => tile.id), words.length);
    const tileValue = i === assassinId
      ? 'assassin'
      : toDistribute.values[getRandomInt(toDistribute.values.length)];
    if (toDistribute[tileValue] > 0) {
      toDistribute[tileValue]--;
    }
    if (toDistribute[tileValue] === 0) {
      toDistribute.values = toDistribute.values.filter(val => val !== tileValue);
    }
    tiles.push({ id: wordIndex , word: words[wordIndex], value: tileValue });
  }
  return tiles.map(tile => ({ word: tile.word, value: tile.value, color: 'unflipped' }));
};


const reset = () => ({
  tiles: shuffleTiles(),
  teamAscore: 0,
  teamBscore: 0,
  spy: false
});
export const initialState = reset();

export default (state, action) => {
  switch (action.type) {
    case 'flip':
      const flippedTile = { ...state.tiles[action.id] };
      flippedTile.color = flippedTile.value;
      let newState = {
        ...state,
        tiles: state.tiles.slice(0, action.id),
      };
      newState.tiles.push(flippedTile);
      newState.tiles = newState.tiles.concat(state.tiles.slice(action.id + 1));
      if (flippedTile.color === 'teamA') {
        newState.teamAscore = state.teamAscore + 1;
      }
      if (flippedTile.color === 'teamB') {
        newState.teamBscore = state.teamBscore + 1;
      }
      if (flippedTile.color === 'assassin') {
        newState.tiles = state.tiles.map(tile => ({ ...tile, color: tile.value }));
      }
      return newState;
    case 'reset':
      return reset();
    case 'toggleSpy':
      return { ...state, spy: !state.spy };
    default:
      return state;
  }
};
