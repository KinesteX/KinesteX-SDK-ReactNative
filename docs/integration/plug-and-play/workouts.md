### Personalized Workouts: Anytime, Anywhere

- **Tailored for All Levels**: Workouts for strength, flexibility, or relaxation.  
- **Time-Saving**: Quick, efficient sessions with zero hassle.  
- **Engaging**: Keep users motivated with fresh, personalized routines.  
- **Easy Integration**: Add workouts seamlessly with minimal effort.  

You can find workout in our library [here](https://workout-view.kinestex.com/?tab=workouts), or create your own workouts in our [admin portal](https://admin.kinestex.com).


# **WORKOUT Integration Example**

```typescript
<KinestexSDK 
  ref={kinestexSDKRef}
  data={postData} 
  integrationOption={IntegrationOption.WORKOUT} // WORKOUT integration option
  workout={"Circuit Training"} // exact name or ID of the workout you want to display
  handleMessage={handleMessage} 
/>
```

# Next steps:
- ### [View handleMessage available data points](../../data.md)
- ### [View complete code example](../../examples/workouts.md)
- ### [Explore more integration options](../overview.md)
