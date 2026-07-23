import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as FileSystem from 'expo-file-system/legacy';

const fileSystemStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const uri = `${FileSystem.documentDirectory}${name}.json`;
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) return null;
      return await FileSystem.readAsStringAsync(uri);
    } catch (e) {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}${name}.json`, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${name}.json`, { idempotent: true });
  },
};

interface AuthState {
  hasHydrated: boolean;
  hasFinishedOnboarding: boolean;
  isAuthenticated: boolean;
  guestSessionStart: number | null;
  
  completeOnboarding: () => void;
  login: () => void;
  logout: () => void;
  startGuestSession: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      hasFinishedOnboarding: false,
      isAuthenticated: false,
      guestSessionStart: null,

      completeOnboarding: () => set({ hasFinishedOnboarding: true }),
      login: () => set({ isAuthenticated: true, guestSessionStart: null }),
      logout: () => set({ isAuthenticated: false, guestSessionStart: null }),
      startGuestSession: () => set({ guestSessionStart: Date.now() }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => fileSystemStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
