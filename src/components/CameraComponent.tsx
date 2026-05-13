import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  KinesteXSDKCamera,
  IPostData,
} from 'kinestex-sdk-react-native/src/types';

interface CameraComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({onMessage}) => {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);
  const pendingSwitchRef = useRef<string | null>(null);
  const [loadedExercises, setLoadedExercises] = useState<string[]>(['Squats']);
  const [currentExercise, setCurrentExercise] = useState<string>('Squats');

  // In v1.3.1 you can identify exercises by title, exercise_id, or model_id.
  // Set `exerciseFetchType` to control how `exercises[]` and `currentExercise`
  // are resolved. Defaults to "model_id" when omitted.
  const postData: IPostData = {
    key: 'YOUR_API_KEY',
    userId: 'YOUR_USER_ID',
    company: 'YOUR_COMPANY_NAME',
    currentExercise: 'Squats',
    exercises: ['Squats'],
    exerciseFetchType: 'exercise_title',
  };

  // Step 1: fetch the model mid-session via the new `load_models` action.
  // The active exercise is NOT switched automatically — we record the
  // intent and switch after `models_loaded` arrives (handled below).
  const loadAndSwitchTo = useCallback((title: string) => {
    if (!kinestexSDKRef.current) {
      return;
    }
    pendingSwitchRef.current = title;
    kinestexSDKRef.current.sendAction(
      'workout_activity_action',
      'load_models',
      {
        exercises: [title],
        exerciseFetchType: 'exercise_title',
      },
    );
  }, []);

  const handleMessage = useCallback(
    (type: string, data: {[key: string]: any}) => {
      switch (type) {
        case 'models_loaded': {
          // `modelIds` echoes the identifiers in the form we supplied.
          const modelIds: string[] = Array.isArray(data.modelIds)
            ? data.modelIds
            : [];
          if (modelIds.length > 0) {
            setLoadedExercises(prev =>
              Array.from(new Set([...prev, ...modelIds])),
            );
          }
          const pending = pendingSwitchRef.current;
          if (pending && modelIds.includes(pending)) {
            // Step 2: now that the model is cached, switch the active exercise.
            // Do NOT repeat `exerciseFetchType` here — it only applies to fetches.
            kinestexSDKRef.current?.sendAction('currentExercise', pending);
            setCurrentExercise(pending);
            pendingSwitchRef.current = null;
          }
          break;
        }
        case 'speech_fetch_complete':
          // Two distinct emitters — branch on `modelIds`:
          //   present → mistake-feedback audio cached for the listed IDs
          //   absent  → rest-speech batch finished
          if (data.modelIds) {
            console.log('Mistake-feedback audio cached for:', data.modelIds);
          } else {
            console.log(
              'Rest-speech batch finished',
              data.successCount,
              data.failureCount,
            );
          }
          break;
        case 'error_occurred':
          // Per-identifier failures arrive here. Partial success is possible:
          // if it shows up alongside `models_loaded`, the resolved subset is
          // still switchable — only retry the failed identifiers.
          console.warn('KinesteX error:', data.message);
          break;
      }
      onMessage(type, data);
    },
    [onMessage],
  );

  const isJumpingJackLoaded = loadedExercises.includes('Jumping Jack');
  const isLungesLoaded = loadedExercises.includes('Lunges');

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Text style={styles.statusText}>Current: {currentExercise}</Text>
        <TouchableOpacity
          style={[
            styles.button,
            currentExercise === 'Jumping Jack' && styles.buttonActive,
          ]}
          onPress={() => {
            if (isJumpingJackLoaded) {
              kinestexSDKRef.current?.sendAction(
                'currentExercise',
                'Jumping Jack',
              );
              setCurrentExercise('Jumping Jack');
            } else {
              loadAndSwitchTo('Jumping Jack');
            }
          }}>
          <Text style={styles.buttonText}>
            {isJumpingJackLoaded
              ? 'Switch to Jumping Jack'
              : 'Load & switch to Jumping Jack'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            currentExercise === 'Lunges' && styles.buttonActive,
          ]}
          onPress={() => {
            if (isLungesLoaded) {
              kinestexSDKRef.current?.sendAction('currentExercise', 'Lunges');
              setCurrentExercise('Lunges');
            } else {
              loadAndSwitchTo('Lunges');
            }
          }}>
          <Text style={styles.buttonText}>
            {isLungesLoaded ? 'Switch to Lunges' : 'Load & switch to Lunges'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sdkContainer}>
        <KinestexSDK
          ref={kinestexSDKRef}
          data={postData}
          integrationOption={IntegrationOption.CAMERA}
          handleMessage={handleMessage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: 'black',
    gap: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sdkContainer: {
    flex: 1,
  },
});

export default CameraComponent;
