import { db } from '../../services/firebase';
import { equalObj } from '../../helpers/data';


const getGameRef = gameId => db.ref(`/activeGames/${gameId}`);

export const onNewVote = (gameId, currentVote, setState) => {
  const handleVote = snap => {
    if (snap.exists()) {
      const newVote = snap.val();
      if (!equalObj(currentVote, newVote)) {
        setState(snap.val());
      }
    } else if (currentVote) {
      setState(null);
    }
  };
  const voteRef = getGameRef(gameId).child('vote');
  voteRef.on('value', handleVote);
  return () => voteRef.off('value', handleVote);
};

export const onVoters = (gameId, voters, setState) => {
  const handleVoters = snap => {
    if (snap.exists()) {
      const newVotersList = snap.val();
      if (!equalObj(voters, newVotersList)) {
        setState(snap.val());
      }
    } else {
      setState({});
    }
  };
  const votersRef = getGameRef(gameId).child('inFavor');
  votersRef.on('value', handleVoters);
  return () => votersRef.off('value', handleVoters);
};
