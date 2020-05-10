import { db, auth } from '../../services/firebase';


const getGameRef = gameId => db.ref(`/activeGames/${gameId}`);

export const cancelVote = gameId => {
  return getGameRef(gameId).update({
    inFavor: null,
    vote: null
  });
};

export const agree = gameId => {
  const user = auth().currentUser;
  return getGameRef(gameId).child(`inFavor/${user.uid}`).set(user.displayName);
};

export const disagree = gameId => {
  return getGameRef(gameId).child(`inFavor/${auth().currentUser.uid}`).set(null);
};
