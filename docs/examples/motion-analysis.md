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

  // Define the post data for integration
  const postDataCamera: IPostData = {
    key: 'YOUR API KEY',
    userId: 'YOUR USER ID',
    company: 'YOUR COMPANY NAME',
    currentExercise: 'Squats', // current exercise name
    exercises: ['Squats', 'Jumping Jack'], // array of expected exercises
  };

  // Function to change exercise
  const changeExercise = () => {
    if (kinestexSDKRef.current) {
      kinestexSDKRef.current.changeExercise('Jumping Jack');
    }
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
          onPress={changeExercise}
        >
          <Text style={styles.buttonText}>Switch to Jumping Jack</Text>
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
