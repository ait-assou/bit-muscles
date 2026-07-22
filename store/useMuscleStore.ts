import { create } from 'zustand';

interface MuscleState {
  selectedMuscles: string[];
  bodyView: 'front' | 'back';
  toggleMuscle: (id: string) => void;
  clearSelection: () => void;
  setBodyView: (view: 'front' | 'back') => void;
}

export const useMuscleStore = create<MuscleState>((set) => ({
  selectedMuscles: [],
  bodyView: 'front',
  toggleMuscle: (id) =>
    set((state) => {
      const isSelected = state.selectedMuscles.includes(id);
      return {
        selectedMuscles: isSelected
          ? state.selectedMuscles.filter((mId) => mId !== id)
          : [...state.selectedMuscles, id],
      };
    }),
  clearSelection: () => set({ selectedMuscles: [] }),
  setBodyView: (view) => set({ bodyView: view }),
}));
