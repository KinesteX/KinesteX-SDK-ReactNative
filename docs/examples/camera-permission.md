## Requesting camera permission in app
By default, KinesteX tries to request camera permission through webview, this means that a person will see the origin url, and if you would like your users to see your app's name when the permission dialog is displayed, we need to handle camera permission requests on app level:
### 1. Install react-native-permission and add setup script in ios/Podfile: https://www.npmjs.com/package/react-native-permissions
### 2. Add camera permission handler in ios/Podfile add:
```ts
setup_permissions([
  'Camera',
])
```
### 3. Request camera permission before initializing KinesteXSDK: 
```ts
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
...
const [showKinesteX, setshowKinesteX] = useState(false);
 useEffect(() => {
    requestCameraPermission(); // request camera permission on launch or user action
  }, []);
  
  const requestCameraPermission = async () => {
    try {
      const result = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      );
      
      if (result === RESULTS.DENIED) {
        const requestResult = await request(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA
        );
        handlePermissionResult(requestResult);
      } else {
        handlePermissionResult(result);
      }
    } catch (error) {
      Alert.alert('Camera permission request error: ' + error);
    }
  };

  const handlePermissionResult = (result: string) => {
    if (result === RESULTS.GRANTED) {
      // camera permission granted, display KinesteXSDK
      setshowKinesteX(true);
    } else if (result === RESULTS.DENIED) {
      Alert.alert('Camera Permission', 'You need to allow camera access to use this feature.');
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert('Camera Permission', 'Camera access is blocked. Please enable it in settings.');
    }
  };

...
{showKinesteX && (
            <View style={styles.webViewContainer}>
              <View style={styles.webViewContent}>
                <KinestexSDK 
                  ref={kinestexSDKRef}
                  data={postDataMAIN}
                  integrationOption={IntegrationOption.MAIN}
                  handleMessage={handleMessage}
                  plan="Circuit Training"
                />
              </View>
            </View>
          )}
```

### Complete Demo Code: 
```ts
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, StatusBar, Alert, Platform } from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import { IntegrationOption, PlanCategory, KinesteXSDKCamera, IPostData } from 'kinestex-sdk-react-native/src/types';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const App = () => {
  const [showKinesteX, setshowKinesteX] = useState(false);
  const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);

  useEffect(() => {
    requestCameraPermission(); // request camera permission on launch or user action
  }, []);
  
  const requestCameraPermission = async () => {
    try {
      const result = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      );
      
      if (result === RESULTS.DENIED) {
        const requestResult = await request(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA
        );
        handlePermissionResult(requestResult);
      } else {
        handlePermissionResult(result);
      }
    } catch (error) {
      Alert.alert('Camera permission request error: ' + error);
    }
  };

  const handlePermissionResult = (result: string) => {
    if (result === RESULTS.GRANTED) {
      // camera permission granted, display KinesteXSDK
      setshowKinesteX(true);
    } else if (result === RESULTS.DENIED) {
      Alert.alert('Camera Permission', 'You need to allow camera access to use this feature.');
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert('Camera Permission', 'Camera access is blocked. Please enable it in settings.');
    }
  };


  const postDataMAIN: IPostData = {
    key: 'YOUR API KEY',
    userId: 'YOUR USER ID',
    company: 'YOUR COMPANY NAME',
    planCategory: PlanCategory.Cardio, 
  };

  const handleMessage = (type: string, data: { [key: string]: any }) => {
    switch (type) {
      case 'finished_workout':
        console.log('Received data:', data);
        break;
      case 'kinestex_launched':
        break;
      case 'exit_kinestex':
        console.log("User wishes to exit the app", data);
        setshowKinesteX(false);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        <View style={styles.navBar}>
        <TouchableOpacity
            style={[
              styles.navButton,
              showKinesteX && styles.navButtonSelected,
            ]}
            onPress={requestCameraPermission}
          >
            <Text
              style={[
                styles.navButtonText,
                showKinesteX && styles.navButtonTextSelected,
              ]}
            >
              AI coach
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {!showKinesteX && (
            <View style={styles.blackScreen}>
              <Text style={styles.blackScreenText}>Click on AI Coach to launch</Text>
            </View>
          )}
          {showKinesteX && (
            <View style={styles.webViewContainer}>
              <View style={styles.webViewContent}>
                <KinestexSDK 
                  ref={kinestexSDKRef}
                  data={postDataMAIN}
                  integrationOption={IntegrationOption.MAIN}
                  handleMessage={handleMessage}
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
});

export default App;

```