# [Precise Motion Tracking and Analysis SDK](https://kinestex.com)
## Stay Ahead with KinesteX AI Motion Tracking.

## Available Integration Options

### Integration Options

| **Integration Option**         | **Description**                                                                                                 | **Features**                                                                                                                                     | **Details**                                                                                                             |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **Complete User Experience**   | Leave it to us to recommend the best workout routines for your customers, handle motion tracking, and overall user interface. High level of customization based on your brand book for a seamless experience. | - Long-term lifestyle workout plans <br> - Specific body parts and full-body workouts <br> - Individual exercise challenges (e.g., 20 squat challenge) | [View Integration Options](https://www.figma.com/proto/XYEoV023iSFdhpw3w65zR1/Complete?page-id=0%3A1&node-id=0-1&viewport=793%2C330%2C0.1&t=d7VfZzKpLBsJAcP9-1&scaling=contain) |
| **Custom User Experience**     | Integrate the camera component with motion tracking. Real-time feedback on all customer movements. Control the position, size, and placement of the camera component. | - Real-time feedback on customer movements <br> - Communication of every repeat and mistake <br> - Customizable camera component position, size, and placement | [View Details](https://www.figma.com/proto/JyPHuRKKbiQkwgiDTkGJgT/Camera-Component?page-id=0%3A1&node-id=1-4&viewport=925%2C409%2C0.22&t=3UccMcp1o3lKc0cP-1&scaling=contain) |

---
## Configuration

### Permissions

#### AndroidManifest.xml

Add the following permissions for camera and microphone usage:

```xml
<!-- Add this line inside the <manifest> tag -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET"/>
```

#### Info.plist

Add the following keys for camera and microphone usage:

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required for video streaming.</string>
```

### Install libraries

Install `kinestex-sdk` & `webview`:

```bash
npm install kinestex-sdk-react-native react-native-webview
```

**If you are using `expo` to build your app, you need to install `kinestex-sdk-react-native` with the following command:**

```bash
npx expo install react-native-webview
```

## Usage

### Initial Setup

1. **Prerequisites**: Ensure you’ve added the necessary permissions in `AndroidManifest.xml` and `Info.plist`.

2. **Launching the View**: To display the AI training, KinesteX SDK uses an internal webview library. We have multiple launch options in KinesteXSDK, and based on the option you select, you need to adjust the parameters you are sending to us.

### Integration Options

| **enum IntegrationOption** | **Description**                                                 |
|----------------------------|-----------------------------------------------------------------|
| **MAIN**                   | Integration of our Complete UX                                  |
| **PLAN**                   | Integration of Individual Plan Component                        |
| **WORKOUT**                | Integration of Individual Workout Component                     |
| **CHALLENGE**              | Integration of Individual Exercise in a challenge form          |
| **CAMERA**                 | Integration of our camera component with pose-analysis and feedback |

## MAIN Integration Option
### Available Categories to Sort Plans

| **Plan Category (key: planCategory)** |
|---------------------------------------|
| **Strength**                          |
| **Cardio**                            |
| **Weight Management**                 |
| **Rehabilitation**                    |

### Example Integration

1. Create a reference to KinesteXSDK component: 
```typescript
const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);
```

2. Create a `postData` object:
```typescript
const postData: IPostData = {
  key: apiKey, // your API key
  userId: 'YOUR USER ID', // your unique user identifier 
  company: 'YOUR COMPANY', // your company name
  planCategory: PlanCategory.Cardio, // plan category you'd like to present to your user
  age: 50, // Use null if you do not want to specify
  height: 150, // In cm. Use null if you do not want to specify
  weight: 200, // In kg. Use null if you do not want to specify
  gender: 'Male', // Use null if you do not want to specify
  lifestyle: Lifestyle.Sedentary, // Use null if you do not want to specify
};
```

3. Handle messages we send back to you according to what your users do in real-time:
```typescript
const handleMessage = (type: string, data: { [key: string]: any }) => {
  switch (type) {
    case 'exit_kinestex':
      console.log("User wishes to exit the app");
      if (data.message) {
        console.log('Date:', data.message);
      }
      dismissKinesteX(); // hide KinesteX WebView
      break;
    case "plan_unlocked":
      console.log('Workout plan unlocked:', data);
      break;
    // All other message types (see below in Data Points section)
    default:
      console.log('Other message type:', type, data);
      break;
  }
};
```

4. Display KinesteXSDK with Main Integration Option:
```typescript
<KinestexSDK 
  ref={kinestexSDKRef} 
  data={postData} 
  integrationOption={IntegrationOption.MAIN} 
  handleMessage={handleMessage} 
/>
```

## PLAN Integration Option

You do not have to specify planCategory in this integration option as you would specify the plan directly.
```typescript
<KinestexSDK 
  ref={kinestexSDKRef}
  data={postData} 
  integrationOption={IntegrationOption.PLAN} // PLAN integration option
  plan={"Circuit Training"} // exact name of the workout plan you want to display 
  handleMessage={handleMessage} 
/>
```

## WORKOUT Integration Option
```typescript
<KinestexSDK 
  ref={kinestexSDKRef}
  data={postData} 
  integrationOption={IntegrationOption.WORKOUT} // WORKOUT integration option
  workout={"Circuit Training"} // exact name of the workout you want to display
  handleMessage={handleMessage} 
/>
```

## CHALLENGE Integration Option
1. Modify `postData` to include the exercise and duration of the challenge:
```typescript
const postData: IPostData = {
  key: apiKey,
  userId: 'YOUR USER ID',
  company: "YOUR COMPANY NAME",
  exercise: 'Squats', // name of the exercise
  countdown: 100, // duration of challenge in seconds
};
```

2. Select integration option in KinesteXSDK:
```typescript
<KinestexSDK 
  ref={kinestexSDKRef}
  data={postData} 
  integrationOption={IntegrationOption.CHALLENGE}
  handleMessage={handleMessage} 
/>
```

## CAMERA Integration Option

1. Modify `postData` to include the current exercise and all expected exercises a person should do:
```typescript
const postData: IPostData = {
  key: apiKey,
  userId: 'YOUR USER ID',
  company: 'YOUR COMPANY NAME',
  currentExercise: 'Squats', // current exercise
  exercises: ['Squats', 'Jumping Jack'], // all exercises a person should do. We will preload them for future usage
};
```

2. Changing current exercise:
```typescript
const changeExercise = () => {
  kinestexSDKRef.current?.changeExercise("Jumping Jack"); // the exercise has to be from the list of exercises otherwise it wouldn't load
};
```

3. Displaying KinesteXSDK:
```typescript
<KinestexSDK 
  ref={kinestexSDKRef}
  data={postData} 
  integrationOption={IntegrationOption.CAMERA}
  handleMessage={handleMessage} 
/>
```

4. Handle message for reps and mistakes a person has done:
```typescript
const handleMessage = (type: string, data: { [key: string]: any }) => {
  switch (type) {
    case "successful_repeat":
      console.log('Current rep:', data.value);
      break;
    case "mistake":
      console.log('Mistake:', data.value);
      break;
    default:
      console.log('Unknown message type:', type, data);
      break;
  }
};
```

## Available Data Points

The KinesteX SDK provides various data points that are returned through the message callback. Here are the available data types:

| Type                       | Data                                                                                   | Description                                                                                               |
|----------------------------|----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `kinestex_launched`        | `dd mm yyyy hours:minutes:seconds`                                                      | When a user has launched KinesteX                                                                          |
| `exit_kinestex`            | `date: dd mm yyyy hours:minutes:seconds`, `time_spent: number`                          | Logs when a user clicks the exit button and the total time spent                                           |
| `plan_unlocked`            | `title: String, date: date and time`                                                    | Logs when a workout plan is unlocked by a user                                                            |
| `workout_opened`           | `title: String, date: date and time`                                                    | Logs when a workout is opened by a user                                                                   |
| `workout_started`          | `title: String, date: date and time`                                                    | Logs when a workout is started by a user                                                                  |
| `exercise_completed`       | `time_spent: number`, `repeats: number`, `calories: number`, `exercise: string`, `mistakes: [string: number]` | Logs each time a user finishes an exercise                                                                 |
| `total_active_seconds`     | `number`                                                                                | Logs every 5 seconds, counting the active seconds a user has spent working out                            |
| `left_camera_frame`        | `number`                                                                                | Indicates that a user has left the camera frame                                                           |
| `returned_camera_frame`    | `number`                                                                                | Indicates that a user has returned to the camera frame                                                    |
| `workout_overview`         | `workout: string`, `total_time_spent: number`, `total_repeats: number`, `total_calories: number`, `percentage_completed: number`, `total_mistakes: number` | Logs a complete summary of the workout                                                                    |
| `exercise_overview`        | `[exercise_completed]`                                                                 | Returns a log of all exercises and their data                                                             |
| `workout_completed`        | `workout: string`, `date: dd mm yyyy hours:minutes:seconds`                             | Logs when a user finishes the workout and exits the workout overview                                      |
| `active_days` (Coming soon)| `number`                                                                                | Represents the number of days a user has been opening KinesteX                                             |
| `total_workouts` (Coming soon)| `number`                                                                            | Represents the number of workouts a user has done since starting to use KinesteX                          |
| `workout_efficiency` (Coming soon)| `number`                                                                        | Represents the level of intensity with which a person has completed the workout                           |
## Contact

If you have any questions, contact: [support@kinestex.com](mailto:support@kinestex.com)
