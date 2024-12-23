Complete code example for the `MAIN` Integration Option:
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
    planCategory: PlanCategory.Cardio,
    customParameters: {
      style: "dark"
    }
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
        integrationOption={IntegrationOption.MAIN}
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