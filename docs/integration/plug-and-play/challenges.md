### Exciting Challenges: Drive Engagement and Motivation

- **Fun and Competitive**: Quick challenges with leaderboards for friendly competition.  
- **Boost Activity**: Keep fitness exciting and rewarding for users.  
- **Easy Integration**: Add dynamic challenges effortlessly to your app.  

You can find exercises in our library [here](https://workout-view.kinestex.com/?tab=exercises), or create your own exercises in our [admin portal](https://admin.kinestex.com).

# **CHALLENGE Integration Example**

### 1. Add `exercise` and `countdown` fields to `postData`: 
```ts
const postData: IPostData = {
 // ... all initial fields
  exercise: 'Squats', // name or ID of the exercise
  showLeaderboard: true, // show leaderboard at the end of the challenge(true by default)
  countdown: 100, // duration of challenge in seconds
};
```
### 2. Select `CHALLENGE` IntegrationOption:
```typescript
<KinestexSDK 
  ref={kinestexSDKRef}
  data={postData} 
  integrationOption={IntegrationOption.CHALLENGE} // select CHALLENGE here
  handleMessage={handleMessage} 
/>
```
# Next steps: 
- ### [View handleMessage available data points](../../data.md)
- ### [Show Leaderboard Fullscreen](./leaderboard.md)
- ### [View complete code example](../../examples/challenge.md)
- ### [Explore more integration options](../overview.md)
