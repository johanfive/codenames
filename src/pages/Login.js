import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';


export default ({ authed }) => {  
  const history = useHistory();
  const { location } = history;
  const { state = {} } = location;
  const fromGame = state.from && state.from.pathname.slice(0, 5) === '/game';

  useEffect(() => {
    if (authed) {
      history.push(state.from || '/');
    }
  }, [authed, history, state]);

  return (
    <div>
      <h1>C L U E F U L</h1>
      <p>Because being clueless is just awful ¯\_(ツ)_/¯</p>
      {fromGame && <div>You will be redirected once you have logged in</div>}
    </div>
  );
};
