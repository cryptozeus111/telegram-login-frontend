import React, { useEffect } from 'react';

const TelegramLogin = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.async = true;
    script.setAttribute('data-telegram-login', 'your_bot_username');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', 'https://yourdomain.com/auth');
    script.setAttribute('data-request-access', 'write');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="telegram-login"></div>
  );
};

export default TelegramLogin;