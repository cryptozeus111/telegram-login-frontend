// components/TelegramAuth.jsx
import React, { useState, useEffect, useCallback } from 'react';

const TelegramAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isReady, setIsReady] = useState(false);

    // Initialize Telegram Web App with proper error handling
    const initializeTelegram = useCallback(async () => {
        try {
            // Wait for Telegram Web App to be available
            while (!window.Telegram) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Initialize the app
            window.Telegram.WebApp.ready();

            // Set up event listeners
            window.Telegram.WebApp.onEvent('mainButtonClicked', onAuthenticate);
            window.Telegram.WebApp.onEvent('themeChanged', onThemeChange);
            window.Telegram.WebApp.onEvent('viewportChanged', onViewportChange);

            // Get initial theme
            const theme = window.Telegram.WebApp.theme;
            onThemeChange(theme);

            setIsReady(true);
        } catch (err) {
            setError('Failed to initialize Telegram Web App: ' + err.message);
            console.error('Initialization error:', err);
        }
    }, []);

    // Theme handling
    const onThemeChange = useCallback((theme) => {
        if (theme === 'light') {
            document.body.classList.remove('dark-theme');
        } else {
            document.body.classList.add('dark-theme');
        }
    }, []);

    // Viewport handling
    const onViewportChange = useCallback((params) => {
        if (params.isStateStable) {
            // Handle stable viewport state
            const viewportHeight = params.height;
            document.documentElement.style.setProperty(
                '--tg-viewport-height',
                `${viewportHeight}px`
            );
        }
    }, []);

    // Authentication handler
    const onAuthenticate = useCallback(async () => {
        try {
            if (!isReady) {
                throw new Error('Telegram Web App not initialized');
            }

            if (!window.Telegram.WebApp.initDataRaw) {
                throw new Error('No initialization data available');
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/telegram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    initDataRaw: window.Telegram.WebApp.initDataRaw,
                    isMocked: process.env.NODE_ENV === 'development'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Authentication failed');
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
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Authentication error:', err);
        }
    }, [isReady]);

    // Cleanup function
    const cleanup = useCallback(() => {
        window.Telegram.WebApp.offEvent('mainButtonClicked', onAuthenticate);
        window.Telegram.WebApp.offEvent('themeChanged', onThemeChange);
        window.Telegram.WebApp.offEvent('viewportChanged', onViewportChange);
    }, [onAuthenticate, onThemeChange, onViewportChange]);

    // Effect to initialize and cleanup
    useEffect(() => {
        initializeTelegram();
        return cleanup;
    }, [initializeTelegram, cleanup]);

    return (
        <div className="telegram-auth">
            {!isReady ? (
                <div className="loading-container">
                    <p>Initializing Telegram Web App...</p>
                    {error && <div className="error-message">{error}</div>}
                </div>
            ) : !isAuthenticated ? (
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