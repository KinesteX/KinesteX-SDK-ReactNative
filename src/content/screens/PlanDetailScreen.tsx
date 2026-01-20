/**
 * PlanDetailScreen
 *
 * Displays hierarchical plan structure: Plans → Levels → Days → Workouts
 * - Category description
 * - Expandable levels/weeks
 * - Day cards with workout summaries
 * - Rest day indicators
 *
 * Similar to: lib/content/plan_detail_view.dart
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { PlanModel } from 'kinestex-sdk-react-native';

interface PlanDetailScreenProps {
  plan: PlanModel;
  onWorkoutPress?: (workoutId: string) => void;
}

const { width } = Dimensions.get('window');

export const PlanDetailScreen: React.FC<PlanDetailScreenProps> = ({
  plan,
  onWorkoutPress,
}) => {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());

  const toggleLevel = (levelKey: string) => {
    setExpandedLevels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(levelKey)) {
        newSet.delete(levelKey);
      } else {
        newSet.add(levelKey);
      }
      return newSet;
    });
  };

  const isRestDay = (day: any) => {
    return !day.workouts || day.workouts.length === 0;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image with Title Overlay */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: plan.imgURL }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{plan.title}</Text>
        </View>
      </View>

      {/* Category Description */}
      {plan.category?.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Plan</Text>
          <Text style={styles.descriptionText}>
            {plan.category.description}
          </Text>
        </View>
      )}

      {/* Plan Levels */}
      {plan.levels && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Plan Structure ({Object.keys(plan.levels).length} Levels)
          </Text>

          {Object.entries(plan.levels)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([levelKey, level]) => {
              const isExpanded = expandedLevels.has(levelKey);
              const daysCount = level.days ? Object.keys(level.days).length : 0;

              return (
                <View key={levelKey} style={styles.levelCard}>
                  {/* Level Header */}
                  <TouchableOpacity
                    style={styles.levelHeader}
                    onPress={() => toggleLevel(levelKey)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.levelHeaderLeft}>
                      <Text style={styles.levelNumber}>Level {levelKey}</Text>
                      <Text style={styles.levelTitle}>{level.title}</Text>
                      <Text style={styles.levelDays}>{daysCount} days</Text>
                    </View>
                    <Text style={styles.expandIcon}>
                      {isExpanded ? '▼' : '▶'}
                    </Text>
                  </TouchableOpacity>

                  {/* Level Description */}
                  {level.description && (
                    <View style={styles.levelDescription}>
                      <Text style={styles.levelDescriptionText}>
                        {level.description}
                      </Text>
                    </View>
                  )}

                  {/* Days Grid (Expanded) */}
                  {isExpanded && level.days && (
                    <View style={styles.daysContainer}>
                      {Object.entries(level.days)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([dayKey, day]) => {
                          const isRest = isRestDay(day);

                          return (
                            <View
                              key={dayKey}
                              style={[
                                styles.dayCard,
                                isRest && styles.dayCardRest,
                              ]}
                            >
                              {/* Day Header */}
                              <View style={styles.dayHeader}>
                                <Text style={styles.dayNumber}>Day {dayKey}</Text>
                                {isRest && (
                                  <View style={styles.restBadge}>
                                    <Text style={styles.restBadgeText}>REST</Text>
                                  </View>
                                )}
                              </View>

                              {/* Day Title */}
                              <Text style={styles.dayTitle}>{day.title}</Text>

                              {/* Day Description */}
                              {day.description && (
                                <Text style={styles.dayDescription}>
                                  {day.description}
                                </Text>
                              )}

                              {/* Workouts */}
                              {day.workouts && day.workouts.length > 0 && (
                                <View style={styles.workoutsContainer}>
                                  {day.workouts.map((workout, index) => (
                                    <TouchableOpacity
                                      key={`${workout.id}-${index}`}
                                      style={styles.workoutCard}
                                      onPress={() =>
                                        onWorkoutPress &&
                                        onWorkoutPress(workout.id)
                                      }
                                      activeOpacity={0.7}
                                    >
                                      <Image
                                        source={{ uri: workout.imgURL }}
                                        style={styles.workoutThumbnail}
                                        resizeMode="cover"
                                      />
                                      <View style={styles.workoutContent}>
                                        <Text
                                          style={styles.workoutTitle}
                                          numberOfLines={2}
                                        >
                                          {workout.title}
                                        </Text>
                                        <View style={styles.workoutStats}>
                                          {workout.totalMinutes > 0 && (
                                            <Text style={styles.workoutStat}>
                                              {workout.totalMinutes} min
                                            </Text>
                                          )}
                                          {workout.calories && (
                                            <Text style={styles.workoutStat}>
                                              {workout.calories} cal
                                            </Text>
                                          )}
                                        </View>
                                      </View>
                                      <View style={styles.workoutArrow}>
                                        <Text style={styles.workoutArrowText}>
                                          ›
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  ))}
                                </View>
                              )}
                            </View>
                          );
                        })}
                    </View>
                  )}
                </View>
              );
            })}
        </View>
      )}

      {/* Created By */}
      {plan.createdBy && (
        <View style={styles.section}>
          <Text style={styles.createdByText}>Created by: {plan.createdBy}</Text>
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
  section: {
    padding: 16,
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
  levelCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
  },
  levelHeaderLeft: {
    flex: 1,
  },
  levelNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E3F2FD',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  levelDays: {
    fontSize: 12,
    color: '#E3F2FD',
  },
  expandIcon: {
    fontSize: 16,
    color: '#FFF',
    paddingLeft: 16,
  },
  levelDescription: {
    padding: 16,
    backgroundColor: '#E3F2FD',
  },
  levelDescriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1565C0',
  },
  daysContainer: {
    padding: 12,
    gap: 12,
  },
  dayCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayCardRest: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FBC02D',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  restBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  restBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  dayDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#616161',
    marginBottom: 8,
  },
  workoutsContainer: {
    marginTop: 8,
    gap: 8,
  },
  workoutCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  workoutThumbnail: {
    width: 60,
    height: 60,
    backgroundColor: '#E0E0E0',
  },
  workoutContent: {
    flex: 1,
    padding: 10,
  },
  workoutTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 8,
  },
  workoutStat: {
    fontSize: 11,
    color: '#757575',
  },
  workoutArrow: {
    paddingHorizontal: 12,
  },
  workoutArrowText: {
    fontSize: 20,
    color: '#BDBDBD',
  },
  createdByText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#757575',
  },
  bottomSpacer: {
    height: 32,
  },
});
