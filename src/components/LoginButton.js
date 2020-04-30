/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signinWithGoogle } from '../helpers/auth';


const LoginButton = ({ authed }) => {
  const history = useHistory();
  const { location } = history;

  const backToLogin = () => history.push('/login');

  const handleLogIn = () => signinWithGoogle()
    .then(() => history.push(location.state.from))
    .catch((e) => {
      console.error(e.message);
      backToLogin();
    });

  const handleLogOut = () => auth().signOut()
    .then(backToLogin)
    .catch(console.error);

  return authed
    ? <button onClick={handleLogOut}>Log Out</button>
    : <button style={{ padding: '.5rem' }} onClick={handleLogIn}>Log In</button>;
};

export default LoginButton;
