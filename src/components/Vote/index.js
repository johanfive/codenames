/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { colors } from '../../constants';
import { auth } from '../../services/firebase';
import { flipTile } from '../../dbStuff/setters';
import { cancelVote, agree, disagree } from './setters';
import { onNewVote, onVoters } from './listeners';


const Vote = ({ gameId, player, score }) => {
  const [ vote, setVote ] = useState(null);
  const [ inFavor, setInFavor ] = useState({});

  useEffect(() => onNewVote(gameId, vote, setVote), [gameId, vote]);
  useEffect(() => onVoters(gameId, inFavor, setInFavor), [gameId, inFavor]);

  if (vote) {
    const user = auth().currentUser;
    const thoseInFavor = Object.keys(inFavor);
    const { team, clicker, word, tileId } = vote;
    const clickerId = Object.keys(clicker)[0];
    const clickerName = clicker[clickerId];
    const isClicker = user.uid === clickerId;
    const hasAgreed = inFavor[user.uid];
    const canVote = !isClicker && !player.isCaptain && player.team === team;
    const canFlip = isClicker && thoseInFavor.length > 0;

    const handleAgree = () => agree(gameId);
    const handleDisagree = () => disagree(gameId);
    const handleCancel = () => cancelVote(gameId);
    const handleTileFlip = () => flipTile(gameId, tileId, team, score);

    const voteButtons = hasAgreed
      ? <button onClick={handleDisagree}>Disagree</button>
      : <button onClick={handleAgree}>Agree</button>;

    return (
      <div style={{
        border: `1px solid ${colors[team]}`,
        marginRight: '1rem',
        overflow: 'auto',
        padding: '2rem 1rem 0',
        width: '14rem'
      }}>
        <div>
          <span style={{ color: colors[team] }}>{clickerName}</span> wants to flip <b>{word}</b>
        </div>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {thoseInFavor.map((voterId, i) =>
            <li key={i}><span style={{ color: colors[team] }}>{inFavor[voterId]}</span> agrees</li>
          )}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {canVote && voteButtons}
          {canFlip && <button onClick={handleTileFlip}>Flip</button>}
          {isClicker && <button onClick={handleCancel}>Cancel</button>}
        </div>
        <div className='info'>
          For teams of 2, the player must tell the Captain which tile to flip
        </div>
      </div>
    );
  }
  return null;
};

export default Vote;
