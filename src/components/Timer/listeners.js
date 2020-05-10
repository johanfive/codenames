import { getTimerRef } from './utils';


export const onTimerStartStop = (gameId, setState) => {
  const handleRun = snap => {
    if (snap.exists()) {
      setState(true);
    } else {
      setState(false);
    }
  };
  const timerRef = getTimerRef(gameId);
  timerRef.child('run').on('value', handleRun);
  return () => timerRef.off('value', handleRun);
};

export const onTimerETA = (gameId, setState) => {
  const handleEnd = snap => {
    if (snap.exists()) {
      setState(snap.val());
    } else {
      setState(null);
    }
  };
  const timerRef = getTimerRef(gameId);
  timerRef.child('end').on('value', handleEnd);
  return () => timerRef.off('value', handleEnd);
};
