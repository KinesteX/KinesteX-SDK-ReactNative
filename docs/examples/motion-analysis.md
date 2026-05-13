Complete code example for the `CAMERA` Integration Option:

```ts
import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  KinesteXSDKCamera,
  IPostData,
} from 'kinestex-sdk-react-native/src/types';

const App = () => {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  // Define the post data for integration.
  // `exerciseFetchType` controls how `exercises[]` and `currentExercise` are
  // resolved. Defaults to "model_id" when omitted.
  const postDataCamera: IPostData = {
    key: 'YOUR API KEY',
    userId: 'YOUR USER ID',
    company: 'YOUR COMPANY NAME',
    currentExercise: 'Squats',
    exercises: ['Squats'],
    exerciseFetchType: 'exercise_title',
  };

  // Step 1 — fetch + cache an extra model mid-session. This does NOT switch
  // the active exercise; we switch in `handleMessage` once `models_loaded`
  // arrives with a matching `modelIds` entry.
  const loadJumpingJack = () => {
    kinestexSDKRef.current?.sendAction(
      'workout_activity_action',
      'load_models',
      { exercises: ['Jumping Jack'], exerciseFetchType: 'exercise_title' },
    );
  };

  // Handle messages from the SDK
  const handleMessage = (type: string, data: {[key: string]: any}) => {
    switch (type) {
      case 'kinestex_launched':
        console.log('KinesteX launched');
        break;
      case 'successful_repeat':
        console.log('Current rep:', data.value);
        break;
      case 'mistake':
        console.log('Mistake:', data.value);
        break;
      case 'models_loaded':
        // Step 2 — model is cached; switch the active exercise. Do NOT
        // repeat `exerciseFetchType` on the switch.
        if (Array.isArray(data.modelIds) && data.modelIds.includes('Jumping Jack')) {
          kinestexSDKRef.current?.sendAction('currentExercise', 'Jumping Jack');
        }
        break;
      case 'speech_fetch_complete':
        // Branch on `modelIds`: present → mistake-feedback audio cached;
        // absent → rest-speech batch finished.
        if (data.modelIds) {
          console.log('Mistake-feedback audio cached for:', data.modelIds);
        }
        break;
      case 'error_occurred':
        console.warn('KinesteX error:', data.message);
        break;
      default:
        console.log('Unknown message type:', type, data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <KinestexSDK
          ref={kinestexSDKRef}
          data={postDataCamera}
          integrationOption={IntegrationOption.CAMERA}
          handleMessage={handleMessage}
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={loadJumpingJack}
        >
          <Text style={styles.buttonText}>Load & switch to Jumping Jack</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
```
