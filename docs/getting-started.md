### Minimum Device Requirements: 
- iOS: iOS 14.0 or higher

## Configuration

### 1. Add Permissions


#### AndroidManifest.xml

Add the following permissions for camera usage:

```xml
<!-- Add this line inside the <manifest> tag -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET"/>
<uses-feature android:name="android.hardware.camera" android:required="false" />
<!-- Optional: To detect device orientation when prompting to position phone correctly-->
<uses-feature android:name="android.hardware.sensor.accelerometer" android:required="false" />
<uses-feature android:name="android.hardware.sensor.gyroscope" android:required="false" />
```

#### Info.plist

Add the following keys for camera usage:

```xml
<key>NSCameraUsageDescription</key>
<string>Please grant access to camera to start AI Workout</string>
<key>NSMotionUsageDescription</key>
<string>We need access to your device's motion sensors to properly position your phone for the workout</string>
```
### 2. Install KinesteX package and react-native-webview
Install `kinestex-sdk` & `webview`:

```bash
npm install kinestex-sdk-react-native react-native-webview
```

**If you are using `expo` to build your app, you need to install `react-native-webview` with the following command:**

```bash
npx expo install react-native-webview
```

### 3: Enable device orientation permission for  iOS 15+
`react-native-webview` does not currently support the iOS 15+ permission API for Device Motion/Orientation automatically. To ensure KinesteX works correctly on iOS, you must apply a small patch to the webview package.

1. Install patch-package
```bash
npm install patch-package postinstall-postinstall --save-dev
```

2. Edit your package.json

Add "postinstall": "patch-package" to your scripts:

```json
"scripts": {
  "postinstall": "patch-package"
}
```
3. Apply the Fix

- Navigate to **node_modules/react-native-webview/apple/RNCWebViewImpl.m.**

- Open the file and look for `requestMediaCapturePermissionForOrigin`

- Right after the function call after line 1312, paste:
```c
/**
 * Device Orientation and Motion permissions (prevent multiple prompts)
 */
- (void)                         webView:(WKWebView *)webView
  requestDeviceOrientationAndMotionPermissionForOrigin:(WKSecurityOrigin *)origin
                        initiatedByFrame:(WKFrameInfo *)frame
                         decisionHandler:(void (^)(WKPermissionDecision decision))decisionHandler {
  (void)webView;
  (void)origin;
  (void)frame;
  decisionHandler(WKPermissionDecisionGrant);
}
```
How it should look like:
<img width="1068" height="831" alt="Screenshot 2025-11-19 at 3 35 25 PM" src="https://github.com/user-attachments/assets/a29fe410-ff24-4635-b450-70c9d9b6f7b5" />


4. Save the Patch


Run the following command to create a permanent patch file:
```bash
npx patch-package react-native-webview
```
Now, every time you (or your team) run npm install, this fix will be applied automatically.



### 4. Setup recommendations
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
  style: {
      style: 'dark', // dark or light theme (customizable in the admin dashboard)
      // themeName: company name - by default we create you a theme with your company name, but if you create other themes, you can pass in their names here
      loadingBackgroundColor: '000000', // value in hex (without #) to customize bg for initial loading screen
      // loadingStickmanColor: string // value in hex (without #) to customize strickman color for initial loading screen
      // loadingTextColor: string // value in hex (without #) to customize text color for initial loading screen
  },
  customParameters: {
  // language: 'es' // to customize language. please ensure proper translations exist in admin portal for the content you want to display
  // any other customization parameters
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

### 5. Camera permission (Expo Android troubleshoot)
In Android when building app with Expo, App level camera permission is not passed to the webview, so even if the camera permission dialog pops up, camera request in KinesteX never resolves. 
To fix this:
- Install expo-camera `npx expo install expo-camera`
- In app.json: 
```json
{
    "expo": {
    "android": {
      "permissions": ["android.permission.CAMERA"],
     },

    "ios": {
     "infoPlist": {
        "NSCameraUsageDescription": "For AI Motion Tracking to function please enable camera access. All processing is done on device"
      },
    }
  }
}
```
- In your component before displaying KinesteX Present a modal requesting camera permission and ensure it is granted: 
```ts
  const [permission, requestPermission] = useState(false); // to track permission status

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        requestPermission(true);
      }
    })();
  }, []);

  if (permission) {
   // display KinesteXSDK View (check Next Steps)
  }
```
# Next Steps
### **[> Available Integration Options](integration/overview.md)**
### **[> Explore Available Data Points](data.md)**


