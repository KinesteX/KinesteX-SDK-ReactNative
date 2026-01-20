/**
 * ContentGridScreen
 *
 * Displays a grid of content (workouts, plans, or exercises)
 * with 2-column layout and tap navigation to detail views.
 *
 * Similar to: lib/content/content_detail_view.dart
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ContentType, WorkoutModel, ExerciseModel, PlanModel } from 'kinestex-sdk-react-native';

interface ContentGridScreenProps {
  contentType: ContentType;
  data: WorkoutModel[] | ExerciseModel[] | PlanModel[];
  onItemPress: (item: any) => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // 2 columns with padding

export const ContentGridScreen: React.FC<ContentGridScreenProps> = ({
  contentType,
  data,
  onItemPress,
}) => {
  const renderWorkoutCard = (workout: WorkoutModel) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onItemPress(workout)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: workout.imgURL }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {workout.title}
        </Text>
        {workout.category && (
          <Text style={styles.cardCategory}>{workout.category}</Text>
        )}
        <View style={styles.cardStats}>
          {workout.totalMinutes && (
            <Text style={styles.cardStat}>{workout.totalMinutes} min</Text>
          )}
          {workout.totalCalories && (
            <Text style={styles.cardStat}>{workout.totalCalories} cal</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderExerciseCard = (exercise: ExerciseModel) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onItemPress(exercise)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: exercise.thumbnailURL }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {exercise.title}
        </Text>
        {exercise.difficultyLevel && (
          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor: getDifficultyColor(exercise.difficultyLevel),
              },
            ]}
          >
            <Text style={styles.difficultyText}>
              {exercise.difficultyLevel}
            </Text>
          </View>
        )}
        <View style={styles.cardStats}>
          {exercise.workoutReps && (
            <Text style={styles.cardStat}>{exercise.workoutReps} reps</Text>
          )}
          {exercise.workoutCountdown && (
            <Text style={styles.cardStat}>{exercise.workoutCountdown}s</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPlanCard = (plan: PlanModel) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onItemPress(plan)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: plan.imgURL }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {plan.title}
        </Text>
        {plan.category?.description && (
          <Text style={styles.cardCategory} numberOfLines={2}>
            {plan.category.description}
          </Text>
        )}
        {plan.levels && (
          <Text style={styles.cardStat}>
            {Object.keys(plan.levels).length} levels
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => {
    switch (contentType) {
      case ContentType.WORKOUT:
        return renderWorkoutCard(item as WorkoutModel);
      case ContentType.EXERCISE:
        return renderExerciseCard(item as ExerciseModel);
      case ContentType.PLAN:
        return renderPlanCard(item as PlanModel);
      default:
        return null;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No content found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: ITEM_WIDTH * 0.75,
    backgroundColor: '#E0E0E0',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  cardStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardStat: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
});
