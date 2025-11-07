## Custom Workout Feature Documentation

### Overview
The Custom Workout feature allows you to create and execute personalized workout sequences with custom exercises, repetitions, durations, and rest periods. This feature integrates with the KinesteX SDK via `postMessage` communication.

---

## How Custom Workouts Work

### 1. Initial Setup
When integrating custom workouts, you need to:
- Initialize the KinesteX SDK with `view: "CUSTOM_WORKOUT_VIEW"`.
- Send initial configuration including your custom workout exercises.
- Wait for the ready signal from the SDK.
- Send the start command to begin the workout.

### 2. Workout Flow Sequence

```
┌─────────────────────────────────────────────────────┐
│ 1. SDK Initialization                               │
│    - User opens custom workout view                 │
│    - SDK sends: custom_workout_ready                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. Verification & Setup                             │
│    - Host sends initial data with customWorkout-    │
│      Exercises array                                │
│    - SDK validates exercises                        │
│    - SDK loads AI models & assets in parallel       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. Resource Loading                                 │
│    - Exercise AI models load                        │
│    - Audio files load                               │
│    - MediaPipe initializes                          │
│    - SDK sends: all_resources_loaded                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 4. Start Command                                    │
│    - Host sends: workout_activity_action: "start"   │
│    - SDK navigates to workout execution             │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 5. Workout Execution                                │
│    - User performs exercises                        │
│    - SDK tracks motion & provides feedback          │
│    - Rest periods occur between exercises (if set)  │
└─────────────────────────────────────────────────────┘
```

---

## Sending Custom Workout Data via postMessage

### Step 1: Initial Configuration
When initializing the SDK, send your custom workout exercises in the `customWorkoutExercises` field:

```ts

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
// duplicate of the exercise above to create a set
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

  // pass the custom workout exercises
  const postData: IPostData = {
     // ... all other fields from setup
    customWorkoutExercises: customWorkoutExercises,
  };
```

### Step 2: Listen for Ready Signal
After sending the initial configuration, wait for the SDK to signal that it's ready and all resources are loaded:

```js
const handleMessage = (type: string, data: { [key: string]: any }) => {
    switch (type) {
      ...
      case "all_resources_loaded":
        console.log("All resources loaded:", data);
        // display KinesteX view now
        setAllResourcesLoaded(true);
        // send an action to start the workout flow
        kinestexSDKRef.current?.sendAction("workout_activity_action", "start");
        break;
    }
  };
```
### Step 3: Display the View and change its visibility conditionally if allResourcesLoaded is true: 
```ts
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
        </View>
```

# Next steps:
- ### [View handleMessage available data points](../../data.md)
- ### [View complete code example](../../examples/custom-workout-sequence.md)
- ### [Explore more integration options](../overview.md)
