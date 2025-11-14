import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  KinesteXSDKCamera,
  IPostData,
} from 'kinestex-sdk-react-native/src/types';

interface WorkoutComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
}

const WorkoutComponent: React.FC<WorkoutComponentProps> = ({onMessage}) => {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  const postData: IPostData = {
    key: 'YOUR_API_KEY',
    userId: 'YOUR_USER_ID',
    company: 'YOUR_COMPANY_NAME',
    style: {
      style: 'dark',
      loadingBackgroundColor: '000000', // black bg for loading
    },
  };

  return (
    <View style={styles.container}>
      <KinestexSDK
        ref={kinestexSDKRef}
        data={postData}
        integrationOption={IntegrationOption.WORKOUT}
        handleMessage={onMessage}
        workout="Fitness Lite"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WorkoutComponent;
