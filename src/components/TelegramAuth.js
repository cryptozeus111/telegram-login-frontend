// components/TelegramAuth.jsx
import React, { useState, useEffect } from 'react';

const TelegramAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initialize Telegram Web App
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.onEvent('mainButtonClicked', onAuthenticate);
    }, []);

    const onAuthenticate = async () => {
        try {
            const initDataRaw = window.Telegram.WebApp.initDataRaw;
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/telegram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    initDataRaw,
                    isMocked: process.env.NODE_ENV === 'development'
                })
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
            setUser({
                id: data.user.telegram_id,
                username: data.user.username,
                name: data.user.name,
                avatar: data.user.avatar_url
            });
        } catch (err) {
            setError('Authentication failed. Please try again.');
            console.error('Authentication error:', err);
        }
    };

    return (
        <div className="telegram-auth">
            {!isAuthenticated ? (
                <div className="login-container">
                    <button 
                        onClick={onAuthenticate}
                        className="telegram-button"
                    >
                        Login with Telegram
                    </button>
                    {error && <div className="error-message">{error}</div>}
                </div>
            ) : (
                <div className="user-profile">
                    <img src={user.avatar} alt={user.name} />
                    <h2>Welcome, {user.name}</h2>
                    <p>Telegram ID: {user.id}</p>
                    <p>Username: {user.username}</p>
                </div>
            )}
        </div>
    );
};

export default TelegramAuth;