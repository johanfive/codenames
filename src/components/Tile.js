import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { teams, ASSASSIN, UNFLIPPED, NEUTRAL } from '../constants';


const tileInit = { color: UNFLIPPED, value: null, word: 'loading...' };

export default ({ id, gameId, player }) => {
  const [ state, setState] = useState(tileInit);
  const { color, value, word } = state;
  const { team, isMaster } = player;

  useEffect(() => {
    const tileRef = db.ref(`/activeGames/${gameId}/tiles/${id}`);
    tileRef.on('value', (snap) => {
      setState(snap.val());
    });
    return () => tileRef.off();
  }, [gameId, id]);

  const handleClick = () => {
    if (color === UNFLIPPED && team !== NEUTRAL) {
      const clickersTeam = team === teams.A ? teams.A : teams.B;
      const opposingTeam = clickersTeam === teams.A ? teams.B : teams.A;
      const clickersLose = value === ASSASSIN;
      const tileRef = db.ref(`/activeGames/${gameId}/tiles/${id}`);
      tileRef.child('/color').set(value)
        .then(() => {
          if (clickersLose) {
            console.log(opposingTeam + ' wins!'); // TODO
          }
        })
        .catch(e => {
          console.error(`An error occurred when trying to flip tile "${id}": ${e.message} Try again`);
        });
    }
  };

  const flipped = color === value;
  const spyClass = flipped ? 'spy' : value;
  return (
    <div
      className={`tile ${color} ${isMaster ? spyClass : ''}`}
      onClick={() => handleClick()}
    >
      {word}
    </div>
  );
};
