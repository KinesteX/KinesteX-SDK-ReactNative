import React, {useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import KinestexSDK, {KinestexWarmup} from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  IPostData,
  WarmupState,
} from 'kinestex-sdk-react-native/src/types';

interface GenericWarmupComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
}

// Warmup when you do not know yet what the user will open.
// KinestexWarmup signs in and caches the app, the theme and the pose model,
// so whatever you open afterwards loads from cache.
const GenericWarmupComponent: React.FC<GenericWarmupComponentProps> = ({
  onMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [warmupState, setWarmupState] = useState<WarmupState>('loading');

  const postData: IPostData = useMemo(
    () => ({
      key: 'YOUR_API_KEY',
      userId: 'YOUR_USER_ID',
      company: 'YOUR_COMPANY_NAME',
      style: {
        style: 'dark',
        loadingBackgroundColor: '000000', // black bg for loading
      },
    }),
    [],
  );

  const handleMessage = (type: string, data: {[key: string]: any}) => {
    if (type === 'exit_kinestex') {
      setIsOpen(false);
      return;
    }
    onMessage(type, data);
  };

  // KinestexWarmup is unmounted before KinesteX is shown,
  // so two copies of the web app are never in memory together.
  if (isOpen) {
    return (
      <View style={styles.container}>
        <KinestexSDK
          data={postData}
          integrationOption={IntegrationOption.WORKOUT}
          workout="Fitness Lite"
          handleMessage={handleMessage}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Warmup: generic</Text>
        <Text style={styles.text}>
          KinesteX is signing in and filling its caches off screen. Any
          integration you open next starts from those caches.
        </Text>
        <Text style={styles.status}>Status: {warmupState}</Text>
        <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
          <Text style={styles.buttonText}>Open workout</Text>
        </TouchableOpacity>
      </View>
      <KinestexWarmup data={postData} onWarmupStateChange={setWarmupState} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  panel: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  status: {
    color: '#8fd19e',
    fontSize: 15,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1f6feb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GenericWarmupComponent;
