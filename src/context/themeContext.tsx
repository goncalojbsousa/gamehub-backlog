'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Type definition for theme context
 * Defines the shape of theme-related state and methods
 */
type ThemeContextType = {
  darkMode: boolean;        // Current theme state (true = dark, false = light)
  toggleDarkMode: () => void; // Function to switch between themes
};

/**
 * Theme context instance
 * Provides theme state management throughout the application
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component - Manages application theme state
 * Handles theme persistence, system preference detection, and theme switching
 * Provides dark/light mode functionality with localStorage persistence
 * 
 * @param children - React components to be wrapped with theme context
 * @returns Context provider with theme state management
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state management
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false); // Prevents hydration mismatch

  useEffect(() => {
    /**
     * Checks for user's preferred theme from localStorage or system preference
     * Falls back to light mode if no preference is stored or localStorage is unavailable
     * 
     * @returns boolean indicating if dark mode should be enabled
     */
    const checkTheme = () => {
      try {
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme !== null) {
          return storedTheme === 'true';
        }
        // Fall back to system preference if no stored preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch (e) {
        return false; // Default to light mode if localStorage is not available
      }
    };

    // Initialize theme based on stored preference or system setting
    const isDark = checkTheme();
    setDarkMode(isDark);
    updateTheme(isDark);
    setMounted(true);

    /**
     * Listens for system theme changes and updates accordingly
     * Only applies system changes if user hasn't set a manual preference
     */
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem('darkMode') === null) {
          setDarkMode(e.matches);
          updateTheme(e.matches);
        }
      } catch (e) {
        // Ignore errors if localStorage is not available
      }
    };
    mediaQuery.addListener(handleChange);

    // Cleanup: remove event listener when component unmounts
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  /**
   * Updates the document's theme attribute to apply CSS custom properties
   * Applies dark theme by setting data-theme attribute, removes it for light theme
   * 
   * @param isDark - Boolean indicating if dark mode should be applied
   */
  const updateTheme = (isDark: boolean) => {
    try {
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } catch (e) {
      // Ignore errors if document is not available (SSR)
    }
  };

  /**
   * Toggles between light and dark themes
   * Updates state, persists preference to localStorage, and applies theme changes
   */
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    try {
      localStorage.setItem('darkMode', newDarkMode.toString());
    } catch (e) {
      // Ignore errors if localStorage is not available
    }
    updateTheme(newDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme context
 * Provides easy access to theme state and toggle function
 * Throws error if used outside of ThemeProvider
 * 
 * @returns ThemeContextType object with current theme state and toggle function
 * @throws Error if used outside of ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};