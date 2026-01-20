/**
 * ContentNavigator Component
 *
 * Main navigation component for content browsing.
 * Manages navigation between search, grid, and detail screens.
 *
 * This component provides a complete content browsing experience
 * similar to the Flutter SDK's content folder implementation.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ContentType } from 'kinestex-sdk-react-native';
import { ContentSearchScreen } from './screens/ContentSearchScreen';
import { ContentGridScreen } from './screens/ContentGridScreen';
import { WorkoutDetailScreen } from './screens/WorkoutDetailScreen';
import { ExerciseDetailScreen } from './screens/ExerciseDetailScreen';
import { PlanDetailScreen } from './screens/PlanDetailScreen';
import { useContentFetch } from './hooks/useContentFetch';

interface ContentNavigatorProps {
  apiKey: string;
  companyName: string;
  onClose?: () => void;
}

type Screen =
  | { type: 'search' }
  | {
      type: 'grid';
      contentType: ContentType;
      data: any[];
    }
  | { type: 'workoutDetail'; workout: any }
  | { type: 'exerciseDetail'; exercise: any }
  | { type: 'planDetail'; plan: any };

export const ContentNavigator: React.FC<ContentNavigatorProps> = ({
  apiKey,
  companyName,
  onClose,
}) => {
  const [navigationStack, setNavigationStack] = useState<Screen[]>([
    { type: 'search' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { getWorkouts, getExercises, getPlans } = useContentFetch(
    apiKey,
    companyName
  );

  const currentScreen = navigationStack[navigationStack.length - 1];

  const navigateTo = (screen: Screen) => {
    setNavigationStack((prev) => [...prev, screen]);
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack((prev) => prev.slice(0, -1));
    } else if (onClose) {
      onClose();
    }
  };

  const handleResultsFetched = (data: any, contentType: ContentType) => {
    // If single item, go directly to detail
    if (!Array.isArray(data)) {
      switch (contentType) {
        case ContentType.WORKOUT:
          navigateTo({ type: 'workoutDetail', workout: data });
          break;
        case ContentType.EXERCISE:
          navigateTo({ type: 'exerciseDetail', exercise: data });
          break;
        case ContentType.PLAN:
          navigateTo({ type: 'planDetail', plan: data });
          break;
      }
    } else {
      // Show grid of results
      navigateTo({
        type: 'grid',
        contentType,
        data,
      });
    }
  };

  const handleItemPress = async (item: any) => {
    if (currentScreen.type === 'grid') {
      setIsLoading(true);
      try {
        switch (currentScreen.contentType) {
          case ContentType.WORKOUT: {
            // Fetch full workout with complete sequence by ID
            const result = await getWorkouts({ id: item.id });
            if (result?.type === 'workout') {
              navigateTo({ type: 'workoutDetail', workout: result.data });
            }
            break;
          }
          case ContentType.EXERCISE: {
            // Fetch full exercise details by ID
            const result = await getExercises({ id: item.id });
            if (result?.type === 'exercise') {
              navigateTo({ type: 'exerciseDetail', exercise: result.data });
            }
            break;
          }
          case ContentType.PLAN: {
            // Fetch full plan details by ID
            const result = await getPlans({ id: item.id });
            if (result?.type === 'plan') {
              navigateTo({ type: 'planDetail', plan: result.data });
            }
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExercisePress = (exercise: any) => {
    navigateTo({ type: 'exerciseDetail', exercise });
  };

  const renderScreen = () => {
    switch (currentScreen.type) {
      case 'search':
        return (
          <ContentSearchScreen
            apiKey={apiKey}
            companyName={companyName}
            onResultsFetched={handleResultsFetched}
          />
        );

      case 'grid':
        return (
          <ContentGridScreen
            contentType={currentScreen.contentType}
            data={currentScreen.data}
            onItemPress={handleItemPress}
          />
        );

      case 'workoutDetail':
        return (
          <WorkoutDetailScreen
            workout={currentScreen.workout}
            onExercisePress={handleExercisePress}
          />
        );

      case 'exerciseDetail':
        return <ExerciseDetailScreen exercise={currentScreen.exercise} />;

      case 'planDetail':
        return <PlanDetailScreen plan={currentScreen.plan} />;

      default:
        return null;
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen.type) {
      case 'search':
        return 'Content Search';
      case 'grid':
        return `${currentScreen.contentType}s`;
      case 'workoutDetail':
        return 'Workout Details';
      case 'exerciseDetail':
        return 'Exercise Details';
      case 'planDetail':
        return 'Plan Details';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {navigationStack.length > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Screen Content */}
      <View style={styles.content}>{renderScreen()}</View>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 8,
    paddingLeft: 16,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#757575',
  },
  content: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
