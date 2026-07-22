import { View, StyleSheet, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { useMuscleStore } from '../store/useMuscleStore';
import { FrontBody } from './FrontBody';
import { BackBody } from './BackBody';
import { THEME } from '../constants/theme';
import * as Haptics from 'expo-haptics';

export const MuscleBody = () => {
  const { bodyView, setBodyView } = useMuscleStore();
  const { height: screenHeight } = useWindowDimensions();

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
      <View style={[styles.bodyContainer, { maxHeight: screenHeight * 0.65 }]}>
        {bodyView === 'front' ? <FrontBody /> : <BackBody />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.round,
    padding: 2,
    marginBottom: THEME.spacing.sm,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.round,
  },
  activeToggle: {
    backgroundColor: THEME.colors.primary,
  },
  toggleText: {
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  activeToggleText: {
    color: THEME.colors.background,
  },
  bodyContainer: {
    width: '100%',
    aspectRatio: 300 / 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
