import React, { useState, useEffect } from "react";
import { UNFLIPPED, NEUTRAL } from "../constants";
import { db } from "../services/firebase";
import { createVote } from "../dbStuff/setters";


const Tile = ({ gameId, id, player, score }) => {
  const { isCaptain, team } = player;
  const [ word, setWord ] = useState('Loading...');
  const [ color, setColor ] = useState(UNFLIPPED);
  const [ value, setValue ] = useState(null);
  const tileRef = db.ref(`/activeGames/${gameId}/tiles/${id}`);

  useEffect(() => {
    if (gameId && id && word === 'Loading...') {
      tileRef.child('word').once('value')
        .then(snap => setWord(snap.val()))
        .catch(e => console.error(e.message));
      const handleColorChange = snap => setColor(snap.val());
      tileRef.child('color').on('value', handleColorChange);
      return () => tileRef.off('value', handleColorChange);
    }
  }, [gameId, id, tileRef, word]);

  useEffect(() => {
    if (gameId && id && isCaptain) {
      tileRef.child('value').once('value')
        .then(snap => setValue(snap.val()))
        .catch(e => console.error(e.message));
    }
  }, [gameId, id, tileRef, isCaptain]);

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
