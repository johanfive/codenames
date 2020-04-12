import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import TeamName from './TeamName';
import { arraysOfSameValues } from '../helpers/data';


export default ({ gameId, currentTeam, teamToJoin }) => {
  const [ teamMembers, setTeamMembers ] = useState([]);
  const user = auth().currentUser;
  const gameRef = db.ref(`/activeGames/${gameId}`);
  const teamMembersRef = gameRef.child(`/${teamToJoin}/members`);

  const join = () => {
    const updates = {};
    updates[`/users/${user.uid}/team`] = teamToJoin;
    updates[`/${currentTeam}/members/${user.uid}`] = null;
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

  return (
    <div style={{ border: '1px solid black', padding: '1rem', margin: '.5rem' }}>
      <TeamName gameId={gameId} team={teamToJoin} />
      <ul>
        {teamMembers.map((member, i) => <li key={i}>{member}</li>)}
      </ul>
      {currentTeam !== teamToJoin && <button onClick={join}>+ Join</button>}
    </div>
  );
};
