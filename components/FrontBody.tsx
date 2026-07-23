import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useMuscleStore } from '../store/useMuscleStore';
import { THEME } from '../constants/theme';
import * as Haptics from 'expo-haptics';

interface FrontBodyProps {
  width?: number | string;
  height?: number | string;
}

export const FrontBody: React.FC<FrontBodyProps> = ({ width = '100%', height = '100%' }) => {
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
      {/* Chest */}
      <Path
        id="chest"
        d="M110 90 L190 90 L190 150 L110 150 Z"
        fill={getFill('chest')}
        onPress={() => handlePress('chest')}
      />
      {/* Upper Chest */}
      <Path
        id="upper_chest"
        d="M120 70 L180 70 L180 90 L120 90 Z"
        fill={getFill('upper_chest')}
        onPress={() => handlePress('upper_chest')}
      />
      {/* Abs */}
      <Path
        id="abs"
        d="M130 160 L170 160 L170 250 L130 250 Z"
        fill={getFill('abs')}
        onPress={() => handlePress('abs')}
      />
      {/* Obliques Left */}
      <Path
        id="obliques"
        d="M110 160 L125 160 L125 250 L110 250 Z"
        fill={getFill('obliques')}
        onPress={() => handlePress('obliques')}
      />
      {/* Obliques Right */}
      <Path
        d="M175 160 L190 160 L190 250 L175 250 Z"
        fill={getFill('obliques')}
        onPress={() => handlePress('obliques')}
      />
      {/* Front Delts Left */}
      <Path
        id="front_delts"
        d="M80 80 L110 80 L110 110 L80 110 Z"
        fill={getFill('front_delts')}
        onPress={() => handlePress('front_delts')}
      />
      {/* Front Delts Right */}
      <Path
        d="M190 80 L220 80 L220 110 L190 110 Z"
        fill={getFill('front_delts')}
        onPress={() => handlePress('front_delts')}
      />
      {/* Side Delts Left */}
      <Path
        id="side_delts"
        d="M70 80 L80 80 L80 110 L70 110 Z"
        fill={getFill('side_delts')}
        onPress={() => handlePress('side_delts')}
      />
      {/* Side Delts Right */}
      <Path
        d="M220 80 L230 80 L230 110 L220 110 Z"
        fill={getFill('side_delts')}
        onPress={() => handlePress('side_delts')}
      />
      {/* Biceps Left */}
      <Path
        id="biceps"
        d="M80 120 L105 120 L100 180 L85 180 Z"
        fill={getFill('biceps')}
        onPress={() => handlePress('biceps')}
      />
      {/* Biceps Right */}
      <Path
        d="M195 120 L220 120 L215 180 L200 180 Z"
        fill={getFill('biceps')}
        onPress={() => handlePress('biceps')}
      />
      {/* Forearms Left */}
      <Path
        id="forearms_front"
        d="M80 190 L100 190 L95 260 L80 260 Z"
        fill={getFill('forearms_front')}
        onPress={() => handlePress('forearms_front')}
      />
      {/* Forearms Right */}
      <Path
        d="M200 190 L220 190 L220 260 L205 260 Z"
        fill={getFill('forearms_front')}
        onPress={() => handlePress('forearms_front')}
      />
      {/* Quads Left */}
      <Path
        id="quads"
        d="M110 270 L145 270 L140 400 L115 400 Z"
        fill={getFill('quads')}
        onPress={() => handlePress('quads')}
      />
      {/* Quads Right */}
      <Path
        d="M155 270 L190 270 L185 400 L160 400 Z"
        fill={getFill('quads')}
        onPress={() => handlePress('quads')}
      />
      {/* Adductors Left */}
      <Path
        id="adductors"
        d="M145 270 L150 270 L150 350 L142 350 Z"
        fill={getFill('adductors')}
        onPress={() => handlePress('adductors')}
      />
      {/* Adductors Right */}
      <Path
        d="M150 270 L155 270 L158 350 L150 350 Z"
        fill={getFill('adductors')}
        onPress={() => handlePress('adductors')}
      />
      {/* Calves Left */}
      <Path
        id="calves_front"
        d="M115 420 L135 420 L130 520 L120 520 Z"
        fill={getFill('calves_front')}
        onPress={() => handlePress('calves_front')}
      />
      {/* Calves Right */}
      <Path
        d="M165 420 L185 420 L180 520 L170 520 Z"
        fill={getFill('calves_front')}
        onPress={() => handlePress('calves_front')}
      />
    </Svg>
  );
};
