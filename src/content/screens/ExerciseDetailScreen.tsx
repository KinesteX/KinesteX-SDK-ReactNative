/**
 * ExerciseDetailScreen
 *
 * Simple wrapper screen that displays ExerciseCard component.
 * Similar to: lib/content/exercise_detail_view.dart
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExerciseCard } from '../components/ExerciseCard';
import { ExerciseModel } from 'kinestex-sdk-react-native';

interface ExerciseDetailScreenProps {
  exercise: ExerciseModel;
}

export const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  exercise,
}) => {
  return (
    <View style={styles.container}>
      <ExerciseCard exercise={exercise} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
