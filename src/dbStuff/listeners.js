import { db, auth } from "../services/firebase";
import { teams } from "../constants";
import { authUserJoinsGame } from "./setters";


export const onUserChange = (gameId, setState) => {
  const user = auth().currentUser;
  const userRef = db.ref(`activeGames/${gameId}/users/${user.uid}`);
  const handleUserChange = snap => {
    if (snap.exists()) {
      setState(snap.val());
    } else {
      authUserJoinsGame(gameId).catch(e => console.error(e.message));
    }
  };
  userRef.on('value', handleUserChange);
  return () => userRef.off('value', handleUserChange);
};

export const onTeamScoreChange = (gameId, team, setState) => {
  const tileRef = db.ref(`/activeGames/${gameId}/${team}/score`);
  const handleTeamScoreChange = snap => {
    if (snap.exists()) {
      setState(snap.val());
    }
  };
  tileRef.on('value', handleTeamScoreChange);
  return () => tileRef.off('value', handleTeamScoreChange);
};

export const onMineChange = (gameId, setState) => {
  const mineRef = db.ref(`/activeGames/${gameId}/mine`);
  const handleMineChange = snap => {
    if (snap.exists()) {
      const winningTeam = snap.val() === teams.A ? teams.B : teams.A;
      setState(winningTeam);
    }
  };
  mineRef.on('value', handleMineChange);
  return () => mineRef.off('value', handleMineChange);
};

export const onTilesRemoved = (gameId, history) => {
  const redirect = () => history.push('/');
  const gameRef = db.ref(`/activeGames/${gameId}/tiles`);
  gameRef.on('child_removed', redirect);
  return () => gameRef.off('child_removed', redirect);
};

export const onTileColorChange = (gameId, tileId, setState) => {
  const tileColorRef = db.ref(`/activeGames/${gameId}/tiles/${tileId}/color`);
  const handleColorChange = snap => setState(snap.val());
  tileColorRef.on('value', handleColorChange);
  return () => tileColorRef.off('value', handleColorChange);
};
