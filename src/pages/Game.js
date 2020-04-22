import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teams, NEUTRAL, defaultPlayer } from '../constants';
import Score from '../components/Score';
import Tile from '../components/Tile';
import TeamList from '../components/TeamList';
import { auth, db } from '../services/firebase';
import '../App.css';

const authUserJoinsGame = (gameId) => {
  const gameRef = db.ref(`/activeGames/${gameId}`);
  const user = auth().currentUser;
  const updates = {};
  updates[`/${NEUTRAL}/members/${user.uid}`] = user.displayName || 'Cap Annonymous';
  updates[`/users/${user.uid}`] = { ...defaultPlayer, displayName: user.displayName };
  return gameRef.update(updates);
};

const Row = ({ gameId, columns, player }) => (
  <div className="row">
    {columns.map((tileId) => <Tile key={tileId} id={tileId} gameId={gameId} player={player} />)}
  </div>
);

const Game = () => {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ player, setPlayer ] = useState({});
  const [ tiles, setTiles ] = useState([]);
  const { gameId } = useParams();

  useEffect(() => {
    const user = auth().currentUser;
    const gameRef = db.ref(`/activeGames/${gameId}`);
    const userRef = gameRef.child(`/users/${user.uid}`);
    const tilesRef = gameRef.child('/tiles');
    userRef.on('value', snap => {
      if (snap.exists()) {
        setPlayer(snap.val());
      } else {
        authUserJoinsGame(gameId);
      }
    });
    tilesRef.once('value')
      .then(snap => {
        const data = snap.val();
        setLoading(false);
        setTiles(Object.keys(data));
      })
      .catch(e => setError(e.message));
    // return () => db.ref(`/activeGames/${gameId}`).set(null); // TODO need to call that function if current # of players === 0
    // was thinking maybe the onDisconnect method would be good, but what if 1 user just leaves while others want to stay?
    return () => userRef.off();
  }, [gameId]);

  const rowsCountAndLength = Math.sqrt(tiles.length);
  if (rowsCountAndLength && rowsCountAndLength !== Math.round(rowsCountAndLength)) {
    throw new Error('Invalid number of tiles');
  }
  const rows = [];
  for (let i = 0; i < tiles.length; i += rowsCountAndLength) {
    const rowData = tiles.slice(i, i + rowsCountAndLength);
    rows.push(<Row key={i} gameId={gameId} columns={rowData} player={player} />);
  }
  const teamsLists = [teams.A, teams.B, NEUTRAL].map(
    (team, i) => <TeamList key={i} gameId={gameId} player={player} teamToJoin={team} />
  );

  const copy = () => {
    navigator.clipboard.writeText(window.location.href)
    .then(() => {
      console.log('URL copied to clipboard');
    })
    .catch(e => {
      console.error('Could not copy URL', e);
    });
  }

  if (error) {
    return <div><h1>Something went terribly wrong</h1><div>{error}</div></div>;
  } else {
    return loading ? <h1>Loading...</h1> : (
      <>
        <Link to="/">Lobby</Link>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <div><button onClick={copy}>Get Invite Link</button></div>
          <Score gameId={gameId} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>{teamsLists}</div>
          <div className="board">{rows}</div>
        </div>
          {/* <button onClick={() => dispatch({ type: actionTypes.RESET })}>Reset</button> */}
      </>
    );
  }
};

export default Game;
