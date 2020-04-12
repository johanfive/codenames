import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { teams, scoreToWin } from '../constants';
import TeamName from './TeamName';


export default ({ gameId }) => {
  const [ score, setScore ] = useState({ [teams.A]: 0, [teams.B]: 0 });
  useEffect(() => {
    const tilesRef = db.ref(`/activeGames/${gameId}/tiles`);
    tilesRef.on('value', snap => {
      let teamAPoints = 0;
      let teamBPoints = 0;
      snap.forEach(childSnap => {
        const { color } = childSnap.val();
        if (color === teams.A) {
          teamAPoints++;
        }
        if (color === teams.B) {
          teamBPoints++;
        }
      });
      setScore({ [teams.A]: teamAPoints, [teams.B]: teamBPoints });
    });
    return () => tilesRef.off();
  }, [gameId]);
  return (
    <div>
      <TeamName gameId={gameId} team={teams.A} />: {score.teamA} / {scoreToWin[teams.A]}
      &nbsp;|&nbsp; 
      <TeamName gameId={gameId} team={teams.B} />: {score.teamB} / {scoreToWin[teams.B]}
    </div>
  );
};