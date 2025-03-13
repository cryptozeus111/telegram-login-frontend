import React, { useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  // return (
  //   <script
  //     async
  //     src="https://telegram.org/js/telegram-widget.js?7"
  //     data-telegram-login="your_bot_username"
  //     data-size="large"
  //     data-radius="14"
  //     data-auth-url="https://yourdomain.com/auth"
  //     data-request-access="write"
  //   ></script>
  // );
  useEffect(() => {
    const handleAuth = async () => {
      const tg = window.Telegram.WebApp;
      const initData = tg.initData;

      try {
        const response = await axios.post('https://telegram-login-backend.vercel.app/auth', { initData });
        console.log('Authentication response:', response.data);
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };

    handleAuth();
  }, []);

  return (
    <div>
      <h2>Logging in...</h2>
    </div>
  );
};

export default Login;