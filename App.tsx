import React, {useEffect, useRef, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import { IPostData, IntegrationOption, KinesteXSDKCamera, Lifestyle, PlanCategory } from 'kinestex-sdk-react-native/src/types';


const App = () => {
  const [showKinesteX, setshowKinesteX] = useState(false);
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);


  const toggleKinesteX = () => {
    setshowKinesteX(!showKinesteX);
  };

  const postData: IPostData = {
    key: 'YOUR API KEY',
    userId: 'YOUR USER ID',
    company: 'YOUR COMPANY NAME',

    // FOR COMPLETE UX INTEGRATION - PLAN CATEGORY
    planCategory: PlanCategory.Cardio,

     // FOR CAMERA INTEGRATION 
    // currentExercise: 'Squats', 
    // exercises: ['Squats', 'Pushups', 'Jumping Jacks'],

    // FOR CHALLENGE INTEGRATION
    // countdown: 100, // countdown of challenge in seconds
    // exercise: 'Squats', // exercise for challenge

    // OPTIONAL USER DETAILS
    age: 25,
    height: 180, // in cm
    weight: 75, // in kg
    gender: 'Male', // can be only Male or Female
    lifestyle: Lifestyle.Active, // can be Sedentary, SlightlyActive, Active, VeryActive

  };

  const handleMessage = (type: string, data: { [key: string]: any }) => {
    switch (type) {
      case 'finished_workout':
        console.log('Received data:', data);
        break;
        case 'exit_kinestex':
          console.log("User wishes to exit the app", data);
          // Access specific key-value pairs
          if (data.message) {
            console.log('Date:', data.message);
          }
          toggleKinesteX();
          break;
      case 'error_occured':
        console.log('Error occured:', data);
        break;
      case "workout_opened":
        console.log('Workout opened:', data);
        break;
      
      case "plan_unlocked":
        console.log('Workout plan unlocked:', data);
        break;
      
      // all other cases 
      // ...

      // FOR CAMERA COMPONENT
      case "successful_repeat":
        // getting number of current reps and passing it in real-time
        console.log('Current rep:', data.value);
        break;
      case "mistake":
        // getting current mistake a person has made and passing it in real-time
        console.log('Mistake:', data.value);
        break;
      
      default:
        console.log('Unknown message type:', type, data);
        break;
    }
  };

  // For Camera component to change the exercise
  const changeExercise = () => {
    kinestexSDKRef.current?.changeExercise("Jumping Jack");
  };


  return (
    <SafeAreaView style={styles.container}>
      {!showKinesteX && (
        <View style={styles.buttonContainer}>
          <Button title="Open KinesteX" onPress={toggleKinesteX} />
        </View>
      )}

      {showKinesteX && (



        /* --- MAIN COMPONENT --- */
           <View style={styles.fullscreen}>
            <KinestexSDK 
              ref={kinestexSDKRef}
              data={postData} 
              integrationOption={IntegrationOption.MAIN}
              handleMessage={handleMessage} 
            />
        </View>




        /* --- PLAN COMPONENT --- */

        // <View style={styles.fullscreen}>
        //     <KinestexSDK 
        //       ref={kinestexSDKRef}
        //       data={postData} 
        //       integrationOption={IntegrationOption.PLAN}
        //       handleMessage={handleMessage} 
        //       plan={"Circuit Training"}
        //     />
        // </View>




       /* --- WORKOUT COMPONENT --- */

        // <View style={styles.fullscreen}>
        //     <KinestexSDK 
        //       ref={kinestexSDKRef}
        //       data={postData} 
        //       integrationOption={IntegrationOption.WORKOUT}
        //       handleMessage={handleMessage} 
        //       workout={"Circuit Training"}
        //     />
        // </View>




        /* -- CAMERA COMPONENT -- */

        // <View style={styles.fullscreen}>
        //     <KinestexSDK 
        //       ref={kinestexSDKRef}
        //       data={postData} 
        //       integrationOption={IntegrationOption.CAMERA}
        //       handleMessage={handleMessage} 
        //     />

        //   <Button title="Change Exercise" onPress={changeExercise} />
        // </View>

      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%', // Adjust the width as needed
  },
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayButton: {
    position: 'absolute',
    top: 50, // Adjust the position as needed
    right: 20, // Adjust the position as needed
  },
  camera: {
    flex: 1,
    width: '100%',
  },
});

export default App;

