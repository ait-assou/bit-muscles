import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
interface MuscleChipProps {
  muscleId: string;
  type: 'primary' | 'secondary';
}

export const MuscleChip: React.FC<MuscleChipProps> = ({ muscleId, type }) => {
  const name = muscleId;

  return (
    <View style={[styles.container, type === 'primary' ? styles.primary : styles.secondary]}>
      <Text style={[styles.text, type === 'primary' ? styles.primaryText : styles.secondaryText]}>
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: THEME.borderRadius.sm,
  },
  primary: {
    backgroundColor: THEME.colors.primary + '20', // 20% opacity
    borderWidth: 1,
    borderColor: THEME.colors.primary + '40',
  },
  secondary: {
    backgroundColor: THEME.colors.border,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryText: {
    color: THEME.colors.primary,
  },
  secondaryText: {
    color: THEME.colors.textSecondary,
  },
});
