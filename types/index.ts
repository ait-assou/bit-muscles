export interface Muscle {
  id: string;
  name: string;
  svgId: string;
  side: 'front' | 'back';
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

// Standardized UI Exercise Object
export interface Exercise {
  id: string;
  name: string;
  image: string | null;
  description: string;
  primaryMuscles: string[]; // Names resolved from IDs
  secondaryMuscles: string[]; // Names resolved from IDs
  equipment: string[]; // Names resolved from IDs
  category: string; // Name resolved from ID
  difficulty?: Difficulty;
}

// Wger API Raw Responses
export interface WgerExercise {
  id: number;
  name: string;
  description: string;
  category: number;
  muscles: number[];
  muscles_secondary: number[];
  equipment: number[];
}

export interface WgerImage {
  id: number;
  exercise_base: number;
  image: string;
  is_main: boolean;
}

export interface WgerCategory {
  id: number;
  name: string;
}

export interface WgerEquipment {
  id: number;
  name: string;
}

export interface WgerMuscle {
  id: number;
  name: string;
  name_en: string;
}

export interface WgerResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CustomWorkout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: number;
}
