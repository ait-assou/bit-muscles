import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, ChevronRight, Dumbbell, Trash2 } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { useWorkoutStore } from '../../store/useWorkoutStore';

const TEMPLATES = [
  { id: 'template-push', name: 'Push Day (Chest, Shoulders, Triceps)', exercises: 6 },
  { id: 'template-pull', name: 'Pull Day (Back, Biceps)', exercises: 5 },
  { id: 'template-legs', name: 'Leg Day (Quads, Hamstrings, Calves)', exercises: 6 },
  { id: 'template-full', name: 'Full Body Beginner', exercises: 8 },
];

export default function WorkoutsScreen() {
  const router = useRouter();
  const { workouts, isLoading, loadWorkouts, removeWorkout } = useWorkoutStore();

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Workout',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeWorkout(id) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/workout/create')}
            activeOpacity={0.7}
          >
            <Plus size={20} color={THEME.colors.background} />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        {/* My Workouts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Workouts</Text>
          {isLoading ? (
            <ActivityIndicator color={THEME.colors.primary} style={{ marginTop: 20 }} />
          ) : workouts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>You haven't created any custom workouts yet.</Text>
            </View>
          ) : (
            workouts.map(workout => (
              <TouchableOpacity 
                key={workout.id} 
                style={styles.card}
                onPress={() => router.push(`/workout/${workout.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Dumbbell size={24} color={THEME.colors.primary} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{workout.name}</Text>
                    <Text style={styles.cardSubtitle}>{workout.exercises.length} Exercises</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <TouchableOpacity 
                    onPress={() => handleDelete(workout.id, workout.name)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Trash2 size={20} color={THEME.colors.error} />
                  </TouchableOpacity>
                  <ChevronRight size={20} color={THEME.colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Curated Templates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Curated Templates</Text>
          {TEMPLATES.map(template => (
            <TouchableOpacity 
              key={template.id} 
              style={styles.card}
              onPress={() => router.push(`/workout/${template.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Dumbbell size={24} color={THEME.colors.primary} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{template.name}</Text>
                  <Text style={styles.cardSubtitle}>{template.exercises} Exercises</Text>
                </View>
              </View>
              <ChevronRight size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
    marginTop: THEME.spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
    gap: 4,
  },
  createButtonText: {
    color: THEME.colors.background,
    fontWeight: '700',
    fontSize: 16,
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  cardInfo: {
    gap: 4,
  },
  cardTitle: {
    color: THEME.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: THEME.colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
});
