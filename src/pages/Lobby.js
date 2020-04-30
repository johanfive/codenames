import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { shuffleTiles, before2daysAgo } from '../helpers/data';
import { teams, NEUTRAL, defaultPlayer, teamNames } from '../constants';
import { incrementUserGamesCreated } from '../dbStuff/setters';


export default () => {
  const [ state, setState ] = useState({ error: null, loading: false });
  const history = useHistory();
  const user = auth().currentUser;

  const joinGame = gameId => history.push(`/game/${gameId}`);

  const handleCreate = () => {
    setState({ error: null, loading: true });
    const newGameRef = db.ref().child('activeGames').push();
    const gameId = newGameRef.key;
    const newGame = {};
    shuffleTiles(25).forEach(tile => {
      const tileKey = newGameRef.push().key;
      newGame[tileKey] = tile;
    });
    db.ref('/inactiveGames').once('value').then(snap => {
      if (snap.exists()) {
        const updates = {};
        snap.forEach(daySnap => {
          const ts = daySnap.key;
          if (before2daysAgo(ts)) {
            const day = daySnap.val();
            const deletables = Object.keys(day);
            deletables.forEach(gameToDelete => {
              updates[`/activeGames/${gameToDelete}`] = null;
            });
            updates[`/inactiveGames/${ts}`] = null;
          }
        });
        return db.ref().update(updates);
      }
    }).then(() => {
      const updates = {};
      updates['/tiles'] = newGame;
      updates[`/${teams.A}/name`] = teamNames[teams.A];
      updates[`/${teams.B}/name`] = teamNames[teams.B];
      updates[`/${NEUTRAL}`] = { members: { [user.uid]: user.displayName || 'Cap Annonymous' }, name: teamNames[NEUTRAL] };
      updates[`/users/${user.uid}`] = { ...defaultPlayer, displayName: user.displayName };
      return newGameRef.update(updates);
    }).then(incrementUserGamesCreated)
      .then(() => joinGame(gameId))
      .catch(e => {
        setState({ error: e.message, loading: false });
      });
  };

  const { loading, error } = state;

  return (
    <div style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      padding: '1rem'
    }}>
      <h1>Hi {user.displayName}!</h1>
      <ol className="lobbyBlurb">
        <li>Ask your friends if any of them has already created a game</li>
        <li>If one of them has, ask for the invite link... and then click it</li>
        <li>If none of them has, fight amongst yourselves and let the feistiest create a game</li>
        <li>
          If you turn out to be the glorious vanquisher of step 3, congrats, you get to push the big button.
          Otherwise, please go back to step 1.
        </li>
        <li>Have fun!</li>
      </ol>
      {loading ? 'Loading...' : <button className="create" style={{ height: '5rem', width: '5rem' }} onClick={handleCreate}>Create New</button>}
      {error}
    </div>
  );
};
