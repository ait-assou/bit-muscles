import { Exercise, WgerResponse } from '../types';
import { muscleMap } from '../constants/muscleMap';

const BASE_URL = 'https://wger.de/api/v2';
const CACHE = new Map<string, any>();

// Interfaces specific to the /exerciseinfo/ endpoint
interface WgerExerciseInfo {
  id: number;
  category: { id: number; name: string };
  muscles: { id: number; name: string; name_en: string }[];
  muscles_secondary: { id: number; name: string; name_en: string }[];
  equipment: { id: number; name: string }[];
  images: { id: number; image: string; is_main: boolean }[];
  translations: { id: number; language: number; name: string; description: string }[];
}

// Helper to handle API fetch with cache
async function fetchWger<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const urlParams = new URLSearchParams({ ...params, language: '2' }); // 2 = English
  const url = `${BASE_URL}${endpoint}?${urlParams.toString()}`;

  if (CACHE.has(url)) {
    return CACHE.get(url) as T;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Wger API error: ${response.status}`);
    }
    const data = await response.json();
    CACHE.set(url, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${url}`, error);
    throw error;
  }
}

function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

// Format the comprehensive /exerciseinfo/ response into our UI Exercise object
function formatWgerExerciseInfo(raw: WgerExerciseInfo): Exercise {
  // Find English translation (language = 2)
  const translation = raw.translations.find((t) => t.language === 2) || raw.translations[0];

  let imageUrl = null;
  if (raw.images && raw.images.length > 0) {
    const mainImage = raw.images.find((i) => i.is_main) || raw.images[0];
    imageUrl = mainImage.image;
  }

  // Use name_en if available, fallback to scientific name
  const getMuscleName = (m: { name_en: string; name: string }) => m.name_en || m.name || 'Unknown';

  return {
    id: raw.id.toString(),
    name: translation?.name || 'Unnamed Exercise',
    image: imageUrl,
    description: stripHtml(translation?.description),
    category: raw.category?.name || 'Unknown',
    primaryMuscles: raw.muscles.map(getMuscleName),
    secondaryMuscles: raw.muscles_secondary.map(getMuscleName),
    equipment: raw.equipment.map((e) => e.name),
    difficulty: undefined, // Wger API does not provide a standard difficulty rating natively
  };
}

export const wgerApi = {
  getExercises: async (): Promise<Exercise[]> => {
    // /exerciseinfo/ provides all nested data directly
    const data = await fetchWger<WgerResponse<WgerExerciseInfo>>('/exerciseinfo/', { limit: '60' });
    const formatted = data.results.map(formatWgerExerciseInfo);
    return formatted.filter(ex => ex.image !== null);
  },

  getExercise: async (id: string): Promise<Exercise> => {
    const raw = await fetchWger<WgerExerciseInfo>(`/exerciseinfo/${id}/`);
    return formatWgerExerciseInfo(raw);
  },

  getExercisesByMuscle: async (muscleKey: string): Promise<Exercise[]> => {
    const wgerMuscleId = muscleMap[muscleKey];
    if (!wgerMuscleId) return [];

    const data = await fetchWger<WgerResponse<WgerExerciseInfo>>('/exerciseinfo/', {
      muscles: wgerMuscleId.toString(),
      limit: '60',
    });
    const formatted = data.results.map(formatWgerExerciseInfo);
    return formatted.filter(ex => ex.image !== null);
  },

  searchExercises: async (query: string): Promise<Exercise[]> => {
    if (!query) return [];
    
    // /exerciseinfo/ does not have a direct search query natively, but we can query by name
    const data = await fetchWger<WgerResponse<WgerExerciseInfo>>('/exerciseinfo/', {
      name: query,
      limit: '60',
    });
    const formatted = data.results.map(formatWgerExerciseInfo);
    return formatted.filter(ex => ex.image !== null);
  },
};
