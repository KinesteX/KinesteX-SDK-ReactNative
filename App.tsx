import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Animated, StatusBar } from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import { IntegrationOption, PlanCategory, KinesteXSDKCamera, IPostData } from 'kinestex-sdk-react-native/src/types';

const App = () => {
  const [showWebView, setShowWebView] = useState(true);
  const [selectedOption, setSelectedOption] = useState<'coach' | 'ai'>('ai');
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  const toggleWebView = (option: 'coach' | 'ai') => {
    setSelectedOption(option);
    setShowWebView(option === 'ai');
  };

  // we will use this postData for the MAIN, PLAN, AND WORKOUT Integration Option
  const postDataMAIN: IPostData = {
    key: 'YOUR API KEY',
    userId: 'YOUR USER ID',
    company: 'YOUR COMPANY NAME',
    planCategory: PlanCategory.Cardio, // plan category
    customParameters: {
    style: "dark", // dark or light theme (customizable in the admin dashboard)
    }
  };

  // we will use this postData for the CHALLENGE Integration Option
  const postDataChallenge: IPostData = {
    key: 'YOUR API KEY',
    userId: 'YOUR USER ID',
    company: 'YOUR COMPANY NAME',
    countdown: 100, // duration of the challenge in seconds
    exercise: 'Squats', // challenge exercise name
  };

  // we will use this postData for the CAMERA Integration Option
  const postDataCamera: IPostData = {
    key: 'YOUR API KEY',
    userId: 'YOUR USER ID',
    company: 'YOUR COMPANY NAME',
    currentExercise: 'Squats', // current exercise name
    exercises: ['Squats', 'Jumping Jack'] // array of expected exercises
  };

  // handle data from the kinestex sdk
  const handleMessage = (type: string, data: { [key: string]: any }) => {
    switch (type) {
      case 'finished_workout':
        console.log('Received data:', data);
        break;
      case 'kinestex_launched':
        break;
      case 'exit_kinestex':
        console.log("User wishes to exit the app", data);
        if (data.message) {
          console.log('Date:', data.message);
        }
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

  
  // setting another exercise for the CAMERA Integration Option
  // const changeExerciseCamera = () => {
  //   if (kinestexSDKRef.current) {
  //     kinestexSDKRef.current?.changeExercise('Jumping Jack');
  //   }
  // }

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
                  // change based on your use-case
                  data={postDataMAIN} 
                  // change based on your use-case: MAIN, PLAN, WORKOUT, CHALLENGE, EXPERIENCE, CAMERA
                  integrationOption={IntegrationOption.MAIN}
                  // handle data from the kinestex sdk
                  handleMessage={handleMessage} 
                  // If using the PLAN Integration Option, you must specify the plan name that you want to present: 
                  plan="Circuit Training"
                  // If using the WORKOUT Integration Option, you must specify the workout name that you want to present: 
                  workout="Fitness Lite"
                  // IF using EXPERIENCE Integration Option, you must specify the experience name that you want to present:
                  experience={"box"}
                />
              </View>
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
