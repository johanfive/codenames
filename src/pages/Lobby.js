import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { shuffleTiles } from '../helpers/data';
import { teams, NEUTRAL } from '../constants';


export default () => {
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ joinId, setJoinId ] = useState('');
  
  const history = useHistory();
  const joinGame = gameId => history.push(`/game/${gameId}`);

  const handleChange = e => setJoinId(e.target.value);

  const handleClick = () => {
    const user = auth().currentUser;
    const gameRef = db.ref(`activeGames/${joinId}`);
    const playersRef = gameRef.child(`/users`);
    playersRef.once('value')
      .then(snap => {
        if (snap.exists()) {
          let isNewPlayer = true;
          snap.forEach(playerSnap => {
            if (playerSnap.key === user.uid) {
              isNewPlayer = false;
            }
          });
          if (isNewPlayer) {
            const updates = {};
            updates[`/${NEUTRAL}/members/${user.uid}`] = user.displayName || 'Cap Annonymous';
            updates[`/users/${user.uid}`] = { displayName: user.displayName, isMaster: false, team: NEUTRAL };
            gameRef.update(updates)
              .then(() => joinGame(joinId));
          } else {
            joinGame(joinId);
          }
        } else {
          setError('No ongoing game matches the key you provided');
        }
      })
      .catch(e => setError(e.message));
  };

  const handleCreate = () => {
    setLoading(true);
    const user = auth().currentUser;
    const newGameRef = db.ref().child('activeGames').push();
    const gameId = newGameRef.key;
    const newGame = {};
    shuffleTiles(25).forEach(tile => {
      const tileKey = newGameRef.push().key;
      newGame[tileKey] = tile;
    });
    const updates = {};
    updates['/tiles'] = newGame;
    updates[`/${teams.A}/name`] = 'Team that goes 1st';
    updates[`/${teams.B}/name`] = 'The other team...?';
    updates[`/${NEUTRAL}`] = { name: 'Audience', members: { [user.uid]: user.displayName || 'Cap Annonymous' } };
    updates[`/users/${user.uid}`] = { displayName: user.displayName, isMaster: false, team: NEUTRAL };
    newGameRef.update(updates)
      .then(() => joinGame(gameId))
      .catch(e => setError(e.message));
  }

  return (
    <>
      <label htmlFor="existing">Join existing game:</label>
      <input name="existing" onChange={handleChange} placeholder="Game key" />
      <button onClick={handleClick}>
        {loading ? 'loading...' : 'Join'}
      </button>
      <hr />
      <button onClick={handleCreate}>Create New</button>
      {error && <div>{error}</div>}
    </>
  );
};
