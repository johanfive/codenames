import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { auth } from './services/firebase';
import Logout from './components/Logout';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Game from './pages/Game';


export default () => {
  const [authed, setAuthed] = useState(false);
  auth().onAuthStateChanged(user => {
    if (user) {
      setAuthed(true);
    } else {
      setAuthed(false);
    }
  });
  return (
    <Router>
      <div>
        <Logout authed={authed} />
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/lobby">Lobby</Link></li>
        </ul>
        <Switch>
          <Route exact path="/login"><Login /></Route>
          {authed && (
            <>
              <Route exact path="/lobby"><Lobby /></Route>
              <Route exact path="/game/:gameId"><Game /></Route>
            </>
          )}
        </Switch>
      </div>
    </Router>
  );
}
