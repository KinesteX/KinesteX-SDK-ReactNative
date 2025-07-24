import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  PlanCategory,
  KinesteXSDKCamera,
  IPostData,
} from 'kinestex-sdk-react-native/src/types';
import Config from 'react-native-config';

interface MainComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
}

const MainComponent: React.FC<MainComponentProps> = ({onMessage}) => {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  const postData: IPostData = {
    key: Config.KINESTEX_API_KEY || 'YOUR_API_KEY',
    userId: Config.KINESTEX_USER_ID || 'YOUR_USER_ID',
    company: Config.KINESTEX_COMPANY_NAME || 'YOUR_COMPANY_NAME',
    planCategory: PlanCategory.Cardio,
    customParameters: {
      style: 'dark',
    },
  };

  return (
    <View style={styles.container}>
      <KinestexSDK
        ref={kinestexSDKRef}
        data={postData}
        integrationOption={IntegrationOption.MAIN}
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

export default MainComponent;
