import { Exercise, WgerResponse } from '../types';
import { muscleMap } from '../constants/muscleMap';

import * as FileSystem from 'expo-file-system/legacy';

const BASE_URL = 'https://wger.de/api/v2';
const CACHE = new Map<string, any>();
const CACHE_DIR = `${FileSystem.cacheDirectory}wger_data/`;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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

let isCacheDirChecked = false;
async function ensureCacheDir() {
  if (isCacheDirChecked) return;
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
  isCacheDirChecked = true;
}

function getCacheKey(url: string) {
  return url.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
}

interface CachePayload<T> {
  timestamp: number;
  data: T;
}

// Helper to handle API fetch with hybrid cache (Memory -> Disk -> Network)
async function fetchWger<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const urlParams = new URLSearchParams({ ...params, language: '2' }); // 2 = English
  const url = `${BASE_URL}${endpoint}?${urlParams.toString()}`;

  // 1. Memory Cache
  if (CACHE.has(url)) {
    return CACHE.get(url) as T;
  }

  // 2. Disk Cache
  await ensureCacheDir();
  const cacheFile = CACHE_DIR + getCacheKey(url);
  try {
    const info = await FileSystem.getInfoAsync(cacheFile);
    if (info.exists) {
      const diskData = await FileSystem.readAsStringAsync(cacheFile);
      const payload = JSON.parse(diskData) as CachePayload<T>;
      
      const isExpired = (Date.now() - payload.timestamp) > CACHE_TTL_MS;
      if (!isExpired) {
        CACHE.set(url, payload.data);
        return payload.data;
      }
    }
  } catch (e) {
    console.warn('Disk cache read failed for', url);
  }

  // 3. Network Fetch
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Wger API error: ${response.status}`);
    }
    const data = await response.json();
    
    // Save to memory
    CACHE.set(url, data);
    
    // Save to disk asynchronously
    const payload: CachePayload<T> = { timestamp: Date.now(), data };
    FileSystem.writeAsStringAsync(cacheFile, JSON.stringify(payload)).catch(e => 
      console.warn('Disk cache write failed', e)
    );
    
    return data;
  } catch (error) {
    // Fallback to expired disk cache if offline
    try {
      const info = await FileSystem.getInfoAsync(cacheFile);
      if (info.exists) {
        const diskData = await FileSystem.readAsStringAsync(cacheFile);
        const payload = JSON.parse(diskData) as CachePayload<T>;
        CACHE.set(url, payload.data);
        return payload.data;
      }
    } catch (fallbackError) {}
    
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
    const data = await fetchWger<WgerResponse<WgerExerciseInfo>>('/exerciseinfo/', { limit: '150' });
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
    
    // The Wger /exerciseinfo/ endpoint doesn't support searching by name directly.
    // We fetch the main list (which is instantly served from our hybrid cache) 
    // and perform a rich local search across names, categories, and muscles.
    const allExercises = await wgerApi.getExercises();
    const lowerQuery = query.toLowerCase();
    
    return allExercises.filter(ex => 
      ex.name.toLowerCase().includes(lowerQuery) || 
      ex.category.toLowerCase().includes(lowerQuery) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(lowerQuery)) ||
      ex.equipment.some(e => e.toLowerCase().includes(lowerQuery))
    );
  },
};
