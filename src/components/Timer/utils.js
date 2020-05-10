import { db } from '../../services/firebase';


export const getTimerRef = gameId => db.ref(`/activeGames/${gameId}/timer`);

export const getNow = () => Math.floor(Date.now() / 1000) * 1000;

export const getETA = diff => getNow() + diff;

export const displayTime = (millis) => {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = (millis - (minutes * 60 * 1000)) / 1000;
  const theEnd = (!minutes && !displaySeconds) ? '¯\\_(ツ)_/¯' : '';
  return theEnd
    ? theEnd
    : minutes + ':' + (displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds);
};
