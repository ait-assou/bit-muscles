import { View, StyleSheet, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { useMuscleStore } from '../store/useMuscleStore';
import { FrontBody } from './FrontBody';
import { BackBody } from './BackBody';
import { useTheme } from '../constants/theme';
import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';

export const MuscleBody = () => {
  const { bodyView, setBodyView } = useMuscleStore();
  const { height: screenHeight } = useWindowDimensions();
  const theme = useTheme();
  const styles = useMemo(() => useStyles(theme), [theme]);

  const handleToggle = (view: 'front' | 'back') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBodyView(view);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, bodyView === 'front' && styles.activeToggle]}
          onPress={() => handleToggle('front')}
        >
          <Text style={[styles.toggleText, bodyView === 'front' && styles.activeToggleText]}>
            Front
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, bodyView === 'back' && styles.activeToggle]}
          onPress={() => handleToggle('back')}
        >
          <Text style={[styles.toggleText, bodyView === 'back' && styles.activeToggleText]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.bodyContainer, { maxHeight: screenHeight * 0.60 }]}>
        {bodyView === 'front' ? <FrontBody /> : <BackBody />}
      </View>
    </View>
  );
};

const useStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xs,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.round,
    padding: 2,
    marginBottom: theme.spacing.sm,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.round,
  },
  activeToggle: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  activeToggleText: {
    color: theme.colors.background,
  },
  bodyContainer: {
    width: '100%',
    aspectRatio: 300 / 520,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
