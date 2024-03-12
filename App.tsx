import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';

const App = () => {

  const [showWebView, setShowWebView] = useState(false);
  
  const toggleWebView = () => {
    setShowWebView(!showWebView);
  };


  const postData = {
    key: 'YOUR API KEY',
    userId: 'YOUR USER ID',
    planC: 'Weight Management',
    category: 'Fitness', // Use null if you do not want to show workouts
    company: 'YOUR COMPANY', 
    age: 50, // Use null if you do not want to specify
    height: 150, // In cm. Use null if you do not want to specify
    weight: 200, // In kg. Use null if you do not want to specify
    gender: 'Male', // Use null if you do not want to specify
  };

  const handleMessage = (type: string, data: string) => {

      switch (type) {

        case 'finished_workout':
          console.log('Received data:', data);
          break;

        case 'exitApp':
          // Make sure to close the webview when the user wishes to exit the app
          console.log("User wishes to exit the app");
          toggleWebView();
          break;

        case 'error_occured':
          console.log('Error occured:', data);
          break;

        case "workoutOpened":
            console.log('Workout opened:', data);
            break;
        case "workoutStarted":
            console.log('Workout started:', data);
            break;
        case "plan_unlocked":
          console.log('Workout plan unlocked:', data);
          break;

        default:
          console.log('Unknown message type:', type);
          break;
        
      }
      
  };


  return (
    <SafeAreaView style={styles.container}>
      {!showWebView && <Button title="Open WebView" onPress={toggleWebView} />}
      {showWebView && (
        <KinestexSDK data={postData} handleMessage={handleMessage} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({container: {flex: 1}});

export default App;
