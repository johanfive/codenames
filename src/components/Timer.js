/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';


const getNow = () => Math.floor(Date.now() / 1000) * 1000;
const getETA = diff => getNow() + diff;

const displayTime = (millis) => {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = (millis - (minutes * 60 * 1000)) / 1000;
  const theEnd = (!minutes && !displaySeconds) ? '¯\\_(ツ)_/¯' : '';
  return theEnd
    ? theEnd
    : minutes + ':' + (displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds);
};

const getTimerRef = gameId => db.ref(`/activeGames/${gameId}/timer`);

const Timer = ({ gameId }) => {
  const DEFAULT = 3 * 60 * 1000;
  const [ time, setTime ] = useState(DEFAULT);
  const [ run, setRun ] = useState(false);
  const [ end, setEnd ] = useState(null);

  const reset = useCallback(() => getTimerRef(gameId).transaction(() => null), [gameId]);

  const handlePlayPause = () => {
    const timerRef = getTimerRef(gameId);
    timerRef.transaction(current => {
      const timer = current || {};
      if (!current) {
        timer.end = getETA(time);
        timer.run = true;
      } else {
        const isPaused = !timer.run;
        if (isPaused) {
          timer.end = getETA(timer.pausedAt);
          timer.run = true;
          timer.pausedAt = null;
        } else {
          timer.run = null;
          timer.pausedAt = time;
        }
      }
      return timer;
    });
  };

  const increase = () => {
    const timerRef = getTimerRef(gameId);
    timerRef.transaction(() => {
      // always override, regardless of current state of the timer
      const diff = time + (60 * 1000);
      const end = getETA(diff);
      return {
        end: end,
        pausedAt: diff,
        run: null
      };
    });
  };

  const decrease = () => {
    const timerRef = getTimerRef(gameId);
    timerRef.transaction(() => {
      // if valid eta, override regardless of current state of the timer
      // if not, return undefined which resets the timer
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

  useEffect(() => {
    const handleRun = snap => {
      if (snap.exists()) {
        setRun(true);
      } else {
        setRun(false);
      }
    };
    const timerRef = getTimerRef(gameId);
    timerRef.child('run').on('value', handleRun);
    return () => timerRef.off('value', handleRun);
  }, [gameId]);

  useEffect(() => {
    const handleEnd = snap => {
      if (snap.exists()) {
        setEnd(snap.val());
      } else {
        setEnd(null);
      }
    };
    const timerRef = getTimerRef(gameId);
    timerRef.child('end').on('value', handleEnd);
    return () => timerRef.off('value', handleEnd);
  }, [gameId, end]);

  useEffect(() => {
    if (end) {
      const diff = end - getNow();
      if (diff <= 0) {
        reset();
      } else {
        setTime(diff);
      }
    } else {
      setTime(DEFAULT);
    }
  }, [end, DEFAULT, reset]);

  useEffect(() => {
    const countDown = () => {
      const diff = end - getNow();
      if (diff >= 0) {
        setTime(diff);
      } else {
        setRun(false); // run can be true on the server and false on the client
      }
    };
    if (run && end) {
      const interval = setInterval(countDown, 1000);
      return () => clearInterval(interval);
    }
  }, [run, end]);

  return (
    <div style={{
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-evenly',
      margin: '1rem',
      padding: '.5rem',
      width: '20rem'
    }}>
      <button onClick={reset}>Reset</button>
      <button onClick={decrease}>-</button>
      {displayTime(time)}
      <button onClick={increase}>+</button>
      <button onClick={handlePlayPause}>
        start
      </button>
    </div>
  );
};

export default Timer;
