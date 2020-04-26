import { db, auth } from "../services/firebase";


export const onTileChange = (gameId, tileId, handleTileChange) => {
  const tileRef = db.ref(`/activeGames/${gameId}/tile/${tileId}`);
  tileRef.on('value', handleTileChange);
  return () => tileRef.off('value', handleTileChange);
};

export const onUserChange = (gameId, handleUserChange) => {
  const user = auth().currentUser;
  const userRef = db.ref(`activeGames/${gameId}/users/${user.uid}`);
  userRef.on('value', handleUserChange);
  return () => userRef.off('value', handleUserChange);
};

export const onTeamScoreChange = (gameId, team, handleTeamScoreChange) => {
  const tileRef = db.ref(`/activeGames/${gameId}/${team}/score`);
  tileRef.on('value', handleTeamScoreChange);
  return () => tileRef.off('value', handleTeamScoreChange);
};

export const onTeamNameChange = (gameId, team, handleTeamNameChange) => {
  const teamNameRef = db.ref(`/activeGames/${gameId}/${team}/name`);
  teamNameRef.on('value', handleTeamNameChange);
  return () => teamNameRef.off('value', handleTeamNameChange);
};

export const onTeamMembersChange = (gameId, team, handleTeamMembersChange) => {
  const teamMembersRef = db.ref(`/activeGames/${gameId}/${team}/members`);
  teamMembersRef.on('value', handleTeamMembersChange);
  return () => teamMembersRef.off('value', handleTeamMembersChange);
};

export const onTeamCaptainChange = (gameId, team, handleTeamCaptainChange) => {
  const teamCaptainRef = db.ref(`/activeGames/${gameId}/${team}/captain`);
  teamCaptainRef.on('value', handleTeamCaptainChange);
  return () => teamCaptainRef.off('value', handleTeamCaptainChange);
};

export const onMineChange = (gameId, handleMineChange) => {
  const mineRef = db.ref(`/activeGames/${gameId}/mine`);
  mineRef.on('value', handleMineChange);
  return () => mineRef.off('value', handleMineChange);
};
