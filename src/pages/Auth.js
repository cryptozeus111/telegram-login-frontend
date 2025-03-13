import React, { useEffect } from 'react';
import axios from 'axios';

const Auth = () => {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const initData = tg.initData;

    // Send initData to the backend for validation
    const validateInitData = async () => {
      try {
        const response = await axios.post('https://telegram-login-backend.vercel.app/validate-initdata', { initData });
        console.log('Validation response:', response.data);
      } catch (error) {
        console.error('Validation failed:', error);
      }
    };

    validateInitData();
  }, []);

  return (
    <div>
      <h2>Logging in...</h2>
      <p>Please wait while we authenticate you.</p>
    </div>
  );
};

export default Auth;