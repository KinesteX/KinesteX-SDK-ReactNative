Complete code example for the `PLAN` Integration Option:
```ts
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import KinestexSDK from 'kinestex-sdk-react-native';
import { IntegrationOption, PlanCategory, IPostData } from 'kinestex-sdk-react-native/src/types';

const App = () => {
  // Define the post data for integration
  const postData: IPostData = {
    key: 'YOUR_API_KEY',
    userId: 'YOUR_USER_ID',
    company: 'YOUR_COMPANY_NAME',

    style: {
      style: 'dark', // dark or light theme (customizable in the admin dashboard)
      // themeName: company name - by default we create you a theme with your company name, but if you create other themes, you can pass in their names here
      loadingBackgroundColor: '000000', // value in hex (without #) to customize bg for initial loading screen
      // loadingStickmanColor: string // value in hex (without #) to customize strickman color for initial loading screen
      // loadingTextColor: string // value in hex (without #) to customize text color for initial loading screen
  },
  };

  // Handle messages from the SDK
  const handleMessage = (type: string, data: { [key: string]: any }) => {
    switch (type) {
      case 'finished_workout':
        console.log('Workout finished:', data);
        break;
      case 'kinestex_launched':
        console.log('KinesteX launched');
        break;
      case 'exit_kinestex':
        console.log('User exited KinesteX:', data);
        break;
      case 'error_occured':
        console.log('Error occurred:', data);
        break;
      case "plan_unlocked":
        console.log('Workout plan unlocked:', data);
        break;
      default:
        console.log('Unknown message type:', type, data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KinestexSDK 
        data={postData}
        integrationOption={IntegrationOption.PLAN}
        plan={"Circuit Training"} // exact name or ID of the workout plan you want to display 
        handleMessage={handleMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  }
});

export default App;
```