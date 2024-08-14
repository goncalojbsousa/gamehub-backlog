'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // CHECK FAVOURITE THEME
    const checkTheme = () => {
      const storedTheme = localStorage.getItem('darkMode');
      if (storedTheme !== null) {
        return storedTheme === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    // INIT THEME
    const isDark = checkTheme();
    setDarkMode(isDark);
    updateTheme(isDark);

    // CHECK CHANGES ON SYSTEM THEME
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
        updateTheme(e.matches);
      }
    };
    mediaQuery.addListener(handleChange);

    // CLEANUP
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const updateTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    updateTheme(newDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};