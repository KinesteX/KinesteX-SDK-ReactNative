# Ready-made Leaderboard: Boost User Engagement and Motivation

### Adaptive Design

The leaderboard automatically adapts to your KinesteX UI and can be fully customized in the admin dashboard.

### Real-time Updates

Whenever a new ranking is available, the leaderboard automatically refreshes to show the latest standings.

---

# **LEADERBOARD Integration Example**
### 1. Add `exercise` field to `postData`: 
```ts
const postData: IPostData = {
 // ... all initial fields
  exercise: 'Squats', // name or ID of the exercise to track
  isHideHeaderMain: true, // hide exit button for leaderboard (false by default)
};
```
### 2. Select `LEADERBOARD` IntegrationOption:
```ts
<KinestexSDK 
  ref={kinestexSDKRef}
  data={postData} 
  integrationOption={IntegrationOption.LEADERBOARD} // select LEADERBOARD here
  username={"John"} // OPTIONAL: highlight the username in the leaderboard
  handleMessage={handleMessage} 
/>
```

# Next steps:

- ### [View onMessageReceived available data points](../../data.md)
- ### [Explore more integration options](../overview.md)
