// components/TelegramAuth.jsx
import React, { useState, useEffect, useCallback } from 'react';

const TelegramAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [initDataStatus, setInitDataStatus] = useState(null);

    // Initialize Telegram Web App with proper error handling
    const initializeTelegram = useCallback(() => {
        try {
            // Wait for Telegram Web App to be available
            while (!window.Telegram) {
                console.log('Waiting for Telegram Web App...');
                setTimeout(() => {}, 100);
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

            // Check initialization data availability
            checkInitData();

            setIsReady(true);
        } catch (err) {
            setError('Failed to initialize Telegram Web App: ' + err.message);
            console.error('Initialization error:', err);
        }
    }, []);

    // Check initialization data
    const checkInitData = useCallback(() => {
        try {
            const initData = window.Telegram.WebApp.initData;
            const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;

            if (!initData) {
                throw new Error('No initialization data available');
            }

            setInitDataStatus({
                hasInitData: true,
                initDataLength: initData.length,
                isExpanded: window.Telegram.WebApp.isExpanded,
                isActive: window.Telegram.WebApp.isActive
            });
        } catch (err) {
            setInitDataStatus({
                hasInitData: false,
                error: err.message
            });
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
                    {initDataStatus && (
                        <div className="init-data-status">
                            <h3>Initialization Data Status:</h3>
                            {initDataStatus.hasInitData ? (
                                <ul>
                                    <li>Initialization data available</li>
                                    <li>Data length: {initDataStatus.initDataLength}</li>
                                    <li>App expanded: {initDataStatus.isExpanded ? 'Yes' : 'No'}</li>
                                    <li>App active: {initDataStatus.isActive ? 'Yes' : 'No'}</li>
                                </ul>
                            ) : (
                                <p>Error: {initDataStatus.error}</p>
                            )}
                        </div>
                    )}
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