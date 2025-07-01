import { useState, useEffect } from 'react';
import { TelegramUser, TelegramWebApp } from '../types/telegram';

interface TelegramHook {
  user: TelegramUser | null;
  webApp: TelegramWebApp | null;
  isLoading: boolean;
  isInTelegram: boolean;
}

export const useTelegram = (): TelegramHook => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    const initTelegram = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        setWebApp(tg);
        setIsInTelegram(true);

        // Initialize the web app
        tg.ready();
        
        // Expand the web app to full height
        tg.expand();

        // Get user data from initDataUnsafe
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user);
        }

        // Apply Telegram theme
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
        document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');

        setIsLoading(false);
      } else {
        // Fallback for development/testing outside Telegram
        console.warn('Telegram WebApp not available. Running in development mode.');
        setIsInTelegram(false);
        setIsLoading(false);
        
        // Mock user data for development
        if (process.env.NODE_ENV === 'development') {
          setUser({
            id: 123456789,
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe',
            language_code: 'en',
            is_premium: false
          });
        }
      }
    };

    // Check if Telegram WebApp is already loaded
    if (window.Telegram?.WebApp) {
      initTelegram();
    } else {
      // Wait for the script to load
      const checkTelegram = setInterval(() => {
        if (window.Telegram?.WebApp) {
          initTelegram();
          clearInterval(checkTelegram);
        }
      }, 100);

      // Cleanup after 5 seconds if Telegram doesn't load
      setTimeout(() => {
        clearInterval(checkTelegram);
        if (!window.Telegram?.WebApp) {
          setIsLoading(false);
          setIsInTelegram(false);
        }
      }, 5000);
    }
  }, []);

  return {
    user,
    webApp,
    isLoading,
    isInTelegram
  };
};