import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import TeamName from './TeamName';
import SpyDibs from './SpyDibs';
import { arraysOfSameValues } from '../helpers/data';


export default ({ gameId, player, teamToJoin }) => {
  const [ teamMembers, setTeamMembers ] = useState([]);
  const user = auth().currentUser;
  const gameRef = db.ref(`/activeGames/${gameId}`);
  const teamMembersRef = gameRef.child(`/${teamToJoin}/members`);

  const join = () => {
    const updates = {};
    updates[`/users/${user.uid}/team`] = teamToJoin;
    updates[`/${player.team}/members/${user.uid}`] = null;
    updates[`/${teamToJoin}/members/${user.uid}`] = user.displayName;
    gameRef.update(updates);
  };

  useEffect(() => {
    teamMembersRef.on('value', snap => {
      if (snap.exists()) {
        const members = [];
        snap.forEach(memberSnap => {
          members.push(memberSnap.val());
        });
        if (!arraysOfSameValues(teamMembers, members)) {
          setTeamMembers(members);
        }
      } else {
        if (teamMembers.length > 0) {
          setTeamMembers([]);
        }
      }
    });
    return () => teamMembersRef.off();
  }, [teamMembersRef, teamMembers]);

  const selfStyle = member => user.displayName === member ? { border: '1px solid lightgray' } : {};
  return (
    <div style={{ border: '1px solid #999999', padding: '1rem', margin: '.5rem', minWidth: '11.3rem', textAlign: 'center' }}>
      <TeamName gameId={gameId} team={teamToJoin} />
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {teamMembers.map((member, i) => <li key={i} style={selfStyle(member)} >{member}</li>)}
      </ul>
      {(player.team !== teamToJoin && !player.isMaster)
        ? <button className="join" onClick={join}>Join</button>
        : <SpyDibs gameId={gameId} player={player} />}
    </div>
  );
};
