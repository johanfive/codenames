/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { arraysOfSameValues } from '../helpers/data';
import { colors } from '../constants';
import { flipTile, cancelVote } from '../dbStuff/setters';


const Vote = ({ gameId, player, score }) => {
  const [ vote, setVote ] = useState(null);
  const [ inFavor, setInFavor ] = useState({});

  useEffect(() => {
    const voteRef = db.ref(`/activeGames/${gameId}/vote`);
    const handleVote = snap => {
      if (snap.exists()) {
        const newVote = snap.val();
        const voteDifferentWord = vote && vote.word !== newVote.word;
        if (!vote || voteDifferentWord) {
          setVote(newVote);
        }
      } else if (vote) {
        setVote(null);
      }
    };
    voteRef.on('value', handleVote);
    return () => voteRef.off('value', handleVote);
  }, [gameId, vote]);

  useEffect(() => {
    const inFavorRef = db.ref(`/activeGames/${gameId}/inFavor`);
    const handleInFavor = snap => {
      const currentVotersIds = Object.keys(inFavor);
      if (snap.exists()) {
        const newList = snap.val();
        if (!arraysOfSameValues(Object.keys(newList), currentVotersIds)) {
          setInFavor(newList);
        }
      } else if (currentVotersIds.length > 0) {
        setInFavor({});
      }
    };
    inFavorRef.on('value', handleInFavor);
    return () => inFavorRef.off('value', handleInFavor);
  }, [gameId, inFavor]);

  if (vote) {
    const { clicker, team, tileId, word } = vote;
    const clickerId = Object.keys(clicker)[0];
    const user = auth().currentUser;

    const flip = () => {
      flipTile(gameId, tileId, team, score)
        .catch(e => console.error(e.message));
    };
    const disagree = () => {
      db.ref(`/activeGames/${gameId}/inFavor/${user.uid}`)
        .set(null)
        .catch(e => console.error(e.message));
    };
    const agree = () => {
      db.ref(`/activeGames/${gameId}/inFavor/${user.uid}`)
        .set(user.displayName)
        .catch(e => console.error(e.message));
    };
    const cancel = () => cancelVote(gameId).catch(e => console.error(e.message));

    const thoseInFavor = Object.keys(inFavor);
    const isClicker = user.uid === clickerId;
    const flippable = thoseInFavor && thoseInFavor.length > 0;
    const canVote = player.team === team && !isClicker && (!inFavor[user.uid]);
    return (
      <div style={{
        border: `1px solid ${colors[team]}`,
        marginRight: '1rem',
        overflow: 'auto',
        padding: '2rem 1rem 0',
        width: '14rem'
      }}>
        <div><span style={{ color: colors[team] }}>{clicker[clickerId]}</span> wants to flip <b>{word}</b></div>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {thoseInFavor.map((voter, i) => (
            <li key={i}>
              <span style={{ color: colors[team] }}>{inFavor[voter]}</span> agrees
              {voter === user.uid && <button onClick={disagree} style={{ marginLeft: '.5rem' }}>DISAGREE</button>}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {canVote && <button onClick={agree}>AGREE</button>}
          {flippable && isClicker && <button onClick={flip}>FLIP</button>}
          {isClicker && <button onClick={cancel}>CANCEL</button>}
        </div>
      </div>
    );
  }
  return null;
};

export default Vote;
