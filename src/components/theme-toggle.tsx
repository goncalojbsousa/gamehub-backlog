'use client'

import React from 'react';
import { useTheme } from '@/src/context/themeContext';
import { DarkModeIcon } from '@/src/components/svg/theme/dark-mode-icon';
import { LightModeIcon } from '@/src/components/svg/theme/light-mode-icon';

/**
 * ThemeToggle component - Switches between light and dark mode
 * Uses theme context to manage and persist theme state
 * Provides accessible button with appropriate icon and label
 * 
 * @returns JSX element for theme toggle button
 */
const ThemeToggle: React.FC = () => {
    // Access theme state and toggle function from context
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-color_main text-color_text hover:bg-color_sec transition-colors focus:outline-none"
            aria-label={darkMode ? "Enable light mode" : "Enable dark mode"}
        >
            {/* Render icon based on current theme */}
            {darkMode ? <DarkModeIcon className='fill-color_icons' /> : <LightModeIcon className='fill-color_icons' />}
        </button>
    );
};

export default ThemeToggle;