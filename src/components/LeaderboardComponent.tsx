import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  KinesteXSDKCamera,
  IPostData,
} from 'kinestex-sdk-react-native/src/types';
import Config from 'react-native-config';

interface LeaderboardComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
}

const LeaderboardComponent: React.FC<LeaderboardComponentProps> = ({
  onMessage,
}) => {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  const postData: IPostData = {
    key: Config.KINESTEX_API_KEY || 'YOUR_API_KEY',
    userId: Config.KINESTEX_USER_ID || 'YOUR_USER_ID',
    company: Config.KINESTEX_COMPANY_NAME || 'YOUR_COMPANY_NAME',
    exercise: 'Squats', // exercise ID or name to show leaderboard
    customParameters: {
      style: 'dark',
    },
  };

  return (
    <View style={styles.container}>
      <KinestexSDK
        ref={kinestexSDKRef}
        data={postData}
        integrationOption={IntegrationOption.LEADERBOARD}
        username={'John Doe'} // username to highlight on the leaderboard
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

export default LeaderboardComponent;
