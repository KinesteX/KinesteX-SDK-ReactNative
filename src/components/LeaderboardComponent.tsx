import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  KinesteXSDKCamera,
  IPostData,
} from 'kinestex-sdk-react-native/src/types';

interface LeaderboardComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
} 

const LeaderboardComponent: React.FC<LeaderboardComponentProps> = ({
  onMessage,
}) => {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  const postData: IPostData = {
    key: 'YOUR_API_KEY',
    userId: 'YOUR_USER_ID',
    company: 'YOUR_COMPANY_NAME',
    exercise: 'Squats', // exercise ID or name to show leaderboard
    style: {
      style: 'dark', // dark or light theme (customizable in the admin dashboard)
      // themeName: company name - by default we create you a theme with your company name, but if you create other themes, you can pass in their names here
      loadingBackgroundColor: '000000', // value in hex (without #) to customize bg for initial loading screen
      // loadingStickmanColor: string // value in hex (without #) to customize strickman color for initial loading screen
      // loadingTextColor: string // value in hex (without #) to customize text color for initial loading screen
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
