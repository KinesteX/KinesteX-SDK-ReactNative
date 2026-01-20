/**
 * useContentFetch Hook
 *
 * Custom React hook for fetching content from KinesteX API.
 * Replaces the Flutter Cubit pattern with React hooks for state management.
 *
 * Similar to: lib/content/cubit/default_cubit.dart
 */

import { useState, useCallback } from 'react';
import {
  KinesteXAPI,
  ContentType,
  BodyPart,
  ContentAPIRequest,
} from 'kinestex-sdk-react-native';

export interface ContentState {
  workouts: any[];
  exercises: any[];
  plans: any[];
  isLoading: boolean;
  error: string | null;
  lastDocId?: string;
}

const initialState: ContentState = {
  workouts: [],
  exercises: [],
  plans: [],
  isLoading: false,
  error: null,
};

export const useContentFetch = (apiKey: string, companyName: string) => {
  const [state, setState] = useState<ContentState>(initialState);
  const api = new KinesteXAPI(apiKey, companyName);

  /**
   * Fetch content based on the provided request parameters
   */
  const fetchContent = useCallback(
    async (request: ContentAPIRequest) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await api.fetchContent(request);

        if (!result.success) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: result.error || 'Unknown error occurred',
          }));
          return null;
        }

        // Parse the result based on content type
        const { contentType } = request;
        const data = result.data;

        switch (contentType) {
          case ContentType.WORKOUT:
            if (Array.isArray(data?.workouts)) {
              // Multiple workouts
              setState((prev) => ({
                ...prev,
                workouts: data.workouts,
                lastDocId: data.lastDocId,
                isLoading: false,
              }));
              return { type: 'workouts', data: data.workouts };
            } else if (data?.id) {
              // Single workout
              setState((prev) => ({
                ...prev,
                workouts: [data],
                isLoading: false,
              }));
              return { type: 'workout', data };
            }
            break;

          case ContentType.EXERCISE:
            if (Array.isArray(data?.exercises)) {
              // Multiple exercises
              setState((prev) => ({
                ...prev,
                exercises: data.exercises,
                lastDocId: data.lastDocId,
                isLoading: false,
              }));
              return { type: 'exercises', data: data.exercises };
            } else if (data?.id) {
              // Single exercise
              setState((prev) => ({
                ...prev,
                exercises: [data],
                isLoading: false,
              }));
              return { type: 'exercise', data };
            }
            break;

          case ContentType.PLAN:
            if (Array.isArray(data?.plans)) {
              // Multiple plans
              setState((prev) => ({
                ...prev,
                plans: data.plans,
                lastDocId: data.lastDocId,
                isLoading: false,
              }));
              return { type: 'plans', data: data.plans };
            } else if (data?.id) {
              // Single plan
              setState((prev) => ({
                ...prev,
                plans: [data],
                isLoading: false,
              }));
              return { type: 'plan', data };
            }
            break;
        }

        // If we couldn't parse the data properly
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Unexpected data format',
        }));
        return null;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return null;
      }
    },
    [api]
  );

  /**
   * Fetch workouts by various filters
   */
  const getWorkouts = useCallback(
    async (params: {
      id?: string;
      title?: string;
      category?: string;
      bodyParts?: BodyPart[];
      limit?: number;
      lastDocId?: string;
    }) => {
      return fetchContent({
        contentType: ContentType.WORKOUT,
        lang: 'en',
        ...params,
      });
    },
    [fetchContent]
  );

  /**
   * Fetch exercises by various filters
   */
  const getExercises = useCallback(
    async (params: {
      id?: string;
      title?: string;
      category?: string;
      bodyParts?: BodyPart[];
      limit?: number;
      lastDocId?: string;
    }) => {
      return fetchContent({
        contentType: ContentType.EXERCISE,
        lang: 'en',
        ...params,
      });
    },
    [fetchContent]
  );

  /**
   * Fetch plans by various filters
   */
  const getPlans = useCallback(
    async (params: {
      id?: string;
      title?: string;
      category?: string;
      limit?: number;
      lastDocId?: string;
    }) => {
      return fetchContent({
        contentType: ContentType.PLAN,
        lang: 'en',
        ...params,
      });
    },
    [fetchContent]
  );

  /**
   * Reset state to initial
   */
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    fetchContent,
    getWorkouts,
    getExercises,
    getPlans,
    reset,
  };
};
