import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  KinesteXSDKCamera,
  IPostData,
} from 'kinestex-sdk-react-native/src/types';

interface ChallengeComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
}

const ChallengeComponent: React.FC<ChallengeComponentProps> = ({onMessage}) => {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  const postData: IPostData = {
    key: 'YOUR_API_KEY',
    userId: 'YOUR_USER_ID',
    company: 'YOUR_COMPANY_NAME',
    showLeaderboard: true,
    countdown: 100,
    exercise: 'Squats', // exercise ID or name to show leaderboard
  };

  return (
    <View style={styles.container}>
      <KinestexSDK
        ref={kinestexSDKRef}
        data={postData}
        integrationOption={IntegrationOption.CHALLENGE}
        handleMessage={onMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChallengeComponent;
