/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { arraysOfSameValues } from '../helpers/data';
import { userJoinsTeam } from '../dbStuff/setters';
import { NEUTRAL, scoreToWin, teamNames, colors, teams } from '../constants';
import Captain from './Captain';


const buttonStyle = team => ({
  backgroundColor: colors[team],
  borderRadius: '1rem',
  color: 'white',
  letterSpacing: '1px',
  margin: '1rem auto',
  padding: '.5rem 1.5rem'
});

const TeamColor = ({team, text}) => <span style={{ color: colors[team] }}>{text}</span>;


const Team = ({ team, gameId, player, score }) => {
  const [ teamMembers, setTeamMembers ] = useState({});
  const teamRef = db.ref(`/activeGames/${gameId}/${team}`);
  const user = auth().currentUser;

  useEffect(() => {
    const teamPlayersRef = teamRef.child('members');
    const handleMembersChange = snap => {
      const currentMembersIds = Object.keys(teamMembers);
      if (snap.exists()) {
        const newList = snap.val();
        if (!arraysOfSameValues(Object.keys(newList), currentMembersIds)) {
          setTeamMembers(newList);
        }
      } else if (currentMembersIds.length > 0) {
        setTeamMembers({});
      }
    };
    teamPlayersRef.on('value', handleMembersChange);
    return () => teamPlayersRef.off('value', handleMembersChange);
  }, [teamRef, teamMembers]);

  const joinTeam = () => userJoinsTeam(gameId, team, player.team);
  let joinButtonText = player.team === NEUTRAL ? 'Join ranks' : 'Betray';
  if (team === NEUTRAL && player.team !== NEUTRAL) {
    joinButtonText = 'Chicken out';
  }

  const canJoin = !player.isCaptain && (player.team !== team);
  const isSelf = playerKey => playerKey === user.uid;
  return (
    <div style={{
      overflow: 'auto',
      padding: '2rem 1rem 0',
      textAlign: `${team === teams.B ? 'left' : 'right'}`,
      width: '16rem'
    }}>
      {team !== NEUTRAL && (
        <div className="score">
          <TeamColor team={team} text={score} /> / {scoreToWin[team]}
        </div>
      )}
      <div style={{ fontSize: '1.2rem', fontWeight: 'bolder' }}><TeamColor team={team} text={teamNames[team]} /></div>
      {team !== NEUTRAL && <Captain gameId={gameId} team={team} player={player} />}
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {Object.keys(teamMembers).map((playerKey, i) =>
          <li key={i} className={isSelf(playerKey) ? `self-${team}` : ''}>
            {teamMembers[playerKey]}
          </li>
        )}
      </ul>
      {canJoin && <button style={buttonStyle(team)} onClick={joinTeam}>{joinButtonText}</button>}
    </div>
  );
};

export default Team;
