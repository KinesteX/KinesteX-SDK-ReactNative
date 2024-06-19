import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Animated, StatusBar } from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import { IntegrationOption, PlanCategory, KinesteXSDKCamera, IPostData } from 'kinestex-sdk-react-native/src/types';

const App = () => {
  const [showWebView, setShowWebView] = useState(true);
  const [selectedOption, setSelectedOption] = useState<'coach' | 'ai'>('ai');
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const progress = useRef(new Animated.Value(0)).current;
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  useEffect(() => {
    startProgressBarAnimation();
  }, []);

  // for custom animation of progress bar
  const startProgressBarAnimation = () => {
    progress.setValue(0); // Reset the progress value
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000, // 5 seconds
      useNativeDriver: false,
    }).start();
  };

  const toggleWebView = (option: 'coach' | 'ai') => {
    setSelectedOption(option);
    if (option === 'ai') {
      startProgressBarAnimation();
      setIsOverlayVisible(true);
    }
    setShowWebView(option === 'ai');
  };

  const postData: IPostData = {
    key: 'YOUR KEY',
    userId: 'YOUR USER ID',
    company: 'YOUR COMPANY',
    planCategory: PlanCategory.Cardio,
  };

  const handleMessage = (type: string, data: { [key: string]: any }) => {
    switch (type) {
      case 'finished_workout':
        console.log('Received data:', data);
        break;
      case 'kinestex_launched':
        setTimeout(() => {
          setIsOverlayVisible(false);
        }, 1000);
        break;
      case 'exit_kinestex':
        console.log("User wishes to exit the app", data);
        if (data.message) {
          console.log('Date:', data.message);
        }
        setIsOverlayVisible(true);
        setShowWebView(false);
        break;
      case 'error_occured':
        console.log('Error occured:', data);
        break;
      case "plan_unlocked":
        console.log('Workout plan unlocked:', data);
        break;
      default:
        console.log('Unknown message type:', type, data);
        break;
    }
  };

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        <View style={styles.navBar}>
       
          <TouchableOpacity
            style={[
              styles.navButton,
              selectedOption === 'ai' && styles.navButtonSelected,
            ]}
            onPress={() => toggleWebView('ai')}
          >
            <Text
              style={[
                styles.navButtonText,
                selectedOption === 'ai' && styles.navButtonTextSelected,
              ]}
            >
              AI coach
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {!showWebView && (
            <View style={styles.blackScreen}>
              <Text style={styles.blackScreenText}>Click on AI Coach to launch </Text>
            </View>
          )}
          {showWebView && (
            <View style={styles.webViewContainer}>
              <View style={styles.webViewContent}>
                <KinestexSDK 
                  ref={kinestexSDKRef}
                  data={postData} 
                  integrationOption={IntegrationOption.MAIN}
                  handleMessage={handleMessage} 
                />
              </View>
            </View>
          )}

          {/* SHOW CUSTOM ANIMATION */}

          {isOverlayVisible && (
            <View style={styles.overlay}>
              <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
              <Text style={styles.blackScreenText}>Your loading animation</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navButton: {
    padding: 10,
  },
  navButtonSelected: {
    backgroundColor: 'gray',
  },
  navButtonText: {
    fontSize: 18,
    color: 'gray',
  },
  navButtonTextSelected: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  blackScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  blackScreenText: {
    color: 'white',
    fontSize: 24,
  },
  webViewContainer: {
    flex: 1,
  },
  webViewContent: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 10,
    backgroundColor: 'blue',
  },
});

export default App;
