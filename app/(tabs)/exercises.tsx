import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo,  useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TextInput, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/theme';
import { MemoizedExerciseCard } from '../../components/ExerciseCard';
import { Search } from 'lucide-react-native';
import { wgerApi } from '../../services/wgerApi';
import { Exercise } from '../../types';

export default function ExercisesScreen() {
  const theme = useTheme();
  const styles = useMemo(() => useStyles(theme), [theme]);

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
        <Search color={theme.colors.textSecondary} size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
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

const useStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  loader: {
    marginTop: theme.spacing.xl,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    fontSize: 16,
  },
});
