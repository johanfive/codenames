import words from './words';
import { teams, scoreToWin, ASSASSIN, UNFLIPPED, NEUTRAL } from '../constants';


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

export const shuffleTiles = (tilesCount) => {
  const tiles = [];
  const assassinId = getRandomInt(tilesCount); // ass placed differently because it would almost always be on the 1st row otherwise
  const toDistribute = {
    values: [teams.A, teams.B, NEUTRAL], // these guys have similar enough odds that this strategy makes sense
    [teams.A]: scoreToWin[teams.A],
    [teams.B]: scoreToWin[teams.B],
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

export const arraysOfSameValues = (arrA, arrB) => {
  if (!Array.isArray(arrA) || ! Array.isArray(arrB) || arrA.length !== arrB.length) {
    return false;
  }
  const arr1 = arrA.concat().sort();
  const arr2 = arrB.concat().sort();
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
