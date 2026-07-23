import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useMuscleStore } from '../store/useMuscleStore';
import { THEME } from '../constants/theme';
import * as Haptics from 'expo-haptics';

interface BackBodyProps {
  width?: number | string;
  height?: number | string;
}

export const BackBody: React.FC<BackBodyProps> = ({ width = '100%', height = '100%' }) => {
  const { selectedMuscles, toggleMuscle } = useMuscleStore();

  const handlePress = (id: string) => {
    Haptics.selectionAsync();
    toggleMuscle(id);
  };

  const getFill = (id: string) => {
    return selectedMuscles.includes(id) ? THEME.colors.primary : THEME.colors.muscleDefault;
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 300 520">
      {/* Head */}
      <Path
        d="M130 20 C130 0, 170 0, 170 20 L170 60 C170 80, 130 80, 130 60 Z"
        fill="#222"
      />
      {/* Traps */}
      <Path
        id="traps"
        d="M120 70 L180 70 L160 100 L140 100 Z"
        fill={getFill('traps')}
        onPress={() => handlePress('traps')}
      />
      {/* Rear Delts Left */}
      <Path
        id="rear_delts"
        d="M80 80 L110 80 L110 110 L80 110 Z"
        fill={getFill('rear_delts')}
        onPress={() => handlePress('rear_delts')}
      />
      {/* Rear Delts Right */}
      <Path
        d="M190 80 L220 80 L220 110 L190 110 Z"
        fill={getFill('rear_delts')}
        onPress={() => handlePress('rear_delts')}
      />
      {/* Lats Left */}
      <Path
        id="lats"
        d="M100 110 L130 110 L130 180 L100 180 Z"
        fill={getFill('lats')}
        onPress={() => handlePress('lats')}
      />
      {/* Lats Right */}
      <Path
        d="M170 110 L200 110 L200 180 L170 180 Z"
        fill={getFill('lats')}
        onPress={() => handlePress('lats')}
      />
      {/* Rhomboids */}
      <Path
        id="rhomboids"
        d="M130 110 L170 110 L170 140 L130 140 Z"
        fill={getFill('rhomboids')}
        onPress={() => handlePress('rhomboids')}
      />
      {/* Lower Back */}
      <Path
        id="lower_back"
        d="M120 180 L180 180 L180 230 L120 230 Z"
        fill={getFill('lower_back')}
        onPress={() => handlePress('lower_back')}
      />
      {/* Triceps Left */}
      <Path
        id="triceps"
        d="M80 120 L100 120 L95 180 L80 180 Z"
        fill={getFill('triceps')}
        onPress={() => handlePress('triceps')}
      />
      {/* Triceps Right */}
      <Path
        d="M200 120 L220 120 L220 180 L205 180 Z"
        fill={getFill('triceps')}
        onPress={() => handlePress('triceps')}
      />
      {/* Glutes Left */}
      <Path
        id="glutes"
        d="M110 240 L145 240 L140 300 L115 300 Z"
        fill={getFill('glutes')}
        onPress={() => handlePress('glutes')}
      />
      {/* Glutes Right */}
      <Path
        d="M155 240 L190 240 L185 300 L160 300 Z"
        fill={getFill('glutes')}
        onPress={() => handlePress('glutes')}
      />
      {/* Hamstrings Left */}
      <Path
        id="hamstrings"
        d="M115 310 L140 310 L135 400 L120 400 Z"
        fill={getFill('hamstrings')}
        onPress={() => handlePress('hamstrings')}
      />
      {/* Hamstrings Right */}
      <Path
        d="M160 310 L185 310 L180 400 L165 400 Z"
        fill={getFill('hamstrings')}
        onPress={() => handlePress('hamstrings')}
      />
      {/* Calves Left */}
      <Path
        id="calves_back"
        d="M115 420 L135 420 L130 520 L120 520 Z"
        fill={getFill('calves_back')}
        onPress={() => handlePress('calves_back')}
      />
      {/* Calves Right */}
      <Path
        d="M165 420 L185 420 L180 520 L170 520 Z"
        fill={getFill('calves_back')}
        onPress={() => handlePress('calves_back')}
      />
    </Svg>
  );
};
