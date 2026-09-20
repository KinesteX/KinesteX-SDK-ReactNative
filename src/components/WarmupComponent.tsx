import React, {useMemo, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import {
  IntegrationOption,
  IPostData,
  WarmupState,
} from 'kinestex-sdk-react-native/src/types';

interface WarmupComponentProps {
  onMessage: (type: string, data: {[key: string]: any}) => void;
}

// Warmup when you know what the user will open.
// KinesteX loads hidden while this screen is shown, and appears instantly on tap.
const WarmupComponent: React.FC<WarmupComponentProps> = ({onMessage}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [warmupState, setWarmupState] = useState<WarmupState>('loading');
  const [warmedInSeconds, setWarmedInSeconds] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());

  // Keep `data` stable. The page reads it once, so a changed object means a fresh load.
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

  const handleWarmupState = (state: WarmupState) => {
    setWarmupState(state);
    if (state === 'ready' && warmedInSeconds === null) {
      setWarmedInSeconds(((Date.now() - mountedAt.current) / 1000).toFixed(1));
    }
  };

  const handleMessage = (type: string, data: {[key: string]: any}) => {
    if (type === 'exit_kinestex') {
      setIsOpen(false); // hide instead of unmounting, so it stays warm
      return;
    }
    onMessage(type, data);
  };

  return (
    <View style={styles.container}>
      {!isOpen && (
        <View style={styles.panel}>
          <Text style={styles.title}>Warmup: known destination</Text>
          <Text style={styles.text}>
            The "Fitness Lite" workout is loading off screen right now.
          </Text>
          <Text style={styles.status}>
            Status: {warmupState}
            {warmedInSeconds ? ` (first warmed in ${warmedInSeconds} s)` : ''}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsOpen(true)}>
            <Text style={styles.buttonText}>Open workout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Always mounted. `visible` must only say whether the user has KinesteX open.
          Never derive it from the warmup state. */}
      <KinestexSDK
        data={postData}
        integrationOption={IntegrationOption.WORKOUT}
        workout="Fitness Lite"
        visible={isOpen}
        onWarmupStateChange={handleWarmupState}
        handleMessage={handleMessage}
      />
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

export default WarmupComponent;
