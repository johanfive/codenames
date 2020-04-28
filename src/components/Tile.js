import React, { useState, useEffect } from "react";
import { UNFLIPPED, NEUTRAL } from "../constants";
import { db } from "../services/firebase";
import { createVote } from "../dbStuff/setters";
import { onTileColorChange } from "../dbStuff/listeners";


const Tile = ({ gameId, id, player }) => {
  const { isCaptain, team } = player;
  const [ word, setWord ] = useState('Loading...');
  const [ color, setColor ] = useState(UNFLIPPED);
  const [ value, setValue ] = useState(null);

  useEffect(() => {
    const tileWordRef = db.ref(`/activeGames/${gameId}/tiles/${id}/word`);
    tileWordRef.once('value')
      .then(snap => setWord(snap.val()))
      .catch(e => console.error(e.message));
  }, [gameId, id]);

  useEffect(() => onTileColorChange(gameId, id, setColor), [gameId, id]);

  useEffect(() => {
    if (isCaptain) {
      const tileValueRef = db.ref(`/activeGames/${gameId}/tiles/${id}/value`);
      tileValueRef.once('value')
        .then(snap => setValue(snap.val()))
        .catch(e => console.error(e.message));
    }
  }, [gameId, id, isCaptain]);

  const flip = () => {
    if (team !== NEUTRAL && color === UNFLIPPED) {
      createVote(gameId, id, word, team).catch(e => console.error(e.message));
    }
  };

  const flipped = color !== UNFLIPPED;
  const capView = flipped ? value : value + '-transparent';

  return (
    <div style={{ backgroundColor: 'white' }}>
      <div
        className={`tile ${isCaptain ? capView : color} ${flipped && 'unflippable'}`}
        onClick={flip}
      >
        {word}
      </div>
    </div>
  );
};

export default Tile;
