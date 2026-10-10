import React, { createContext, useContext, useState, useMemo } from 'react';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: LIGHT_COLORS,
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const colors = useMemo(() => {
    return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  }, [isDarkMode]);

  const value = useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
      colors,
    }),
    [isDarkMode, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
