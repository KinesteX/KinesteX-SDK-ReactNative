import React, {useRef} from 'react';
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

  const postData: IPostData = {
    key: 'YOUR_API_KEY',
    userId: 'YOUR_USER_ID',
    company: 'YOUR_COMPANY_NAME',
    currentExercise: 'Squats', // current exercise name or MODEL ID (can be fetched from the API)
    exercises: ['Squats', 'Jumping Jack'], // all exercise names or MODEL IDs (can be fetched from the API)
  };

  const changeExerciseCamera = () => {
    if (kinestexSDKRef.current) {
      kinestexSDKRef.current?.changeExercise('Jumping Jack'); // has to be one of the exercises in the postData.exercises array
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={changeExerciseCamera}>
          <Text style={styles.buttonText}>Change to Jumping Jack</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sdkContainer}>
        <KinestexSDK
          ref={kinestexSDKRef}
          data={postData}
          integrationOption={IntegrationOption.CAMERA}
          handleMessage={onMessage}
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
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
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
