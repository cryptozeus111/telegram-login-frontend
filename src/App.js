import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Auth from './pages/Auth';
// import Profile from './components/Profile';
import TelegramAuth from './components/TelegramAuth';

function App() {
  // useEffect(() => {
  //   const tg = window.Telegram.WebApp;

  //   // Expand the Mini App to full screen
  //   tg.expand();

  //   // Log user data
  //   const user = tg.initDataUnsafe.user;
  //   console.log('User:', user);

  //   // Handle theme changes (optional)
  //   tg.onEvent('themeChanged', () => {
  //     console.log('Theme changed:', tg.colorScheme);
  //   });
  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelegramAuth />} />
        {/* <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;