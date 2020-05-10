/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { onTimerStartStop, onTimerETA } from './listeners';
import { timerStartPause, increaseTime1min, decreaseTime1min, resetTimer } from './setters';
import { displayTime, getNow } from './utils';


const Timer = ({ gameId }) => {
  const DEFAULT = 3 * 60 * 1000;
  const [ time, setTime ] = useState(DEFAULT);
  const [ run, setRun ] = useState(false);
  const [ end, setEnd ] = useState(null);

  const reset = useCallback(() => resetTimer(gameId), [gameId]);
  const handleStartPause = () => timerStartPause(gameId, time);
  const handleIncrease = () => increaseTime1min(gameId, time);
  const handleDecrease = () => decreaseTime1min(gameId, time);

  useEffect(() => onTimerStartStop(gameId, setRun), [gameId]);
  useEffect(() => onTimerETA(gameId, setEnd), [gameId]);

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
      <button onClick={handleDecrease}>-</button>
      {displayTime(time)}
      <button onClick={handleIncrease}>+</button>
      <button onClick={handleStartPause}>
        {run ? 'pause' : 'start'}
      </button>
    </div>
  );
};

export default Timer;
