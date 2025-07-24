# KinesteX SDK Components

This directory contains organized components for different KinesteX SDK integration options. Each component is self-contained and demonstrates a specific use case of the KinesteX SDK.

## Components

### 1. MainComponent

- **Integration Option**: `MAIN`
- **Description**: The main integration that provides access to the complete KinesteX experience with workout plans, exercises, and analytics.
- **Configuration**: Uses `PlanCategory.Cardio` with dark theme.

### 2. PlanComponent

- **Integration Option**: `PLAN`
- **Description**: Displays a specific workout plan. Users can browse and start workouts within the selected plan.
- **Configuration**: Configured to show the "Circuit Training" plan.

### 3. WorkoutComponent

- **Integration Option**: `WORKOUT`
- **Description**: Shows a specific workout session that users can follow along with.
- **Configuration**: Configured to show the "Fitness Lite" workout.

### 4. ChallengeComponent

- **Integration Option**: `CHALLENGE`
- **Description**: Presents a fitness challenge with a countdown timer and leaderboard integration.
- **Configuration**: 100-second "Squats" challenge with leaderboard enabled.

### 5. ExperienceComponent

- **Integration Option**: `EXPERIENCE`
- **Description**: Provides access to AI-powered fitness experiences.
- **Configuration**: Configured to show the "box" experience.

### 6. CameraComponent

- **Integration Option**: `CAMERA`
- **Description**: Real-time motion analysis and exercise detection using the device camera.
- **Configuration**: Supports "Squats" and "Jumping Jack" exercises with ability to switch between them.
- **Special Features**: Includes a button to dynamically change exercises.

### 7. LeaderboardComponent

- **Integration Option**: `LEADERBOARD`
- **Description**: Displays community leaderboards and user rankings.
- **Configuration**: Standard leaderboard integration.

### 8. DropdownSelector

- **Description**: A dropdown component that allows users to select which KinesteX integration to view.
- **Features**:
  - Styled dropdown with dark theme
  - Type-safe component selection
  - Responsive design for iOS and Android

## Usage

The main App component uses the DropdownSelector to allow users to choose between different integration options. Each component handles the KinesteX SDK messages through a shared `handleMessage` function that logs events and manages navigation.

## Key Features

- **Modular Design**: Each integration option is in its own component for easy maintenance and customization.
- **Shared Message Handling**: All components use the same message handler for consistent behavior.
- **Type Safety**: Full TypeScript support with proper typing for all components.
- **Responsive UI**: Components work on both iOS and Android platforms.
- **Easy Navigation**: Dropdown selector allows seamless switching between different integrations.

## Configuration

To use these components with your own KinesteX account:

1. Replace `'YOUR API KEY'` with your actual API key
2. Replace `'YOUR USER ID'` with your user identification system
3. Replace `'YOUR COMPANY NAME'` with your company name
4. Customize plan names, workout names, and experience names as needed

## Integration Options Overview

| Integration | Use Case                  | Best For                    |
| ----------- | ------------------------- | --------------------------- |
| MAIN        | Complete fitness platform | Full-featured fitness apps  |
| PLAN        | Specific workout plans    | Structured fitness programs |
| WORKOUT     | Individual workouts       | Quick workout sessions      |
| CHALLENGE   | Timed challenges          | Gamification and engagement |
| EXPERIENCE  | AI experiences            | Interactive fitness content |
| CAMERA      | Motion analysis           | Real-time form checking     |
| LEADERBOARD | Social features           | Community engagement        |
