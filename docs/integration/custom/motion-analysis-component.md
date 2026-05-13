### KinesteX Motion Recognition: Real-Time Engagement

- **Interactive Tracking**: Advanced motion recognition for immersive fitness experiences.  
- **Real-Time Feedback**: Instantly track reps, spot mistakes, and calculate calories burned.  
- **Boost Motivation**: Keep users engaged with detailed exercise feedback.  
- **Custom Integration**: Adapt camera placement to fit your app’s design.  

## **CAMERA Integration Example**

### 1. Modify `postData` to include the current exercise and all expected exercises a person should do:

As of SDK v1.3.1, `exercises[]` and `currentExercise` can be supplied by **title**, **exercise id**, or **model id**. Pick one form per session via `exerciseFetchType` (defaults to `"model_id"` when omitted).

```typescript
const postData: IPostData = {
  // ... all initial fields
  currentExercise: 'Squats',
  exercises: ['Squats', 'Jumping Jack'],
  exerciseFetchType: 'exercise_title', // 'model_id' (default) | 'exercise_id' | 'exercise_title'
};
```

### **2. Updating the Current Exercise**
Call this function when you need to change the current exercise throughout your custom workout experience:

```typescript
// If the target exercise is already in `postData.exercises`, switch directly:
const switchExercise = () => {
  kinestexSDKRef.current?.sendAction('currentExercise', 'Jumping Jack');
  // Do NOT repeat `exerciseFetchType` here — it only applies to fetches.
};
```

### **2a. Loading additional exercises mid-session**
Use the new `load_models` runtime command to fetch + cache extra models after the session has started, then switch once `models_loaded` arrives:

```typescript
// Step 1: fetch the model. This does NOT auto-switch the active exercise.
kinestexSDKRef.current?.sendAction(
  'workout_activity_action',
  'load_models',
  { exercises: ['Lunges'], exerciseFetchType: 'exercise_title' },
);

// Step 2: when `models_loaded` arrives with a matching `modelIds` entry,
// send the follow-up `currentExercise` action (see handleMessage below).
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
    case "models_loaded":
      // `modelIds` echoes whatever identifiers loaded (in the form you sent).
      console.log('Models cached:', data.modelIds);
      // Now safe to switch to one of them:
      // kinestexSDKRef.current?.sendAction('currentExercise', data.modelIds[0]);
      break;
    case "speech_fetch_complete":
      // Two emitters: with `modelIds` → mistake-feedback audio cached;
      // without → rest-speech batch finished.
      if (data.modelIds) {
        console.log('Mistake-feedback audio cached for:', data.modelIds);
      }
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