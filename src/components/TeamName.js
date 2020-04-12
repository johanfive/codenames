import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';


export default ({ gameId, team }) => {
  const [teamName, setTeamName ] = useState('loading...');
  const [ isSpymaster, setIsSpyMaster] = useState(false);

  const user = auth().currentUser;
  const gameRef = db.ref(`/activeGames/${gameId}`);
  const teamNameRef = gameRef.child(`/${team}/name`);
  const isMasterRef = gameRef.child(`users/${user.uid}/isMaster`);

  const handleChange = e => {
    const valid = /^(?!\s.*$).*/;
    const newName = e.target.value;
    if (newName && valid.test(newName)) {
      teamNameRef.set(newName);
    }
  };

  useEffect(() => {
    isMasterRef.once('value')
      .then(snap => setIsSpyMaster(snap.val()))
      .catch(e => console.error(e.message));
  }, [gameId, team, isMasterRef]);

  useEffect(() => {
    const handleSnap = snap => setTeamName(snap.val());
    teamNameRef.on('value', handleSnap);
    return () => teamNameRef.off('value', handleSnap);
  });

  return isSpymaster
    ? <input value={teamName} onChange={handleChange} style={{ fontSize: 'inherit' }} />
    : <span>{teamName}</span>;
};
