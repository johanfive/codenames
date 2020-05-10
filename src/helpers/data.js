import words from './words';
import { teams, scoreToWin, MINE, UNFLIPPED, NEUTRAL } from '../constants';


const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const contains = (val, values) => {
  for (let i = 0; i < values.length; i++) {
    if (val === values[i]) {
      return true;
    }
  }
  return false;
};

const getUnselectedRandom = (selection, max) => {
  const i = getRandomInt(max);
  if (contains(i, selection)) {
    return getUnselectedRandom(selection, max);
  }
  return i;
};

export const shuffleTiles = (tilesCount) => {
  const tiles = [];
  const mineId = getRandomInt(tilesCount); // ass placed differently because it would almost always be on the 1st row otherwise
  const toDistribute = {
    [NEUTRAL]: 7,
    [teams.A]: scoreToWin[teams.A],
    [teams.B]: scoreToWin[teams.B],
    values: [teams.A, teams.B, NEUTRAL] // these guys have similar enough odds that this strategy makes sense
  };
  for (let i = 0; i < tilesCount; i++) {
    const wordIndex = getUnselectedRandom(tiles.map(tile => tile.id), words.length);
    const tileValue = i === mineId
      ? MINE
      : toDistribute.values[getRandomInt(toDistribute.values.length)];
    if (toDistribute[tileValue] > 0) {
      toDistribute[tileValue]--;
    }
    if (toDistribute[tileValue] === 0) {
      toDistribute.values = toDistribute.values.filter(val => val !== tileValue);
    }
    tiles.push({ id: wordIndex, value: tileValue, word: words[wordIndex] });
  }
  return tiles.map(tile => ({ color: UNFLIPPED, value: tile.value, word: tile.word }));
};

export const equalObj = (a, b) => {
  if ((a && !b) || (!a && b)) {
    return false;
  }
  if (typeof a !== typeof b) {
    return false;
  } else if (typeof a === 'object' && a !== null) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    for (let i = 0; i < aKeys.length; i++) {
      const aKey = aKeys[i];
      const aVal = a[aKey];
      const bKey = bKeys[i];
      const bVal = b[bKey];
      if (aKey !== bKey || !equalObj(aVal, bVal)) {
        return false;
      }
    }
  } else if (a !== b) {
    return false;
  }
  return true;
};

const minuitStamp = dateObj => {
  dateObj.setHours(0);
  dateObj.setMinutes(0);
  dateObj.setSeconds(0);
  dateObj.setMilliseconds(0);
  return dateObj.getTime();
};

const get2daysAgo = () => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  return minuitStamp(twoDaysAgo);
};

export const getToday = () => {
  return minuitStamp(new Date());
};

export const before2daysAgo = ts => {
  return ts < get2daysAgo();
};
