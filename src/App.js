import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { auth } from './services/firebase';
import LoginButton from './components/LoginButton';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Game from './pages/Game';


const ProtectedRoute = ({ authed, path, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      path={path}
      render={props => authed
        ? <Component {...props} />
        : <Redirect
            to={{ // "location" object
              pathname: '/login', // where to redirect when not logged-in
              state: {
                from: props.location, // where to redirect back to,
                // once logged-in, after the 1st redirect to /login
              }
            }}
          />
      }
    />
  );
};


const App = () => {
  const [ authed, setAuthed ] = useState(false);
  auth().onAuthStateChanged(user => {
    if (user) {
      setAuthed(true);
    } else {
      setAuthed(false);
    }
  });
  return (
    <>
      <LoginButton authed={authed} />
      <Switch>
        <ProtectedRoute exact path="/" authed={authed} component={Lobby} />
        <Route path="/login"><Login authed={authed} /></Route>
        <ProtectedRoute path="/game/:gameId" authed={authed} component={Game} />
      </Switch>
    </>
  );
};

export default App;
