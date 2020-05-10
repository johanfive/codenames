/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { NEUTRAL, colors, scoreToWin, teamNames, teams } from '../../constants';
import { onTeamMembers } from './listeners';
import { auth } from '../../services/firebase';
import { userJoinsTeam } from '../../dbStuff/setters';
import Captain from '../Captain';


const Team = ({ gameId, team, player, score }) => {
  const [ teamMembers, setTeamMembers ] = useState({});

  useEffect(
    () => onTeamMembers(gameId, team, teamMembers, setTeamMembers),
    [gameId, team, teamMembers]
  );

  const joinTeam = () => userJoinsTeam(gameId, team, player.team);

  const canJoin = player.team !== team && !player.isCaptain;
  let joinButtonText = player.team === NEUTRAL ? 'Join ranks' : 'Betray';
  if (team === NEUTRAL && player.team !== NEUTRAL) {
    joinButtonText = 'Chicken out';
  }
  const highlightSelf = id => id === auth().currentUser.uid;
  const withTeamColor = { color: colors[team] };
  const notNeutral = team !== NEUTRAL;

  return (
    <div style={{
      overflow: 'auto',
      padding: '2rem 1rem 0',
      textAlign: `${team === teams.B ? 'left' : 'right'}`,
      width: '16rem'
    }}>
      {notNeutral && (
        <div className="score">
          <span style={withTeamColor}>{score}</span> / {scoreToWin[team]}
        </div>
      )}
      <div style={{ fontSize: '1.2rem', fontWeight: 'bolder', ...withTeamColor }}>
        {teamNames[team]}
      </div>
      {notNeutral && <Captain gameId={gameId} team={team} player={player} />}
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {Object.keys(teamMembers).map((memberId, i) =>
          <li key={i} className={highlightSelf(memberId) ? `self-${team}` : ''}>
            {teamMembers[memberId]}
          </li>
        )}
      </ul>
      {canJoin &&
        <button onClick={joinTeam} style={{ backgroundColor: colors[team], padding: '.5rem 1.5rem' }}>
          {joinButtonText}
        </button>
      }
    </div>
  );
};

export default Team;
