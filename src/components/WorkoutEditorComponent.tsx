import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import KinestexSDK, {
  IntegrationOption,
  KinesteXSDKCamera,
  IPostData,
} from 'kinestex-sdk-react-native';

interface WorkoutEditorComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
}

const WorkoutEditorComponent: React.FC<WorkoutEditorComponentProps> = ({
  onMessage,
}) => {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  const postData: IPostData = {
    key: 'YOUR-API-KEY',
    userId: 'YOUR-USER-ID',
    company: 'YOUR-COMPANY',
    organization: 'ORGANIZATION', // REQUIRED for admin view
    // Optional: specify content type and ID to edit specific content
    // adminContentType: AdminContentType.WORKOUT,
    // adminContentId: 'workout-123',
    customParameters: {
      // Optional: custom data sent to WebView
    },
    customQueries: {
      // Optional: custom URL query parameters
      isCustomAuth: true,
      hideSidebar: true,
    },
    style: {
      style: 'dark',
      loadingBackgroundColor: '000000',
    },
  };

  return (
    <View style={styles.container}>
      <KinestexSDK
        ref={kinestexSDKRef}
        data={postData}
        integrationOption={IntegrationOption.WORKOUT_ADMIN_VIEW}
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

export default WorkoutEditorComponent;
