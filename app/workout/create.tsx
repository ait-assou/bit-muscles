import React, { useMemo,  useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Plus, Search, X, Dumbbell } from 'lucide-react-native';
import { useTheme } from '../../constants/theme';
import { Exercise, CustomWorkout } from '../../types';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { wgerApi } from '../../services/wgerApi';

export default function CreateWorkoutScreen() {
  const theme = useTheme();
  const styles = useMemo(() => useStyles(theme), [theme]);

  const router = useRouter();
  const { addWorkout } = useWorkoutStore();
  
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  
  // Search Modal State
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await wgerApi.searchExercises(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSaveWorkout = async () => {
    if (!workoutName.trim() || selectedExercises.length === 0) return;
    
    const newWorkout: CustomWorkout = {
      id: `workout_${Date.now()}`,
      name: workoutName.trim(),
      exercises: selectedExercises,
      createdAt: Date.now()
    };
    
    await addWorkout(newWorkout);
    router.back();
  };

  const addExercise = (exercise: Exercise) => {
    if (!selectedExercises.find(e => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
    setSearchModalVisible(false);
    setSearchQuery('');
  };

  const removeExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <ChevronLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>New Workout</Text>
          <TouchableOpacity 
            onPress={handleSaveWorkout} 
            disabled={!workoutName.trim() || selectedExercises.length === 0}
            style={styles.saveButton}
          >
            <Text style={[
              styles.saveText,
              (!workoutName.trim() || selectedExercises.length === 0) && styles.saveTextDisabled
            ]}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Workout Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Workout Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Ultimate Chest Day"
            placeholderTextColor={theme.colors.textSecondary}
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>

        {/* Selected Exercises */}
        <View style={styles.exercisesHeader}>
          <Text style={styles.label}>Exercises ({selectedExercises.length})</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setSearchModalVisible(true)}
          >
            <Plus size={16} color={theme.colors.primary} />
            <Text style={styles.addText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={selectedExercises}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.exerciseCard}>
              <View style={styles.exerciseInfo}>
                <Dumbbell size={20} color={theme.colors.primary} />
                <Text style={styles.exerciseName} numberOfLines={1}>{item.name}</Text>
              </View>
              <TouchableOpacity onPress={() => removeExercise(item.id)} style={styles.removeButton}>
                <X size={18} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Dumbbell size={40} color={theme.colors.textSecondary} style={{ marginBottom: 16 }} />
              <Text style={styles.emptyText}>No exercises added yet.</Text>
              <Text style={styles.emptySubText}>Tap "Add Exercise" to start building your workout.</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>

      {/* Search Modal */}
      <Modal
        visible={isSearchModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Find Exercise</Text>
            <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchBar}>
            <Search size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {isSearching ? (
            <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              contentContainerStyle={styles.searchList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.searchResultItem}
                  onPress={() => addExercise(item)}
                >
                  <Text style={styles.searchResultName}>{item.name}</Text>
                  <Plus size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                searchQuery.length > 0 ? (
                  <Text style={styles.noResultsText}>No exercises found.</Text>
                ) : null
              }
            />
          )}
        </SafeAreaView>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  saveTextDisabled: {
    color: theme.colors.textSecondary,
    opacity: 0.5,
  },
  inputContainer: {
    padding: theme.spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: 16,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  exerciseName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginTop: 40,
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalCancel: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    marginLeft: 8,
    fontSize: 16,
  },
  searchList: {
    paddingHorizontal: theme.spacing.md,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchResultName: {
    color: theme.colors.text,
    fontSize: 16,
    flex: 1,
  },
  loader: {
    marginTop: 40,
  },
  noResultsText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
