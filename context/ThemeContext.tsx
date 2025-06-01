import { ThemeColors, darkColors, lightColors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: ThemeColors;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightColors,
  mode: 'system',
  setMode: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() || 'light';
  const [mode, setMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<ThemeColors>(systemColorScheme === 'dark' ? darkColors : lightColors);

  useEffect(() => {
    // Load saved theme preference
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('themeMode');
        if (savedMode) {
          setMode(savedMode as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme mode', error);
      }
    };

    loadThemeMode();
  }, []);

  useEffect(() => {
    // Apply theme based on mode
    let newTheme: ThemeColors;
    
    if (mode === 'system') {
      newTheme = systemColorScheme === 'dark' ? darkColors : lightColors;
    } else {
      newTheme = mode === 'dark' ? darkColors : lightColors;
    }
    
    setTheme(newTheme);
    
    // Save theme preference
    const saveThemeMode = async () => {
      try {
        await AsyncStorage.setItem('themeMode', mode);
      } catch (error) {
        console.error('Failed to save theme mode', error);
      }
    };
    
    saveThemeMode();
  }, [mode, systemColorScheme]);

  const isDark = theme === darkColors;

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};