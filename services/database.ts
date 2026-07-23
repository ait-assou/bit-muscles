import * as SQLite from 'expo-sqlite';
import { CustomWorkout, Exercise } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (db) return;
  db = await SQLite.openDatabaseAsync('bitmuscles.db');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      exercises TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );
  `);
};

export const database = {
  getWorkouts: async (): Promise<CustomWorkout[]> => {
    if (!db) await initDatabase();
    
    const allRows = await db!.getAllAsync('SELECT * FROM workouts ORDER BY createdAt DESC');
    
    return allRows.map((row: any) => ({
      id: row.id,
      name: row.name,
      exercises: JSON.parse(row.exercises) as Exercise[],
      createdAt: row.createdAt
    }));
  },

  createWorkout: async (workout: CustomWorkout): Promise<void> => {
    if (!db) await initDatabase();
    
    await db!.runAsync(
      'INSERT INTO workouts (id, name, exercises, createdAt) VALUES (?, ?, ?, ?)',
      workout.id,
      workout.name,
      JSON.stringify(workout.exercises),
      workout.createdAt
    );
  },

  deleteWorkout: async (id: string): Promise<void> => {
    if (!db) await initDatabase();
    await db!.runAsync('DELETE FROM workouts WHERE id = ?', id);
  },
};
