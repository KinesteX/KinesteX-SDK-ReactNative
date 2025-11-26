import React, {useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  KinesteXSDKCamera,
  IPostData,
  WorkoutSequenceExercise,
} from 'kinestex-sdk-react-native/src/types';

interface CustomWorkoutComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
}

const CustomWorkoutComponent: React.FC<CustomWorkoutComponentProps> = ({
  onMessage,
}) => {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);
  const [allResourcesLoaded, setAllResourcesLoaded] = useState(false);

  // Define custom workout exercises
  const customWorkoutExercises: WorkoutSequenceExercise[] = [
    {
      exerciseId: 'jz73VFlUyZ9nyd64OjRb', // exercise id from kinestex api or admin panel
      reps: 15, // reps for the exercise
      duration: null, // duration for the exercise (null if not applicable)
      includeRestPeriod: true, // include rest period before the exercise
      restDuration: 20, // rest duration in seconds before the exercise
    },
    {
      exerciseId: 'ZVMeLsaXQ9Tzr5JYXg29',
      reps: 10,
      duration: 30,
      includeRestPeriod: true,
      restDuration: 15,
    },
    {
      exerciseId: 'ZVMeLsaXQ9Tzr5JYXg29',
      reps: 10,
      duration: 30,
      includeRestPeriod: true,
      restDuration: 15,
    },
    {
      exerciseId: 'gJGOiZhCvJrhEP7sTy78',
      reps: 20,
      duration: null,
      includeRestPeriod: false,
      restDuration: 0,
    },
  ];

  const postData: IPostData = {
    key: 'YOUR_API_KEY',
    userId: 'YOUR_USER_ID',
    company: 'YOUR_COMPANY_NAME',
    customWorkoutExercises: customWorkoutExercises,
  };

  const handleMessage = (type: string, data: {[key: string]: any}) => {
    switch (type) {
      case 'all_resources_loaded':
        console.log('All resources loaded:', data);
        setAllResourcesLoaded(true);
        // Send action to start the workout flow
        kinestexSDKRef.current?.sendAction('workout_activity_action', 'start');
        break;
      default:
        // Forward all messages to parent handler
        onMessage(type, data);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.sdkContainer,
          !allResourcesLoaded && styles.hiddenSdkContainer,
        ]}>
        <KinestexSDK
          ref={kinestexSDKRef}
          data={postData}
          integrationOption={IntegrationOption.CUSTOM_WORKOUT}
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
  sdkContainer: {
    flex: 1,
  },
  hiddenSdkContainer: {
    opacity: 0,
  },
});

export default CustomWorkoutComponent;
