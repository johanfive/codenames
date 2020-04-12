import React from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../services/firebase';

export default ({ authed }) => {
  const history = useHistory();
  const handleClick = () => auth().signOut().then(() => history.push("/")).catch(console.error);
  return authed ? <button onClick={handleClick}>Logout</button> : <div>You're not logged in</div>;
}
