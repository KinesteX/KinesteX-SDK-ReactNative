## [1.3.2] - Sep 3 2026
### Added
- `onContentProcessDidTerminate` (iOS) and `onRenderProcessGone` (Android) handlers on the internal WebView. When the OS kills the WebView process (memory pressure on older iPads during pose tracking), the SDK now reloads the view instead of leaving a blank screen, and forwards an `error_occurred` message (`errorCode: content_process_terminated` / `render_process_gone`) to your `handleMessage`.
- `error_occurred` messages coming from the KinesteX page (for example `"Error accessing camera"`) are now also logged with `console.warn("KinesteX error_occurred: ...")`, so they are visible in device logs even if your `handleMessage` does not log them.

### Notes
- No API changes. Update with `npm install kinestex-sdk-react-native@1.3.2`.
- If a user reports a blank camera box on iPad, ask them to fully close and relaunch the app, then check your logs for `error_occurred` messages from the SDK.

## [1.2.7] - Nov 19 2025
### Changed
- Removed `kinestex-react-native-webview` as a direct dependency. It didn't prove to scale and users reported running into duplication issues if they already use react-native-webview, so instead of patching the iOS issue ourselves and republishing the react-native-webview ourselves, we decided to provide patch instructions. This is the simplest and most reliable approach. 
- Please review [getting-started.md](./getting-started.md) for migration steps 

## [1.2.6 - **DEPRECATED**] - Nov 14 2025

### Added
- Introduced `kinestex-react-native-webview` as a direct dependency. This is our dedicated fork of `react-native-webview`, providing improved permission handling and a more robust integration with KinesteX features.

### Changed
- Enhanced style customization: SDK now exposes a direct interface for dynamic style management, making it easier to adjust themes, colors, and appearance-related settings at runtime.

### Notes
- Please see the updated [getting-started.md](./getting-started.md) for migration steps and full documentation of the new style customization interface and usage of the webview dependency.

### Migration Guide
1. Please remove kinestex-sdk-react-native and react-native-webview from all dependencies and clean your react native environent from cache before installing new packages: 
```
rm -rf node_modules package-lock.lock
npx react-native clean
```
2. Install kinestex-sdk-react-native and kinestex-react-native-webview: 
```
npm install kinestex-sdk-react-native kinestex-react-native-webview
cd ios
pod install
```
3. You might want to update styles as well following our new guidelines. Please review [getting-started.md](./getting-started.md)
