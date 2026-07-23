import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Dumbbell } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { Exercise } from '../../types';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { wgerApi } from '../../services/wgerApi';
import { ExerciseCard } from '../../components/ExerciseCard';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { workouts } = useWorkoutStore();

  const [workoutName, setWorkoutName] = useState('Workout');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkoutDetails() {
      setLoading(true);
      if (id.startsWith('template-')) {
        // Load Template Logic
        if (id === 'template-push') {
          setWorkoutName('Push Day');
          // Fetch some chest/shoulder/triceps exercises as a demo template
          const res = await Promise.all([
            wgerApi.getExercisesByMuscle('chest'),
            wgerApi.getExercisesByMuscle('front_delts'),
            wgerApi.getExercisesByMuscle('triceps')
          ]);
          setExercises([...res[0].slice(0, 2), ...res[1].slice(0, 2), ...res[2].slice(0, 2)]);
        } else if (id === 'template-pull') {
          setWorkoutName('Pull Day');
          const res = await Promise.all([
            wgerApi.getExercisesByMuscle('lats'),
            wgerApi.getExercisesByMuscle('biceps')
          ]);
          setExercises([...res[0].slice(0, 3), ...res[1].slice(0, 2)]);
        } else if (id === 'template-legs') {
          setWorkoutName('Leg Day');
          const res = await Promise.all([
            wgerApi.getExercisesByMuscle('quads'),
            wgerApi.getExercisesByMuscle('hamstrings')
          ]);
          setExercises([...res[0].slice(0, 3), ...res[1].slice(0, 3)]);
        } else {
          setWorkoutName('Full Body Beginner');
          const res = await wgerApi.getExercises();
          setExercises(res.slice(0, 8)); // Just 8 random for demo
        }
      } else {
        // Custom Workout Logic
        const customWorkout = workouts.find(w => w.id === id);
        if (customWorkout) {
          setWorkoutName(customWorkout.name);
          setExercises(customWorkout.exercises);
        } else {
          setWorkoutName('Workout Not Found');
        }
      }
      setLoading(false);
    }
    loadWorkoutDetails();
  }, [id, workouts]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{workoutName}</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      ) : exercises.length === 0 ? (
        <View style={styles.centerContainer}>
          <Dumbbell size={48} color={THEME.colors.border} style={{ marginBottom: 16 }} />
          <Text style={styles.emptyText}>No exercises found.</Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ExerciseCard exercise={item} onPress={() => router.push(`/exercise/${item.id}`)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  listContent: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: THEME.colors.textSecondary,
    fontSize: 16,
  },
});
