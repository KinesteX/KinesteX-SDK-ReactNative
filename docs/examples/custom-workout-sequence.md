The Custom Workout feature allows you to create and execute personalized workout sequences with custom exercises, repetitions, durations, and rest periods. This feature integrates with the KinesteX SDK via postMessage communication.

```ts
import { StyleSheet, View, Button, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import KinestexSDK from "kinestex-sdk-react-native";
import { KinesteXSDKCamera, WorkoutSequenceExercise, IPostData, IntegrationOption } from "kinestex-sdk-react-native/src/types";

export default function HomeScreen() {
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);
  const [permission, requestPermission] = useState(false);
  const [allResourcesLoaded, setAllResourcesLoaded] = useState(false);
  const [showKinestex, setShowKinestex] = useState(true);
  // workout sequence of exercises
  const customWorkoutExercises: WorkoutSequenceExercise[] = [
    {
      exerciseId: "jz73VFlUyZ9nyd64OjRb", // exercise id from kinestex api or admin panel
      reps: 15, // reps for the exercise
      duration: null, // duration for the exercise (null if not applicable and person has unlimited time to complete specified number of reps)
      includeRestPeriod: true, // include rest period before the exercise
      restDuration: 20, // rest duration in seconds before the exercise
    },
    {
      exerciseId: "ZVMeLsaXQ9Tzr5JYXg29",
      reps: 10,
      duration: 30,
      includeRestPeriod: true,
      restDuration: 15,
    },
    {
      exerciseId: "ZVMeLsaXQ9Tzr5JYXg29",
      reps: 10,
      duration: 30,
      includeRestPeriod: true,
      restDuration: 15,
    },
    {
      exerciseId: "gJGOiZhCvJrhEP7sTy78",
      reps: 20,
      duration: null,
      includeRestPeriod: false,
      restDuration: 0,
    },
  ];
  // data that is sent on launch for verification and construction of the workout
  const postData: IPostData = {
    key: YOUR_API_KEY,
    company: YOUR_COMPANY_NAME,
    userId: "97152084",
    customParameters: {
      style: "dark",
    },
    customWorkoutExercises: customWorkoutExercises,
  };

  // request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        requestPermission(true);
      }
    })();
  }, []);

  // handle messages from the package
  const handleMessage = (type: string, data: { [key: string]: any }) => {
    switch (type) {
      case "exit_kinestex":
        console.log("User wishes to exit the app");
        setAllResourcesLoaded(false);
        if (data.message) {
          console.log("Date:", data.message);
        }
        break;
      case "workout_exit_request":
        console.log("Workout exit request:", data);
        setAllResourcesLoaded(false);
        setShowKinestex(false);
        break;
      case "all_resources_loaded":
        console.log("All resources loaded:", data);
        setAllResourcesLoaded(true);
        kinestexSDKRef.current?.sendAction("workout_activity_action", "start");
        break;
      case "workout_overview":
        console.log("Workout overview:", data);
      case "error_occurred":
        console.log("Error occurred:", data);
        break;
      default:
        console.log("Other message type:", type, data);
        break;
    }
  };

  if (permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.statusText}>
          {!showKinestex
            ? "KinesteX is not activated"
            : allResourcesLoaded
            ? "All resources loaded"
            : "KinesteX is loading in background"}
        </Text>
        <View
          style={[
            styles.sdkContainer,
            showKinestex && !allResourcesLoaded && styles.hiddenSdkContainer,
          ]}
        >
          {showKinestex ? (
            <KinestexSDK
              ref={kinestexSDKRef}
              data={postData}
              integrationOption={IntegrationOption.CUSTOM_WORKOUT}
              handleMessage={handleMessage}
            />
          ) : null}
          {!showKinestex ? (
            <View style={styles.statusText}>
              <Button
                title="Show Kinestex Again"
                onPress={() => setShowKinestex(true)}
              />
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  statusText: {
    padding: 8,
    textAlign: "center",
    color: "white",
  },
  launchContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  sdkContainer: {
    flex: 1,
  },
  hiddenSdkContainer: {
    width: 0,
    height: 0,
    overflow: "hidden",
  },
});

```
