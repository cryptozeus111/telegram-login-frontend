import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Telegram Mini App!</h1>
      <p>This is a React-based frontend.</p>
      <Link to="/auth">Login with Telegram</Link>
    </div>
  );
};

export default Home;