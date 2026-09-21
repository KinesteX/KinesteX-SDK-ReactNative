### Warmup: Open KinesteX Instantly

- **Optional**: Without the new props the SDK behaves exactly as before.
- **Two modes**: Warm up the exact screen you will open, or warm up the caches when you do not know yet.
- **Safe by default**: If a warmup fails or goes out of date, KinesteX simply loads fresh when shown, like a normal launch.

Available from `kinestex-sdk-react-native` 1.4.0.

# **When you know what you will open**

Render the same component you would normally render, with `visible={false}`. It loads off screen with zero size and takes no space in your layout. Set `visible` to `true` to show it.

```typescript
const [isOpen, setIsOpen] = useState(false);

// Keep `data` stable. The page reads it once, so a changed object means a fresh load.
const postData = useMemo(() => ({ key, userId, company }), []);

<KinestexSDK
  data={postData}
  integrationOption={IntegrationOption.WORKOUT}
  workout={"Fitness Lite"}
  visible={isOpen}                       // false = warm up hidden, true = show
  onWarmupStateChange={(state) => {}}    // optional: "loading" | "ready" | "failed"
  handleMessage={handleMessage}
/>
```

Hide it again on exit instead of unmounting it:

```typescript
const handleMessage = (type: string, data: { [key: string]: any }) => {
  if (type === "exit_kinestex") {
    setIsOpen(false);
  }
};
```

### Rules that matter

- `visible` must only say whether the user has KinesteX open. Never derive it from `onWarmupStateChange`, for example `visible={isOpen && state === "ready"}`. A view that loads fresh when shown reports `loading` again, which would hide it and loop. Use the state only for your own UI.
- While hidden, `handleMessage` receives nothing. Messages such as `kinestex_launched` are delivered in order the moment you show the view.
- The component must stay mounted in the same place between warming and showing. With React Navigation, mount it once above your navigator and let it fill the screen only while open, so it never blocks touches while hidden:

```typescript
<View style={isOpen ? StyleSheet.absoluteFill : undefined} pointerEvents="box-none">
  <KinestexSDK visible={isOpen} {...rest} />
</View>
```

- When shown, the SDK loads fresh if `data` or the target changed while hidden, if the hidden load failed, or if the warm page is older than 15 minutes.
- `CAMERA`, `EXPERIENCE` and any launch using `instantRedirect` could open the camera on load, so while hidden they only warm the caches. The real page loads when shown.
- Setting `visible` back to `false` replaces the used page with a light warmup page. The next open is a normal load from warm caches, not an instant one.
- A hidden load of a real page is a real page load for KinesteX. It is recorded in analytics as an open, even if the user never sees it. Warm up when the user is likely to open KinesteX, not on every app start.
- Keep a single hidden instance, and unmount it when the user is unlikely to open KinesteX soon. A warmed instance holds the full web app and its pose model in memory, a few hundred MB, the same as a visible one. Unmounting frees all of it.

# **When you do not know yet**

Render `KinestexWarmup` anywhere, for example after login. It signs in and caches the app, the theme and the pose model, so any `KinestexSDK` you mount later loads from cache. Unmount it before you show KinesteX, so two copies of the web app are never in memory together.

```typescript
import KinestexSDK, { KinestexWarmup } from "kinestex-sdk-react-native";

{isOpen ? (
  <KinestexSDK
    data={postData}
    integrationOption={IntegrationOption.WORKOUT}
    workout={"Fitness Lite"}
    handleMessage={handleMessage}
  />
) : (
  <KinestexWarmup data={postData} onWarmupStateChange={(state) => {}} />
)}
```

`KinestexWarmup` also accepts an optional `handleMessage`. It receives data events only, for example a workout that was saved from the offline queue, and never `kinestex_loaded`, `kinestex_launched` or `error_occurred`.

# Next steps:
- ### [View complete code example](../examples/warmup.md)
- ### [View handleMessage available data points](../data.md)
- ### [Explore more integration options](./overview.md)
