import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Exercise } from '../types';
import { THEME } from '../constants/theme';
import { DifficultyBadge } from './DifficultyBadge';
import { MuscleChip } from './MuscleChip';
import { ChevronRight } from 'lucide-react-native';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        {exercise.image && (
          <Image
            source={{ uri: exercise.image }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        )}
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{exercise.name}</Text>
              <Text style={styles.category}>{exercise.category}</Text>
              <Text style={styles.equipment}>
                {exercise.equipment.length > 0 ? exercise.equipment.join(', ') : 'Bodyweight'}
              </Text>
            </View>
            <View style={styles.arrowContainer}>
              <ChevronRight color={THEME.colors.primary} size={24} />
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.musclesContainer}>
              <Text style={styles.sectionTitle}>Primary</Text>
              <View style={styles.chipRow}>
                {exercise.primaryMuscles.map((muscle) => (
                  <MuscleChip key={`pri-${muscle}`} muscleId={muscle} type="primary" />
                ))}
              </View>

              {exercise.secondaryMuscles.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Secondary</Text>
                  <View style={styles.chipRow}>
                    {exercise.secondaryMuscles.map((muscle) => (
                      <MuscleChip key={`sec-${muscle}`} muscleId={muscle} type="secondary" />
                    ))}
                  </View>
                </>
              )}
            </View>
            {exercise.difficulty && (
              <View style={styles.badgeContainer}>
                <DifficultyBadge difficulty={exercise.difficulty} />
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

// React.memo to prevent unnecessary re-renders in FlatList
export const MemoizedExerciseCard = React.memo(ExerciseCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: THEME.colors.background,
  },
  cardContent: {
    padding: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    paddingRight: THEME.spacing.sm,
  },
  title: {
    color: THEME.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  category: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  equipment: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  musclesContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.xs,
  },
  badgeContainer: {
    marginLeft: THEME.spacing.md,
  },
});
