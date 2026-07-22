import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { RefreshCw } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { MuscleBody } from '../../components/MuscleBody';
import { useMuscleStore } from '../../store/useMuscleStore';
import { MemoizedExerciseCard } from '../../components/ExerciseCard';
import { wgerApi } from '../../services/wgerApi';
import { Exercise } from '../../types';

export default function HomeScreen() {
  const { selectedMuscles } = useMuscleStore();
  const router = useRouter();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    if (selectedMuscles.length === 0) {
      setExercises([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const allExercises: Exercise[] = [];
      for (const muscle of selectedMuscles) {
        const data = await wgerApi.getExercisesByMuscle(muscle);
        allExercises.push(...data);
      }
      
      // Deduplicate by ID
      const uniqueMap = new Map<string, Exercise>();
      allExercises.forEach(ex => uniqueMap.set(ex.id, ex));
      
      setExercises(Array.from(uniqueMap.values()));
    } catch (err) {
      setError('Failed to fetch exercises from Wger API.');
    } finally {
      setLoading(false);
    }
  }, [selectedMuscles]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const ListHeaderComponent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Bit-Muscles</Text>
        <Text style={styles.subtitle}>Know your muscles. Build your strength.</Text>
      </View>
      <MuscleBody />
      {selectedMuscles.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Exercises</Text>
          {!loading && !error && (
            <Text style={styles.sectionSubtitle}>
              {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'} found
            </Text>
          )}
        </View>
      )}
    </>
  );

  const ListEmptyComponent = () => {
    if (selectedMuscles.length === 0) return null;

    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Fetching exercises...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchExercises}>
            <RefreshCw color={THEME.colors.background} size={16} style={{ marginRight: 8 }} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No exercises found for this muscle.</Text>
        <Text style={styles.emptySubText}>Try another muscle group.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemoizedExerciseCard 
            exercise={item} 
            onPress={() => router.push(`/exercise/${item.id}`)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.xs,
    paddingBottom: THEME.spacing.xl,
  },
  header: {
    marginBottom: THEME.spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  sectionHeader: {
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: THEME.spacing.md,
    color: THEME.colors.textSecondary,
    fontSize: 16,
  },
  emptyText: {
    color: THEME.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubText: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: THEME.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.round,
    alignItems: 'center',
  },
  retryText: {
    color: THEME.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
