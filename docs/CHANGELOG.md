## [1.2.6] - Nov 14 2025

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
```
3. You might want to update styles as well following our new guidelines. Please review [getting-started.md](./getting-started.md)