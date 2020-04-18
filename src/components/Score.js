import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { teams, scoreToWin, colors } from '../constants';
import TeamName from './TeamName';
import Timer from './Timer';


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
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      width: '41rem',
      border: '1px solid #999999',
      padding: '1rem'
    }}>
      <div style={{ width: '14rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <TeamName gameId={gameId} team={teams.A} />
        <div><span style={{ color: score.teamA > 0 ? colors[teams.A] : '', fontWeight: 'bolder' }}>{score.teamA}</span> / {scoreToWin[teams.A]}</div>
      </div>
      <Timer />
      <div style={{ width: '14rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <TeamName gameId={gameId} team={teams.B} />
        <div><span style={{ color: score.teamB > 0 ? colors[teams.B] : '', fontWeight: 'bolder' }}>{score.teamB}</span> / {scoreToWin[teams.B]}</div>
      </div>
    </div>
  );
};