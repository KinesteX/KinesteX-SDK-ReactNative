import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, StatusBar} from 'react-native';

import {
  DropdownSelector,
  MainComponent,
  PlanComponent,
  WorkoutComponent,
  ChallengeComponent,
  ExperienceComponent,
  CameraComponent,
  LeaderboardComponent,
  ComponentType,
} from './src/components';
import PersonalizedPlanComponent from './src/components/PersonalizedPlanComponent';

const App = () => {
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentType | null>(null);

  // handle data from the kinestex sdk
  const handleMessage = (type: string, data: {[key: string]: any}) => {
    switch (type) {
      case 'finished_workout':
        console.log('Received data:', data);
        break;
      case 'kinestex_launched':
        console.log('KinesteX launched');
        break;
      case 'exit_kinestex':
        console.log('User wishes to exit the app', data);
        if (data.message) {
          console.log('Date:', data.message);
        }
        setSelectedComponent(null);
        break;
      case 'error_occured':
        console.log('Error occured:', data);
        break;
      case 'plan_unlocked':
        console.log('Workout plan unlocked:', data);
        break;
      default:
        console.log('Unknown message type:', type, data);
        break;
    }
  };

  const renderSelectedComponent = () => {
    if (!selectedComponent) {
      return (
        <View style={styles.welcomeScreen}>
          <Text style={styles.welcomeText}>Welcome to KinesteX SDK Demo</Text>
          <Text style={styles.instructionText}>
            Please select an integration option from the dropdown above to get
            started.
          </Text>
        </View>
      );
    }

    switch (selectedComponent) {
      case 'main':
        return <MainComponent onMessage={handleMessage} />;
      case 'plan':
        return <PlanComponent onMessage={handleMessage} />;
      case 'workout':
        return <WorkoutComponent onMessage={handleMessage} />;
      case 'challenge':
        return <ChallengeComponent onMessage={handleMessage} />;
      case 'experience':
        return <ExperienceComponent onMessage={handleMessage} />;
      case 'camera':
        return <CameraComponent onMessage={handleMessage} />;
      case 'leaderboard':
        return <LeaderboardComponent onMessage={handleMessage} />;
      case 'personalized-plan':
        return <PersonalizedPlanComponent onMessage={handleMessage} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        <DropdownSelector
          selectedComponent={selectedComponent}
          onComponentChange={setSelectedComponent}
        />
        <View style={styles.content}>{renderSelectedComponent()}</View>
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
  content: {
    flex: 1,
  },
  welcomeScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default App;
