import React, { useEffect } from 'react';

const TelegramLogin = ({ onAuthCallback }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.async = true;
    script.setAttribute('data-telegram-login', 'my_tg_login_test_bot'); // Replace with your bot username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', `${process.env.REACT_APP_API_URL}/auth`); // Replace with your backend auth URL
    script.setAttribute('data-request-access', 'write');
    script.onload = () => {
      window.onTelegramAuth = (user) => {
        onAuthCallback(user);
      };
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onAuthCallback]);

  return (
    <div id="telegram-login"></div>
  );
};

export default TelegramLogin;