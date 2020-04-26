import { db } from "../services/firebase";


export const getTilesIds = (gameId) => {
  return db.ref(`/activeGames/${gameId}/tiles`).once('value');
};
