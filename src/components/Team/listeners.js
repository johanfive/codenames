import { db } from '../../services/firebase';
import { equalObj } from '../../helpers/data';


export const onTeamMembers = (gameId, team, membersList, setState) => {
  const handleMembers = snap => {
    if (snap.exists()) {
      const newList = snap.val();
      if (!equalObj(membersList, newList)) {
        setState(newList);
      }
    } else if (Object.keys(membersList).length > 0) {
      setState({});
    }
  };
  const membersRef = db.ref(`/activeGames/${gameId}/${team}/members`);
  membersRef.on('value', handleMembers);
  return () => membersRef.off('value', handleMembers);
};
