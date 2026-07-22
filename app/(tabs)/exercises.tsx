import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TextInput, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME } from '../../constants/theme';
import { MemoizedExerciseCard } from '../../components/ExerciseCard';
import { Search } from 'lucide-react-native';
import { wgerApi } from '../../services/wgerApi';
import { Exercise } from '../../types';

export default function ExercisesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        if (searchQuery.trim() === '') {
          const defaultExercises = await wgerApi.getExercises();
          setExercises(defaultExercises);
        } else {
          const results = await wgerApi.searchExercises(searchQuery);
          setExercises(results);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search color={THEME.colors.textSecondary} size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={THEME.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={THEME.colors.primary} style={styles.loader} />
      ) : (
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
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No exercises match your search.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    margin: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchIcon: {
    marginRight: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: THEME.colors.text,
    paddingVertical: THEME.spacing.md,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
  },
  loader: {
    marginTop: THEME.spacing.xl,
  },
  emptyText: {
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: THEME.spacing.xl,
    fontSize: 16,
  },
});
