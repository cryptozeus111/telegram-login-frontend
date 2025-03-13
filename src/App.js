import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
  }, []);

  const handleLogin = async () => {
    const tg = window.Telegram.WebApp;
    const initData = tg.initData;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth`, { initData });
      if (response.data.success) {
        setIsAuthenticated(true);
        alert('Login successful!');
        // Proceed to the main app interface
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
      {!isAuthenticated ? (
        <button onClick={handleLogin}>Login with Telegram</button>
      ) : (
        <div>
          <h2>You are logged in!</h2>
          {/* Main app interface goes here */}
        </div>
      )}
    </div>
  );
}

export default App;