# [KinesteX AI](https://kinestex.com)
## INTEGRATE AI FITNESS & PHYSIO TRAINER IN YOUR APP IN MINUTES

## Configuration

#### AndroidManifest.xml

Add the following permissions for camera and microphone usage:

```xml
<!-- Add this line inside the <manifest> tag -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.VIDEO_CAPTURE" />

```

#### Info.plist

Add the following keys for camera and microphone usage:

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required for video streaming.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Microphone access is required for video streaming.</string>
```
#### WebView library

Install `kinestex-sdk` & `webview`:

```
npm install kinestex-sdk-react-native react-native-webview

```

### Available categories to sort plans (param key is planC): 

| **Plan Category (key: planC)** | 
| --- | 
| **Strength** | 
| **Cardio** |
| **Weight Management** | 
| **Rehabilitation** | 

Pleae note that the default plan category is Strength and all of the plans will be displayed under that category.


### Available categories and sub categories to sort workouts: 

| **Category (key: category)** |
| --- | 
| **Fitness** | 
| **Rehabilitation** | 


## Available parameters:
```jsx
  const postData = {
// REQUIRED
    userId: 'YOUR USER ID',
    company: 'YOUR COMPANY', // contact KinesteX
    key: apiKey, // STORE KEY SECURELY. WE RECOMMEND STORING AND RETRIEVING IT FROM YOUR DATABASE
    planC: 'Cardio',
// OPTIONAL
    category: 'Fitness', // Workout category, leave null if you do not want to show workouts separately from plans
    age: 50, // can be left null
    height: 150, // in cm. can be left null
    weight: 200, // in kg. can be left null
    gender: 'Male' // can be left null
  };
```
### Data handling: 

```jsx

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

        default:
          console.log('Message type:', type);
          break;
        
      }
      
  };

```


 **Data options**:
    The core of the `handleMessage` function is a switch statement that checks the `type` property of the parsed message. Each case corresponds to a different type of action or event that occurred in the KinesteX SDK.
   
    
| Dype          | Data  |          Description     |
|----------------------|----------------------------|---------------------------------------------------------|
| `kinestex_launched`  | Format: `dd mm yyyy hours:minutes:seconds` | When a user has launched KinesteX 
| `exit_kinestex`     | - | Logs when a user clicks on exit button, requesting dismissal of KinesteX    |
| `plan_unlocked`    | Format: `title: String, @date and time` | Logs when a workout plan is unlocked by a user    |
| `workout_opened`      | Format: `title: String, @date and time` | Logs when a workout is opened by a user  |
| `workout_started`   |  Format: `title: String, @date and time`| Logs when a workout is started.  |                                                  
| `exercise_completed`      | Format:   `timeSpent: number`,  `repeats: number`, `calories: number`,  `exercise: string`  |  Logs everytime a user does a repetition of an exercise correctly |
| `total_active_seconds` | Format: `number`   |   Logs every `5 seconds` and counts the number of active seconds a user has spent working out. This value is not sent when a user leaves camera tracking area  |
| `left_camera_frame` | Format: `number`  |  Indicates that a user has left the camera frame. The data sent is the current number of `total_active_seconds` |
| `returned_camera_frame` | Format: `number`  |  Indicates that a user has returned to the camera frame. The data sent is the current number of `total_active_seconds` |


------------------

## Displaying KinesteX:
```jsx
   <KinestexSDK data={postData} handleMessage={handleMessage} />
```


------------------

## Contact:
If you have any questions contact: support@kinestex.com
