import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      document.documentElement.classList.toggle('dark', darkMode);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  // Explicit setter so UI can choose light/dark directly
  const setTheme = (mode) => {
    if (mode === 'dark') setDarkMode(true);
    else if (mode === 'light') setDarkMode(false);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
