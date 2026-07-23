import { useFonts } from 'expo-font';
import { Stack, useSegments, useRouter } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';


import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  const hasFinishedOnboarding = useAuthStore(state => state.hasFinishedOnboarding);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const guestSessionStart = useAuthStore(state => state.guestSessionStart);

  useEffect(() => {
    if (!hasHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isGuestActive = guestSessionStart && (Date.now() - guestSessionStart < 24 * 60 * 60 * 1000);
    const hasAccess = isAuthenticated || isGuestActive;

    if (!hasFinishedOnboarding) {
      if (segments[1] !== 'onboarding') {
        router.replace('/(auth)/onboarding');
      }
    } else if (!hasAccess) {
      if (segments[1] !== 'login') {
        router.replace('/(auth)/login');
      }
    } else if (inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [hasHydrated, hasFinishedOnboarding, isAuthenticated, guestSessionStart, segments]);

  if (!hasHydrated) {
    return null; // Or a splash screen
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
