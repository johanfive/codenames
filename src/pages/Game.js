import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { NEUTRAL, teams, scoreToWin, colors } from '../constants';
import { onUserChange, onMineChange, onTeamScoreChange } from '../dbStuff/listeners';
import { handleUserChange, handleMineChange, makeHandler } from '../dbStuff/handlers';
import { getTilesIds } from '../dbStuff/getters';
import Team from '../components/Team';
import Tile from '../components/Tile';
import Timer from '../components/Timer';
import Vote from '../components/Vote';


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

  useEffect(() => {
    const forgetUser = onUserChange(gameId, handleUserChange(setPlayer, gameId));
    return () => forgetUser();
  }, [gameId]);

  useEffect(() => {
    const forgetMineTeam = onMineChange(gameId, handleMineChange(setWinners));
    const forgetTeamAScore = onTeamScoreChange(gameId, teams.A, makeHandler(setTeamAScore));
    const forgetTeamBScore = onTeamScoreChange(gameId, teams.B, makeHandler(setTeamBScore));
    return () => {
      forgetMineTeam();
      forgetTeamAScore();
      forgetTeamBScore();
    };
  }, [gameId]);

  useEffect(() => {
    if (teamAScore === scoreToWin[teams.A]) {
      setWinners(teams.A);
    }
    if (teamBScore === scoreToWin[teams.B]) {
      setWinners(teams.B);
    }
  }, [teamAScore, teamBScore]);

  useEffect(() => {
    if (winners && !player.isCaptain) {
      // game ends - give all players CapView (without making them team Caps per se)
      setPlayer({ ...player, isCaptain: true });
    }
  }, [winners, player]);

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
