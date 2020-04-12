import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { teams, NEUTRAL } from '../constants';
import Score from '../components/Score';
import Tile from '../components/Tile';
import TeamList from '../components/TeamList';
import SpyDibs from '../components/SpyDibs';
import Timer from '../components/Timer';
import { auth, db } from '../services/firebase';
import '../App.css';


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
    userRef.on('value', snap => setPlayer(snap.val()));
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
    (team, i) => <TeamList key={i} gameId={gameId} currentTeam={player.team} teamToJoin={team} />
  );

  if (error) {
    return <div><h1>Something went terribly wrong</h1><div>{error}</div></div>;
  } else {
    return loading ? <h1>Loading...</h1> : (
      <>
        <h1>{gameId}</h1>
        <Score gameId={gameId} />{player && <SpyDibs gameId={gameId} player={player} />}
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>{teamsLists}</div>
          <div className="board">{rows}</div>
        </div>
        <Timer />
          {/* <button onClick={() => dispatch({ type: actionTypes.RESET })}>Reset</button> */}
      </>
    );
  }
};

export default Game;
