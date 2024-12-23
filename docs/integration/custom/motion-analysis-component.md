### KinesteX Motion Recognition: Real-Time Engagement

- **Interactive Tracking**: Advanced motion recognition for immersive fitness experiences.  
- **Real-Time Feedback**: Instantly track reps, spot mistakes, and calculate calories burned.  
- **Boost Motivation**: Keep users engaged with detailed exercise feedback.  
- **Custom Integration**: Adapt camera placement to fit your app’s design.  

## **CAMERA Integration Example**

### 1. Modify `postData` to include the current exercise and all expected exercises a person should do:

```typescript
const postData: IPostData = {
  // ... all initial fields
  currentExercise: 'Squats', // current exercise
  exercises: ['Squats', 'Jumping Jack'], // all exercises a person should do. We will preload them for future usage
};
```

### **2. Updating the Current Exercise**
Call this function when you need to change the current exercise throughout your custom workout experience:

```typescript
const changeExercise = () => {
  kinestexSDKRef.current?.changeExercise("Jumping Jack"); // the exercise has to be from the list of exercises provided in postData otherwise it will not load
};
```

### **3. Handling Messages for Reps and Mistakes**
Track repetitions and identify mistakes made by users in real time:

```typescript
const handleMessage = (type: string, data: { [key: string]: any }) => {
  switch (type) {
    case "successful_repeat":
      console.log('Current rep:', data.value);
      break;
    case "mistake":
      console.log('Mistake:', data.value);
      break;
    default:
      console.log('Other message type:', type, data);
      break;
  }
};
```

### **4. Displaying CAMERA view**

```typescript
<KinestexSDK 
  ref={kinestexSDKRef}
  data={postData} 
  integrationOption={IntegrationOption.CAMERA}
  handleMessage={handleMessage} 
/>
```

# Next steps
### [View complete code example](../../examples/motion-analysis.md)