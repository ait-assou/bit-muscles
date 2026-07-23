import { useThemeStore } from '../store/useThemeStore';
import { useMemo } from 'react';

const darkColors = {
  background: '#000000',
  card: '#1C1C1E',
  primary: '#4ADE80',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#2C2C2E',
  muscleDefault: '#333333',
  surface: '#121212',
  error: '#FF453A',
};

const lightColors = {
  background: '#F2F2F7',
  card: '#FFFFFF',
  primary: '#34C759', // Slightly darker green for light mode contrast
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  muscleDefault: '#D1D1D6',
  surface: '#FFFFFF',
  error: '#FF3B30',
};

export const THEME = {
  colors: darkColors, // Temporary fallback for backward compatibility during refactor
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
};

export const useTheme = () => {
  const { theme } = useThemeStore();
  
  const colors = useMemo(() => {
    return theme === 'dark' ? darkColors : lightColors;
  }, [theme]);

  return {
    colors,
    theme,
    spacing: THEME.spacing,
    borderRadius: THEME.borderRadius,
  };
};
