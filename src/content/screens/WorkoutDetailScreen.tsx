/**
 * WorkoutDetailScreen
 *
 * Displays detailed workout information including:
 * - Hero image with title overlay
 * - Metadata (category, duration, calories)
 * - Body parts targeted
 * - Exercise sequence with indices
 *
 * Similar to: lib/content/workout_detail_view.dart
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { WorkoutModel } from 'kinestex-sdk-react-native';
import { BodyPartsWrap } from '../components/BodyPartsWrap';

interface WorkoutDetailScreenProps {
  workout: WorkoutModel;
  onExercisePress?: (exercise: any) => void;
}

const { width } = Dimensions.get('window');

export const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({
  workout,
  onExercisePress,
}) => {
  console.log('🏋️ WorkoutDetailScreen received workout:', {
    id: workout?.id,
    title: workout?.title,
    hasSequence: !!workout?.sequence,
    sequenceLength: workout?.sequence?.length,
    sequenceType: Array.isArray(workout?.sequence) ? 'array' : typeof workout?.sequence,
    fullWorkout: JSON.stringify(workout, null, 2).substring(0, 500),
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image with Title Overlay */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: workout.imgURL }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{workout.title}</Text>
        </View>
      </View>

      {/* Metadata Section */}
      <View style={styles.metadataContainer}>
        {workout.category && (
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Category</Text>
            <Text style={styles.metadataValue}>{workout.category}</Text>
          </View>
        )}
        {workout.totalMinutes && (
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Duration</Text>
            <Text style={styles.metadataValue}>{workout.totalMinutes} min</Text>
          </View>
        )}
        {workout.totalCalories && (
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Calories</Text>
            <Text style={styles.metadataValue}>{workout.totalCalories} cal</Text>
          </View>
        )}
        {workout.difficultyLevel && (
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Difficulty</Text>
            <Text style={styles.metadataValue}>{workout.difficultyLevel}</Text>
          </View>
        )}
      </View>

      {/* Body Parts */}
      {workout.bodyParts && workout.bodyParts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Muscles</Text>
          <BodyPartsWrap bodyParts={workout.bodyParts} />
        </View>
      )}

      {/* Description */}
      {workout.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{workout.description}</Text>
        </View>
      )}

      {/* Exercise Sequence */}
      {workout.sequence && workout.sequence.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Exercises ({workout.sequence.length})
          </Text>
          {workout.sequence.map((exercise: any, index) => {
            console.log('Rendering exercise:', {
              index,
              id: exercise.id,
              title: exercise.title,
              thumbnailURL: exercise.thumbnailURL,
              workoutReps: exercise.workoutReps,
              workoutCountdown: exercise.workoutCountdown,
            });
            return (
              <TouchableOpacity
                key={`${exercise.id}-${index}`}
                style={styles.exerciseCard}
                onPress={() => onExercisePress && onExercisePress(exercise)}
                activeOpacity={0.7}
              >
                <View style={styles.exerciseIndexContainer}>
                  <Text style={styles.exerciseIndex}>{index + 1}</Text>
                </View>
                {exercise.thumbnailURL ? (
                  <Image
                    source={{ uri: exercise.thumbnailURL }}
                    style={styles.exerciseThumbnail}
                    resizeMode="cover"
                    onError={(error) => {
                      console.log('Image load error for exercise:', exercise.title, error);
                    }}
                  />
                ) : (
                  <View style={[styles.exerciseThumbnail, styles.exerciseThumbnailPlaceholder]}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseTitle} numberOfLines={2}>
                    {exercise.title || 'Untitled Exercise'}
                  </Text>
                  <View style={styles.exerciseStats}>
                    {exercise.workoutReps && (
                      <Text style={styles.exerciseStat}>
                        {exercise.workoutReps} reps
                      </Text>
                    )}
                    {exercise.workoutCountdown && (
                      <Text style={styles.exerciseStat}>
                        {exercise.workoutCountdown}s
                      </Text>
                    )}
                    {exercise.restDuration > 0 && (
                      <Text style={styles.exerciseStat}>
                        Rest: {exercise.restDuration}s
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.exerciseArrow}>
                  <Text style={styles.exerciseArrowText}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroContainer: {
    width: '100%',
    height: width * 0.6,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  metadataItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  metadataLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#424242',
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'center',
    height: 80,
  },
  exerciseIndexContainer: {
    width: 40,
    height: 80,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseIndex: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  exerciseThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#E0E0E0',
  },
  exerciseThumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  exerciseContent: {
    flex: 1,
    padding: 12,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 6,
  },
  exerciseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseStat: {
    fontSize: 12,
    color: '#757575',
  },
  exerciseArrow: {
    paddingHorizontal: 16,
  },
  exerciseArrowText: {
    fontSize: 24,
    color: '#BDBDBD',
  },
  bottomSpacer: {
    height: 32,
  },
});
