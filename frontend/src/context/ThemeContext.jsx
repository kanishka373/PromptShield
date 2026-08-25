import { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  'dark-neon': {
    name: 'Dark Neon',
    emoji: '🌑',
    '--bg-dark': '#0A0A0F',
    '--bg-surface': '#111118',
    '--bg-card': '#16161F',
    '--bg-border': '#1E1E2E',
    '--color-primary': '#7C3AED',
    '--color-primary-rgb': '124, 58, 237',
    '--color-accent': '#06B6D4',
    '--color-accent-rgb': '6, 182, 212',
  },
  'cyber-red': {
    name: 'Cyber Red',
    emoji: '🔴',
    '--bg-dark': '#0D0A0A',
    '--bg-surface': '#130E0E',
    '--bg-card': '#1A1010',
    '--bg-border': '#2E1E1E',
    '--color-primary': '#EF4444',
    '--color-primary-rgb': '239, 68, 68',
    '--color-accent': '#F97316',
    '--color-accent-rgb': '249, 115, 22',
  },
  'midnight-blue': {
    name: 'Midnight Blue',
    emoji: '🔵',
    '--bg-dark': '#0A0A1A',
    '--bg-surface': '#0E0E1F',
    '--bg-card': '#121228',
    '--bg-border': '#1E1E3E',
    '--color-primary': '#3B82F6',
    '--color-primary-rgb': '59, 130, 246',
    '--color-accent': '#8B5CF6',
    '--color-accent-rgb': '139, 92, 246',
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('ps_theme') || 'dark-neon');

  useEffect(() => {
    const t = themes[activeTheme];
    const root = document.documentElement;
    Object.entries(t).forEach(([key, val]) => {
      if (key.startsWith('--')) root.style.setProperty(key, val);
    });
    localStorage.setItem('ps_theme', activeTheme);
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);