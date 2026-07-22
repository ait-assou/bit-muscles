import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Difficulty } from '../types';
import { THEME } from '../constants/theme';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const getStyle = () => {
    switch (difficulty) {
      case 'Beginner':
        return { bg: '#22c55e20', color: '#22c55e' };
      case 'Intermediate':
        return { bg: '#eab30820', color: '#eab308' };
      case 'Advanced':
        return { bg: '#ef444420', color: '#ef4444' };
      default:
        return { bg: THEME.colors.border, color: THEME.colors.textSecondary };
    }
  };

  const { bg, color } = getStyle();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>{difficulty}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: THEME.borderRadius.round,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
