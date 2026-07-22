import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../../constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: THEME.colors.textSecondary,
    fontSize: 18,
  },
});
