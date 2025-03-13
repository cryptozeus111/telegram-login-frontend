import React, { useState } from 'react';
import axios from 'axios';
import TelegramLogin from './components/TelegramLogin';

function App() {
  const [user, setUser] = useState(null);

  const handleAuthCallback = async (userData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth`, { user: userData });
      if (response.data.success) {
        setUser(userData);
        alert('Login successful!');
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Welcome to the Mini App</h1>
      {!user ? (
        <TelegramLogin onAuthCallback={handleAuthCallback} />
      ) : (
        <div>
          <h2>Welcome, {user.first_name}!</h2>
          <p>Username: {user.username}</p>
          <p>You are now logged in.</p>
          {/* Main app interface goes here */}
        </div>
      )}
    </div>
  );
}

export default App;