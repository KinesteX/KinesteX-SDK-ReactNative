### Minimum Device Requirements: 
- iOS: iOS 14.0 or higher

## Configuration

### 1. Add Permissions


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
### 2. Install KinesteX and react-native-webview packages
Install `kinestex-sdk` & `webview`:

```bash
npm install kinestex-sdk-react-native react-native-webview
```

**If you are using `expo` to build your app, you need to install `react-native-webview` with the following command:**

```bash
npx expo install react-native-webview
```

### 3. Setup recommendations
1. Create a reference to KinesteXSDK component: 
```typescript
const kinestexSDKRef = useRef<KinesteXSDKCamera>(null);
```

2. Create initial `postData` object to communicate data with KinesteX:
```typescript
const postData: IPostData = {
  key: apiKey, // your API key
  userId: 'YOUR USER ID', // your unique user identifier. Can be any string, but must be unique for each user. 
  company: 'YOUR COMPANY', // your company name

  customParameters: {
    style: "dark", // dark or light theme (customizable in the admin dashboard)
  },

  // OPTIONAL UserDetails used to make customized intensity of the workout and properly estimate calories burnt
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
# Next Steps
### **[> Available Integration Options](integration/overview.md)**
### **[> Explore Available Data Points](data.md)**


