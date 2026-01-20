/**
 * ExerciseCard Component
 *
 * Displays detailed exercise information with video playback,
 * body parts, description, steps, tips, and common mistakes.
 *
 * Similar to: lib/content/exercise_card.dart
 *
 * Note: This component uses Image for thumbnails.
 * For full video playback, install react-native-video:
 * npm install react-native-video
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { BodyPartsWrap } from './BodyPartsWrap';
import { ExerciseModel } from 'kinestex-sdk-react-native';

interface ExerciseCardProps {
  exercise: ExerciseModel;
}

const { width } = Dimensions.get('window');

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [useDefaultVideo, setUseDefaultVideo] = useState(true);

  // Choose between default or male version
  const videoURL = useDefaultVideo
    ? exercise.videoURL
    : exercise.maleVideoURL || exercise.videoURL;
  const thumbnailURL = useDefaultVideo
    ? exercise.thumbnailURL
    : exercise.maleThumbnailURL || exercise.thumbnailURL;

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

  const handleVideoPress = () => {
    if (videoURL) {
      Linking.openURL(videoURL).catch((err) =>
        console.error('Failed to open video:', err)
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Video/Thumbnail Section */}
      <TouchableOpacity onPress={handleVideoPress} activeOpacity={0.8}>
        <View style={styles.videoContainer}>
          <Image
            source={{ uri: thumbnailURL }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
            <Text style={styles.playText}>Tap to play video</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Title and Difficulty */}
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.title}</Text>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(exercise.difficultyLevel) },
          ]}
        >
          <Text style={styles.difficultyText}>{exercise.difficultyLevel}</Text>
        </View>
      </View>

      {/* Reps and Countdown */}
      <View style={styles.statsRow}>
        {exercise.workoutReps && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Reps</Text>
            <Text style={styles.statValue}>{exercise.workoutReps}</Text>
          </View>
        )}
        {exercise.workoutCountdown && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{exercise.workoutCountdown}s</Text>
          </View>
        )}
        {exercise.restDuration > 0 && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rest</Text>
            <Text style={styles.statValue}>{exercise.restDuration}s</Text>
          </View>
        )}
      </View>

      {/* Video Version Toggle */}
      {exercise.maleVideoURL && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              useDefaultVideo && styles.toggleButtonActive,
            ]}
            onPress={() => setUseDefaultVideo(true)}
          >
            <Text
              style={[
                styles.toggleText,
                useDefaultVideo && styles.toggleTextActive,
              ]}
            >
              Default
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !useDefaultVideo && styles.toggleButtonActive,
            ]}
            onPress={() => setUseDefaultVideo(false)}
          >
            <Text
              style={[
                styles.toggleText,
                !useDefaultVideo && styles.toggleTextActive,
              ]}
            >
              Male Version
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Body Parts */}
      {exercise.bodyParts && exercise.bodyParts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Muscles</Text>
          <BodyPartsWrap bodyParts={exercise.bodyParts} />
        </View>
      )}

      {/* Description */}
      {exercise.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{exercise.description}</Text>
        </View>
      )}

      {/* Steps */}
      {exercise.steps && exercise.steps.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Perform</Text>
          {exercise.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Tips */}
      {exercise.tips && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsIcon}>💡</Text>
            <Text style={styles.tipsText}>{exercise.tips}</Text>
          </View>
        </View>
      )}

      {/* Common Mistakes */}
      {exercise.commonMistakes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Mistakes</Text>
          <View style={styles.mistakesContainer}>
            <Text style={styles.mistakesIcon}>⚠️</Text>
            <Text style={styles.mistakesText}>{exercise.commonMistakes}</Text>
          </View>
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
  videoContainer: {
    width: '100%',
    height: width * 0.56, // 16:9 aspect ratio
    backgroundColor: '#000',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  playIcon: {
    fontSize: 24,
    color: '#000',
    marginLeft: 4,
  },
  playText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  toggleTextActive: {
    color: '#FFF',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#424242',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#424242',
  },
  tipsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  tipsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tipsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#1565C0',
  },
  mistakesContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  mistakesIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  mistakesText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#E65100',
  },
  bottomSpacer: {
    height: 32,
  },
});
