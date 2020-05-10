import { getTimerRef, getETA } from './utils';

export const resetTimer = (gameId) => getTimerRef(gameId).transaction(() => null);

export const timerStartPause = (gameId, time) => {
  getTimerRef(gameId).transaction(current => {
    const timer = current || {};
    if (!current) {
      // start
      timer.end = getETA(time);
      timer.run = true;
    } else {
      const isPaused = !timer.run;
      if (isPaused) {
        // restart
        timer.end = getETA(timer.pausedAt);
        timer.run = true;
        timer.pausedAt = null;
      } else {
        // pause
        timer.run = null;
        timer.pausedAt = time;
      }
    }
    return timer;
  });
};

export const increaseTime1min = (gameId, time) => {
  // always override, regardless of current state of the timer
  getTimerRef(gameId).transaction(() => {
    const diff = time + (60 * 1000);
    const end = getETA(diff);
    return {
      end,
      pausedAt: diff,
      run: null
    };
  });
};

export const decreaseTime1min = (gameId, time) => {
  // if valid eta, override regardless of current state of the timer
  // if not, return undefined which resets the timer
  getTimerRef(gameId).transaction(() => {
    const diff = time - (60 * 1000);
    const end = getETA(diff);
    if (end > 0) {
      return {
        end,
        pausedAt: diff,
        run: null
      };
    }
  });
};
