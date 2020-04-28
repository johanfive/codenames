import { db, auth } from "../services/firebase";
import { NEUTRAL, defaultPlayer, teams, ASSASSIN, scoreToWin } from "../constants";
import { getToday } from "../helpers/data";


const incrementBy1 = current => current ? (current + 1) : 1;

// created
// won
// lost
// teamA
// (played = won + lost)
// (teamB = played - teamA)
const incrementUserStat = stat => {
  const user = auth().currentUser;
  return db.ref(`/users/${user.uid}/${stat}`).transaction(incrementBy1);
};

export const incrementUserGamesCreated = () => incrementUserStat('created');

// Only call for non-audience members
export const setUserStats = (win, team) => {
  return incrementUserStat(win ? 'won' : 'lost').then((transactionResult) => {
    if (transactionResult.committed) {
      if (team === teams.A) {
        return incrementUserStat('teamA');
      }
    }
  });
};

export const authUserJoinsGame = (gameId) => {
  const user = auth().currentUser;
  const gameRef = db.ref(`/activeGames/${gameId}`);
  const updates = {};
  updates[`/${NEUTRAL}/members/${user.uid}`] = user.displayName;
  updates[`/users/${user.uid}`] = { ...defaultPlayer, displayName: user.displayName };
  return gameRef.update(updates);
};

export const userJoinsTeam = (gameId, teamToJoin, currentTeam) => {
  const user = auth().currentUser;
  const gameRef = db.ref(`/activeGames/${gameId}`);
  const updates = {};
  updates[`/${currentTeam}/members/${user.uid}`] = null;
  updates[`/${teamToJoin}/members/${user.uid}`] = user.displayName;
  updates[`/users/${user.uid}/team`] = teamToJoin;
  if (currentTeam !== NEUTRAL) {
    updates[`/vote`] = null;
    updates[`/inFavor`] = null;
  }
  return gameRef.update(updates);
};

export const userBecomesCaptain = (gameId, team) => {
  const user = auth().currentUser;
  const gameRef = db.ref(`/activeGames/${gameId}`);
  return gameRef.child(`/${team}/captain`).transaction(currentCap => {
    if (!currentCap) {
      return user.displayName;
    }
  }).then(transactionResult => {
    if (transactionResult.committed) {
      const updates = {};
      updates[`/${team}/members/${user.uid}`] = null;
      updates[`/users/${user.uid}/isCaptain`] = true;
      return gameRef.update(updates);
    }
  });
};

const pushToInactiveGames = gameId => {
  return db.ref(`/inactiveGames/${getToday()}`).push(gameId);
};

const incrementTeamScore = (gameId, team) => {
  const teamScoreRef = db.ref(`/activeGames/${gameId}/${team}/score`);
  return teamScoreRef.transaction(incrementBy1);
};

export const flipTile = (gameId, tileId, clickingTeam, score) => {
  const gameRef = db.ref(`/activeGames/${gameId}`);
  const tileRef = gameRef.child(`/tiles/${tileId}`);
  let scoringTeam = null;
  return tileRef.child('value').once('value')
  .then(snap => snap.val())
  .then(tileValue => {
    scoringTeam = tileValue;
    const updates = {};
    updates[`/vote`] = null;
    updates[`/inFavor`] = null;
    updates[`/tiles/${tileId}/color`] = scoringTeam;
    return gameRef.update(updates);
  })
  .then(() => {
    if (scoringTeam === ASSASSIN) {
      console.log(`${clickingTeam} walks on the mine. Bye ${clickingTeam}!`);
      return db.ref(`/activeGames/${gameId}/mine`).set(clickingTeam)
        .then(() => pushToInactiveGames(gameId));
    } else if (scoringTeam !== NEUTRAL) {
      const endGame = score[scoringTeam] === (scoreToWin[scoringTeam] - 1);
      return incrementTeamScore(gameId, scoringTeam)
        .then(transactionResult => {
          if (transactionResult.committed && endGame) {
            return pushToInactiveGames(gameId);
          }
        });
    }
  });
};

export const createVote = (gameId, tileId, word, team) => {
  const user = auth().currentUser;
  const vote = {
    team,
    tileId,
    word,
    clicker: {
      [user.uid]: user.displayName
    }
  };
  const sameTeamDifferentWord = currentVote => team === currentVote.team && word !== currentVote.word;
  return db.ref(`/activeGames/${gameId}/vote`).transaction(currentVote => {
    if (!currentVote || sameTeamDifferentWord(currentVote)) {
      return vote;
    }
  });
};

export const cancelVote = (gameId) => {
  const updates = {};
  updates[`/vote`] = null;
  updates[`/inFavor`] = null;
  return db.ref(`/activeGames/${gameId}`).update(updates);
};
