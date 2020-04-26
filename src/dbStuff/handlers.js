import { authUserJoinsGame, setUserStats } from "./setters";
import { teams } from "../constants";

// handleTilesChange
// handleTeamNameChange
// onTeamMembersChange
// onTeamCaptainChange
export const makeHandler = setState => snap => {
  if (snap.exists()) {
    setState(snap.val());
  }
};

export const handleMineChange = setState => snap => {
  if (snap.exists()) {
    const winningTeam = snap.val() === teams.A ? teams.B : teams.A;
    setState(winningTeam);
  }
};

export const handleUserChange = (setState, gameId) => snap => {
  if (snap.exists()) {
    setState(snap.val());
  } else {
    authUserJoinsGame(gameId).catch(e => console.error(e.message));
  }
};

export const handleVictory = (winningTeam, team) => {
  if (team === teams.A || team === teams.B) {
    const win = team === winningTeam;
    setUserStats(win, team).catch(e => console.error(e.message));
  } // TODO: is there a need to return a promise? If so is there a need to return something for audience?
};
