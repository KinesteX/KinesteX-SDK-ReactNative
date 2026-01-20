/**
 * Content Module Exports
 *
 * Central export file for all content-related components, screens, and hooks.
 * This mirrors the Flutter SDK's content folder structure.
 */

// Main Navigator (easiest way to use content browsing)
export { ContentNavigator } from './ContentNavigator';

// Hooks
export { useContentFetch } from './hooks/useContentFetch';
export type { ContentState } from './hooks/useContentFetch';

// Components
export { BodyPartsWrap } from './components/BodyPartsWrap';
export { ExerciseCard } from './components/ExerciseCard';

// Screens
export { ContentSearchScreen } from './screens/ContentSearchScreen';
export { ContentGridScreen } from './screens/ContentGridScreen';
export { WorkoutDetailScreen } from './screens/WorkoutDetailScreen';
export { ExerciseDetailScreen } from './screens/ExerciseDetailScreen';
export { PlanDetailScreen } from './screens/PlanDetailScreen';

// Re-export types from SDK for convenience
export type {
  ContentType,
  BodyPart,
  ContentAPIRequest,
  ContentAPIResponse,
  ExerciseModel,
  WorkoutModel,
  PlanModel,
} from 'kinestex-sdk-react-native';
