/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signinWithGoogle } from '../helpers/auth';


const loginStyle = { margin: '.5rem', padding: '.5rem' };

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
    ? <button style={loginStyle} onClick={handleLogOut}>Log Out</button>
    : <button style={loginStyle} onClick={handleLogIn}>Log In</button>;
};

export default LoginButton;
