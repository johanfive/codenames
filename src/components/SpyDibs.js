import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { NEUTRAL } from '../constants';


export default ({ gameId, player }) => {
  const [ teamMaster, setTeamMaster ] = useState(null);
  const user = auth().currentUser;
  const gameRef = db.ref(`/activeGames/${gameId}`);
  const teamMasterRef = gameRef.child(`/${player.team}/spyMaster`);
  const userIsMasterRef = gameRef.child(`/users/${user.uid}/isMaster`);

  const handleClick = (e) => {
    e.preventDefault();
    if (window.confirm('Once you\'re it, you cannot change your mind. You sure?')) {
      teamMasterRef.transaction(currentMaster => {
        if (!currentMaster) {
          return user.uid;
        }
        return;
      })
        .then((transactionResult) => {
          if (transactionResult.committed) {
            userIsMasterRef.set(true);
          }
        })
        .catch(e => console.error(e.message));
    }
  };

  useEffect(() => {
    teamMasterRef.on('value', snap => {
      if (snap.exists()) {
        const master = snap.val();
        if (master) {
          setTeamMaster(snap.val())
        }
      } else {
        if (teamMaster) {
          setTeamMaster(null);
        }
      }
    });
    return () => teamMasterRef.off();
  }, [teamMasterRef, gameId, player, teamMaster]);

  const showSpyDibs = player.team !== NEUTRAL && !player.isMaster && !teamMaster;

  return showSpyDibs ? <button onClick={handleClick}>Call me Master</button> : null;
};
