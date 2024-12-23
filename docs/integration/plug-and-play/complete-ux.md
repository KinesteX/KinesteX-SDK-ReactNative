# Compelete User Experience (MAIN): 
With this integration option we displays 3 best workout plans based on the provided category. The user can select one of the plans and start a long-term routine.

Available Categories to Sort Plans

| **Plan Category (key: planCategory)** |
|---------------------------------------|
| **Strength**                          |
| **Cardio**                            |
| **Weight Management**                 |
| **Rehabilitation**                    |
| **Custom**                            |

## Displaying the main view:
 ### 1. Add a planCategory to postData: 
 ```ts
 const postData: IPostData = {
  // ... all initial fields
  planCategory: PlanCategory.Cardio, // Add plan category
};
```
 ### 2. Display the `KinestexSDK` view: 
 ```ts
 <KinestexSDK 
  ref={kinestexSDKRef} 
  data={postData} // pass the postData as props
  integrationOption={IntegrationOption.MAIN} // Select MAIN integration option
  handleMessage={handleMessage} // pass message handler function through props too
/>

```

# Next steps:
- ### [View handleMessage available data points](../../data.md)
- ### [View complete code example](../../examples/complete-ux.md)
- ### [Explore more integration options](../overview.md)
