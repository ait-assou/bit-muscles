import React, { useMemo,  useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import { wgerApi } from '../../services/wgerApi';
import { Exercise } from '../../types';
import { useTheme } from '../../constants/theme';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { MuscleChip } from '../../components/MuscleChip';

export default function ExerciseDetailsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => useStyles(theme), [theme]);

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>{error || 'Exercise not found.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchExercise}>
          <RefreshCw color={theme.colors.background} size={20} style={{ marginRight: 8 }} />
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
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={theme.colors.text} size={24} />
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

const useStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl * 2,
  },
  backButton: {
    marginLeft: -8,
    padding: 8,
  },
  heroImage: {
    width: '100%',
    height: 250,
    backgroundColor: theme.colors.card,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginRight: theme.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
  },
  retryText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
