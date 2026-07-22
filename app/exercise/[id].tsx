import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import { wgerApi } from '../../services/wgerApi';
import { Exercise } from '../../types';
import { THEME } from '../../constants/theme';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { MuscleChip } from '../../components/MuscleChip';

export default function ExerciseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercise = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wgerApi.getExercise(id);
      setExercise(data);
    } catch (err) {
      setError('Failed to load exercise details. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercise();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>{error || 'Exercise not found.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchExercise}>
          <RefreshCw color={THEME.colors.background} size={20} style={{ marginRight: 8 }} />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: exercise.name,
          headerStyle: { backgroundColor: THEME.colors.card },
          headerTintColor: THEME.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={THEME.colors.text} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {exercise.image ? (
          <Image
            source={{ uri: exercise.image }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{exercise.name}</Text>
            {exercise.difficulty && <DifficultyBadge difficulty={exercise.difficulty} />}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaValue}>{exercise.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Equipment</Text>
              <Text style={styles.metaValue}>
                {exercise.equipment.length > 0 ? exercise.equipment.join(', ') : 'Bodyweight'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Muscles Worked</Text>
            
            <Text style={styles.subSectionTitle}>Primary</Text>
            <View style={styles.chipRow}>
              {exercise.primaryMuscles.map((muscle) => (
                <MuscleChip key={`pri-${muscle}`} muscleId={muscle} type="primary" />
              ))}
            </View>

            {exercise.secondaryMuscles.length > 0 && (
              <>
                <Text style={styles.subSectionTitle}>Secondary</Text>
                <View style={styles.chipRow}>
                  {exercise.secondaryMuscles.map((muscle) => (
                    <MuscleChip key={`sec-${muscle}`} muscleId={muscle} type="secondary" />
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.description}>
              {exercise.description || 'No instructions provided for this exercise.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  scrollContent: {
    paddingBottom: THEME.spacing.xl * 2,
  },
  backButton: {
    marginLeft: -8,
    padding: 8,
  },
  heroImage: {
    width: '100%',
    height: 250,
    backgroundColor: THEME.colors.card,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: THEME.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  placeholderText: {
    color: THEME.colors.textSecondary,
    fontSize: 16,
  },
  content: {
    padding: THEME.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: THEME.colors.text,
    marginRight: THEME.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 16,
    color: THEME.colors.text,
    fontWeight: '500',
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.md,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.sm,
    marginTop: THEME.spacing.xs,
  },
  description: {
    fontSize: 16,
    color: THEME.colors.text,
    lineHeight: 24,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
  },
  errorText: {
    color: THEME.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.round,
    alignItems: 'center',
  },
  retryText: {
    color: THEME.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
