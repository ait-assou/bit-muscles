import { useMemo } from 'react';
import { useThemeStore } from '../store/useThemeStore';

const darkColors = {
  background: '#111827',
  card: '#1F2937',
  primary: '#4ADE80',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#374151',
  muscleDefault: '#374151',
  surface: '#030712',
  error: '#EF4444',
  gradient: ['#1F2937', '#111827'] as readonly [string, string, ...string[]],
};

const lightColors = {
  background: '#F2F2F7',
  card: '#FFFFFF',
  primary: '#2E8B57', // Sea green for better contrast in light mode
  text: '#000000',
  textSecondary: '#3C3C43', // Darker gray for iOS light mode
  border: '#E5E5EA',
  muscleDefault: '#D1D1D6',
  surface: '#FFFFFF',
  error: '#FF3B30',
  gradient: ['#FFFFFF', '#F2F2F7'] as readonly [string, string, ...string[]],
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
