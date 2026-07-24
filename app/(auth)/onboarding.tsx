import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dumbbell, Activity, Target } from 'lucide-react-native';
import { useTheme } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Welcome to Bit Muscles',
    description: 'Your ultimate fitness companion. Track, analyze, and optimize your workouts all in one place.',
    icon: (color: string) => <Dumbbell size={80} color={color} />
  },
  {
    id: '2',
    title: 'Interactive Anatomy',
    description: 'Tap on any muscle to instantly find the best exercises for targeting it and building strength.',
    icon: (color: string) => <Activity size={80} color={color} />
  },
  {
    id: '3',
    title: 'Achieve Your Goals',
    description: 'Use custom templates, track your progress over time, and crush your fitness targets.',
    icon: (color: string) => <Target size={80} color={color} />
  }
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const styles = useMemo(() => useStyles(theme), [theme]);
  const router = useRouter();
  const completeOnboarding = useAuthStore(state => state.completeOnboarding);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
      router.replace('/(auth)/login');
    }
  };

  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / width));
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.colors.gradient} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.iconContainer}>
                {item.icon(theme.colors.primary)}
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
        
        <View style={styles.footer}>
          <View style={styles.pagination}>
            {SLIDES.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  currentIndex === index && styles.activeDot
                ]} 
              />
            ))}
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.buttonText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const useStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  slide: {
    width,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xl * 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: '700',
  },
});
