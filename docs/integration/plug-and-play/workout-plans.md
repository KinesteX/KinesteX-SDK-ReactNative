### Key Features of Our Workout Plans

- **Personalized**: Tailored to height, weight, age, and activity level.
- **Goal-Oriented**: Supports strength, flexibility, and wellness goals.
- **Seamless Experience**: From recommendations to real-time feedback.
- **Customizable**: Brand-aligned app design.
- **Quick Integration**: Easy setup for advanced fitness solutions.

You can find workout plans in our library [here](https://workout-view.kinestex.com/), or create your own plans in our [admin portal](https://admin.kinestex.com).

# **PLAN Integration Example**

```ts
<KinestexSDK 
  ref={kinestexSDKRef}
  data={postData} 
  integrationOption={IntegrationOption.PLAN} // PLAN integration option
  plan={"Circuit Training"} // exact name or ID of the workout plan you want to display 
  handleMessage={handleMessage} 
/>
``` 

# Next steps:
- ### [View handleMessage available data points](../../data.md)
- ### [View complete code example](../../examples/plans.md)
- ### [Explore more integration options](../overview.md)
