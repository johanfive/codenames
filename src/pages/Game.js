import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { NEUTRAL, teams, scoreToWin, colors } from '../constants';
import { onUserChange, onMineChange, onTeamScoreChange, onTilesRemoved } from '../dbStuff/listeners';
import { getTilesIds } from '../dbStuff/getters';
import Team from '../components/Team';
import Tile from '../components/Tile';
import Timer from '../components/Timer';
import Vote from '../components/Vote';
import { setUserStats } from '../dbStuff/setters';


const Board = ({ gameId, tilesIds, player, score }) => {
  return (
    <div className="board">
      {tilesIds.map(id => <Tile key={id} gameId={gameId} id={id} player={player} score={score} />)}
    </div>
  );
};

export default () => {
  const [ tilesIds, setTilesIds ] = useState([]);
  const [ player, setPlayer ] = useState({
    team: NEUTRAL, isCaptain: false, displayName: 'Cap Annonymous'
  });
  const [ winners, setWinners ] = useState(null);
  const [ teamAScore, setTeamAScore ] = useState(0);
  const [ teamBScore, setTeamBScore ] = useState(0);

  const { team } = player;
  const { gameId } = useParams();
  const history = useHistory();

  useEffect(() => {
    getTilesIds(gameId)
      .then(snap => {
        if (snap.exists()) {
          setTilesIds(Object.keys(snap.val()));
        } else {
          history.push(`/`);
        }
      })
      .catch(e => console.error(e));
  }, [gameId, history]);

  useEffect(() => onTilesRemoved(gameId, history), [gameId, history]);
  useEffect(() => onUserChange(gameId, setPlayer), [gameId]);
  useEffect(() => onMineChange(gameId, setWinners), [gameId]);
  useEffect(() => onTeamScoreChange(gameId, teams.A, setTeamAScore), [gameId]);
  useEffect(() => onTeamScoreChange(gameId, teams.B, setTeamBScore), [gameId]);
  useEffect(() => {
    if (teamAScore === scoreToWin[teams.A]) {
      setWinners(teams.A);
    }
  }, [teamAScore]);
  useEffect(() => {
    if (teamBScore === scoreToWin[teams.B]) {
      setWinners(teams.B);
    }
  }, [teamBScore]);

  useEffect(() => {
    if (winners && !player.isCaptain) {
      // game ends - give all players CapView (without making them team Caps per se)
      setPlayer({ ...player, isCaptain: true });
    }
  }, [winners, player]);

  useEffect(() => {
    if (winners) {
      if (team !== NEUTRAL) {
        const win = team === winners;
        setUserStats(win, team).catch(e => console.error(e.message));
      }
    }
  }, [winners, team]);

  const copy = () => {
    navigator.clipboard.writeText(window.location.href)
    .then(() => {
      console.log('URL copied to clipboard');
    })
    .catch(e => {
      console.error('Could not copy URL', e);
    });
  }

  return (
    <div>
      <h1>C L U E F U L {winners && <span style={{ color: colors[winners]}}>Winners: {winners}</span>}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <div><Link to="/">Lobby</Link></div>
        <div><button onClick={copy}>Get Invite Link</button></div>
        <Timer />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '36rem', justifyContent: 'space-between' }}>
          <Team team={teams.A} gameId={gameId} player={player} score={teamAScore} />
          <Team team={teams.B} gameId={gameId} player={player} score={teamBScore} />
          <Team team={NEUTRAL} gameId={gameId} player={player} />
          <Vote gameId={gameId} player={player} score={{ [teams.A]: teamAScore, [teams.B]: teamBScore }} />
        </div>
        <Board gameId={gameId} tilesIds={tilesIds} player={player} />
      </div>
    </div>
  );
};
