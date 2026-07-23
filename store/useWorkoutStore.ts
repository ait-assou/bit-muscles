import { create } from 'zustand';
import { CustomWorkout } from '../types';
import { database } from '../services/database';

interface WorkoutState {
  workouts: CustomWorkout[];
  isLoading: boolean;
  error: string | null;
  loadWorkouts: () => Promise<void>;
  addWorkout: (workout: CustomWorkout) => Promise<void>;
  removeWorkout: (id: string) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  isLoading: false,
  error: null,
  
  loadWorkouts: async () => {
    set({ isLoading: true, error: null });
    try {
      const workouts = await database.getWorkouts();
      set({ workouts, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load workouts', isLoading: false });
      console.error('Error loading workouts:', error);
    }
  },

  addWorkout: async (workout: CustomWorkout) => {
    try {
      await database.createWorkout(workout);
      set((state) => ({
        workouts: [workout, ...state.workouts]
      }));
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  },

  removeWorkout: async (id: string) => {
    try {
      await database.deleteWorkout(id);
      set((state) => ({
        workouts: state.workouts.filter(w => w.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }
}));
