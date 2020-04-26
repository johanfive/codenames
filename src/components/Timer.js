import React, { useState, useEffect, useCallback } from 'react';


const displayTime = (millis) => {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = (millis - (minutes * 60 * 1000)) / 1000;
  const theEnd = (!minutes && !displaySeconds) ? '¯\\_(ツ)_/¯' : '';
  return theEnd
    ? theEnd
    : minutes + ':' + (displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds);
};

export default () => {
  const DEFAULT = 3 * 60 * 1000;
  const [time, setTime] = useState(DEFAULT);
  const [ run, setRun ] = useState(false);

  const reset = useCallback(() => {
    if (run) {
      setRun(false);
    }
    setTime(DEFAULT);
  }, [DEFAULT, run]);

  useEffect(() => {
    if (run) {
      const intervalId = setInterval(() => {
        if (time > 0) {
          setTime(time - 1000);
        } else {
          reset();
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [time, run, reset]);

  const handlePlayPause = () => {
    if (run) {
      setRun(false);
    } else {
      setRun(true);
    }
  };
  const increase = () => setTime(time + (60 * 1000));
  const decrease = () => {
    const newTime = time - (60 * 1000);
    if (newTime > 0) {
      setTime(time - (60 * 1000));
    }
  };
  return (
    <div style={{ 
      margin: '1rem',
      padding: '.5rem',
      width: '20rem',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    }}>
      <button onClick={reset}>Reset</button>
      <button onClick={decrease}>-</button>
      {displayTime(time)}
      <button onClick={increase}>+</button>
      <button onClick={handlePlayPause}>
        {run ? 'Pause' : 'Start'}
      </button>
    </div>
  );
};
