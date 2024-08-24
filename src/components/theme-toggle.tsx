'use client'

import React from 'react';
import { useTheme } from '@/src/context/themeContext';
import { DarkModeIcon } from '@/src/components/svg/theme/dark-mode-icon';
import { LightModeIcon } from '@/src/components/svg/theme/light-mode-icon';

const ThemeToggle: React.FC = () => {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-color_main text-color_text hover:bg-color_sec transition-colors"
            aria-label={darkMode ? "Enable light mode" : "Enable dark mode"}
        >
            {darkMode ? <DarkModeIcon className='fill-color_icons' /> : <LightModeIcon className='fill-color_icons' />}
        </button>
    );
};

export default ThemeToggle;