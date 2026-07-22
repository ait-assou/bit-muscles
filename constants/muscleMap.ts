// Maps our internal SVG body part IDs to Wger API muscle IDs.
// Wger Muscle IDs:
// 1: Biceps brachii
// 2: Anterior deltoid
// 3: Serratus anterior
// 4: Pectoralis major
// 5: Triceps brachii
// 6: Rectus abdominis
// 7: Gastrocnemius
// 8: Gluteus maximus
// 9: Trapezius
// 10: Quadriceps femoris
// 11: Biceps femoris
// 12: Latissimus dorsi
// 13: Brachialis
// 14: Obliquus externus abdominis
// 15: Soleus

export const muscleMap: Record<string, number> = {
  chest: 4,
  upper_chest: 4,
  abs: 6,
  obliques: 14,
  front_delts: 2,
  side_delts: 2, // Map to anterior deltoid
  rear_delts: 2,
  biceps: 1,
  triceps: 5,
  forearms_front: 13, // Brachialis
  forearms_back: 13,
  quads: 10,
  hamstrings: 11,
  glutes: 8,
  calves_front: 7,
  calves_back: 7,
  upper_back: 9, // Trapezius
  lats: 12,
  lower_back: 12, // Wger doesn't have erector spinae by default, map to lats for now
  adductors: 10, // Map to quads
};
