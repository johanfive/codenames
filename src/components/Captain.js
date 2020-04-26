import React, { useEffect } from 'react';
import { useState } from 'react';
import { db } from '../services/firebase';
import { userBecomesCaptain } from '../dbStuff/setters';
import { colors } from '../constants';


const buttonStyle = team => ({
  margin: '1rem auto',
  padding: '.5rem 1.5rem',
  backgroundColor: colors[team],
  color: 'white',
  borderRadius: '1rem',
  letterSpacing: '1px'
});

const TeamColor = ({team, text}) => <span style={{ display: 'inline-block', border: '1px solid #717272', padding: '.5rem', marginTop: '5px', color: colors[team] }}>{text}</span>;

const Captain = ({ gameId, team, player }) => {
  const [ teamCaptain, setCaptain ] = useState(null);
  const capRef = db.ref(`/activeGames/${gameId}/${team}/captain`);
  useEffect(() => {
    const handleCapChange = snap => {
      if (snap.exists()) {
        setCaptain(snap.val());
      }
    }
    capRef.on('value', handleCapChange);
    return () => capRef.off('value', handleCapChange);
  }, [capRef]);
  const capUp = (e) => {
    e.preventDefault();
    if (window.confirm('Once you\'re it, you cannot change your mind. You sure?')) {
      userBecomesCaptain(gameId, team);
    }
  };
  const capUpButton = (player.team === team && !player.isCaptain)
    ? <button onClick={capUp} style={buttonStyle(team)}>Captain up</button>
    : null;
  return teamCaptain ? <TeamColor text={`Capn ${teamCaptain}`} team={team} /> : capUpButton;
};

export default Captain;
