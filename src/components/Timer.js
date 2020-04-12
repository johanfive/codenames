import React, { useState, useEffect, useCallback } from 'react';


const flexEven = { display: 'flex', justifyContent: 'space-evenly' };

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
      border: '1px solid lightgray',
      margin: '1rem',
      padding: '.5rem',
      width: '8rem',
      height: '3rem',
      flexDirection: 'column',
      ...flexEven
    }}>
      <div style={flexEven}>
        <button onClick={increase}>+</button>
        {displayTime(time)}
        <button onClick={decrease}>-</button>
      </div>
      <div style={flexEven}>
        <button onClick={handlePlayPause}>
          {run ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};
