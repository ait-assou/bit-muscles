import React, { useMemo,  useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, ChevronRight, Dumbbell, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../constants/theme';
import { useWorkoutStore } from '../../store/useWorkoutStore';

const TEMPLATES = [
  { id: 'template-push', name: 'Push Day', desc: 'Chest, Shoulders, Triceps', exercises: 6 },
  { id: 'template-pull', name: 'Pull Day', desc: 'Back, Biceps', exercises: 5 },
  { id: 'template-legs', name: 'Leg Day', desc: 'Quads, Hamstrings, Calves', exercises: 6 },
  { id: 'template-full', name: 'Full Body', desc: 'Beginner Routine', exercises: 8 },
];

export default function WorkoutsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => useStyles(theme), [theme]);

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
            <Plus size={20} color={theme.colors.background} />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        {/* My Workouts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Workouts</Text>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
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
                  <Dumbbell size={24} color={theme.colors.primary} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{workout.name}</Text>
                    <Text style={styles.cardSubtitle}>{workout.exercises.length} Exercises</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <TouchableOpacity 
                    onPress={() => handleDelete(workout.id, workout.name)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Trash2 size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                  <ChevronRight size={20} color={theme.colors.textSecondary} />
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
                <Dumbbell size={24} color={theme.colors.primary} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{template.name}</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {template.exercises} Exercises • {template.desc}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 4,
  },
  createButtonText: {
    color: theme.colors.background,
    fontWeight: '700',
    fontSize: 16,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  cardInfo: {
    gap: 4,
    flex: 1,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
});
