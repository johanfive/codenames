import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { signinWithGoogle } from '../helpers/auth';


export default () => {
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const handleGoogleSignin = () => signinWithGoogle()
    .then(() => history.replace(from))
    .catch(e => setError(e.message));

  return (
    <>
      <h2>Login with Google to access {from.pathname}</h2>
      <button onClick={handleGoogleSignin}>Let's do it</button>
      {error && <div>You cannot log in: {error}</div>}
    </>
  );
};
