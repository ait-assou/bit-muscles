import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';
interface MuscleChipProps {
  muscleId: string;
  type: 'primary' | 'secondary';
}

export const MuscleChip: React.FC<MuscleChipProps> = ({ muscleId, type }) => {
  const name = muscleId;
  const theme = useTheme();
  const styles = useMemo(() => useStyles(theme), [theme]);

  return (
    <View style={[styles.container, type === 'primary' ? styles.primary : styles.secondary]}>
      <Text style={[styles.text, type === 'primary' ? styles.primaryText : styles.secondaryText]}>
        {name}
      </Text>
    </View>
  );
};

const useStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  primary: {
    backgroundColor: theme.colors.primary + '20', // 20% opacity
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
  },
  secondary: {
    backgroundColor: theme.colors.border,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryText: {
    color: theme.colors.primary,
  },
  secondaryText: {
    color: theme.colors.textSecondary,
  },
});
