## **Handling Data**:

`handleMessage` is a handler function and you can pass in the data points 

```ts
const handleMessage = (type: string, data: { [key: string]: any }) => {
  switch (type) {
    case "kinestex_launched":
      console.log('Launched at:', data);
      break;
    // ... handle other messages, see below
    default:
      console.log('Other message type:', type, data);
      break;
  }
};
```

# All Available Data Points
## Application Lifecycle

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `kinestex_launched` | `data: string` (format: "dd mm yyyy hh:mm:ss") | When KinesteX application is launched |
| `kinestex_loaded` | `date: string` (ISO format) | When KinesteX is fully loaded and ready |
| `exit_kinestex` | `date: Date`, `time_spent: string` (format: "hh:mm:ss") | User exits KinesteX with total time spent |
| `main_page_opened` | `date: string` (ISO format) | Main/home page is opened |

## Workout Management

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `workout_opened` | `title: string`, `id: string`, `date: string` (format: "dd mm yyyy hh:mm:ss") | Workout details page opened |
| `workout_started` | `id: string`, `date: string` (format: "dd mm yyyy hh:mm:ss") | Workout session started |
| `workout_started` (alt) | `workoutId: string` | Alternative workout start event |
| `workout_completed` | `workout: string`, `date: string` (format: "dd mm yyyy hh:mm:ss") | Workout finished and user exits overview |
| `workout_overview` | `data: object` - see below | Complete workout summary statistics |

### Workout Overview Data Structure
```typescript
{
      workout_title: string,                  // Workout name
      workout_id: string,                     // Unique workout ID
      target_duration_seconds: number,        // Target workout duration
      completed_reps_count: number,           // Total completed reps
      target_reps_count: number,              // Total target reps
      calories_burned: number,                // Calories burned (2 decimal places)
      completion_percentage: number,          // Workout completion % (2 decimal places)
      total_mistakes: number,                 // Total mistake count
      accuracy_score: number,                 // Overall accuracy (0-100)
      efficiency_score: number,               // Efficiency metric (0-100)
      total_exercise: number,                 // Number of exercises
      actual_hold_time_seconds: number,       // Time in correct position (timer-based)
      target_hold_time_seconds: number        // Target hold time (timer-based exercises)
}
```

## Exercise Tracking

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `exercise_completed` | `data: object` - see below | Individual exercise completed |
| `exercise_overview` | `data: array` of exercise objects | All exercises summary |

### Exercise Completed Data Structure
```typescript
{
  exercise_title: string,        // Exercise name
  time_spent: number,           // Seconds spent
  repeats: number,              // Reps completed
  total_reps: number,         // Required reps
  total_duration: number,       // Countdown time
  calories: number,             // Calories burned
  exercise_id: string,           // Exercise ID
  mistakes: Array<{             // Mistakes made
    mistake: string,
    count: number
  }>,
  average_accuracy?: number      // Average accuracy (0-1, optional)
}
```

### Exercise Overview Item Structure
```typescript
{
      exercise_title: string,            // exercise name
      exercise_id: string,               // Unique exercise ID
      time_spent: number,                // Time on exercise in seconds
      perfect_hold_position: number,     // Time in correct position (timer-based)
      repeats: number,                   // Reps completed
      total_required_reps: number,       // Target reps
      total_required_time: number,       // Target time in seconds
      calories: number,                  // Calories burned (2 decimal places)
      mistakes: Array<{                  // Detailed mistake breakdown
        mistake: string,                 // Mistake description
        count: number                    // Occurrence count
      }>,
      mistake_count: number,             // Total mistakes for exercise
      accuracy_reps?: number[],          // Optional: Per-rep accuracy scores
      average_accuracy?: number          // Optional: Average accuracy (0-100)
}
```

## Camera & Frame Tracking

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `left_camera_frame` | `date: string` (format: "dd mm yyyy hh:mm:ss") | User left camera view |
| `returned_camera_frame` | `date: string` (format: "dd mm yyyy hh:mm:ss") | User returned to camera view |
| `check_frame_completed` | `message: string` ("Person stepped into frame") | Frame check completed |
| `camera_selector_opened` | `message: array` (available cameras) | Camera selector opened |
| `camera_selected` | `id: string`, `label: string`, `isMirrorCamera: boolean` | Camera selected by user |

## Plans & Programs

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `plan_unlocked` | `id: string`, `img: string`, `title: string`, `date: string` (format: "dd mm yyyy hh:mm:ss") | Plan unlocked/selected |
| `personalized_plan_exit` | `workout: string`, `date: string` (format: "dd mm yyyy hh:mm:ss") | Exit from personalized plan |

## Challenges & Experiences

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `challenge_started` | `exerciseId: string` | Challenge exercise started |
| `challenge_completed` | `repCount: number`, `mistakes: number` | Challenge completed |
| `challenge_exit` | `workout: string`, `date: string` (format: "dd mm yyyy hh:mm:ss") | Exit from challenge |

## Leaderboard

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `highlighted_user` | `data: object` - see below | User's leaderboard position |

### Highlighted User Data Structure
```typescript
{
  username: string,             // User's username
  score: number,                // User's score
  position: number              // Leaderboard position (1-based)
}
```

## Home & Navigation

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `kinestex_home_exit` | `workout: string`, `date: string` (format: "dd mm yyyy hh:mm:ss") | Exit from KinesteX home |

## Error Handling

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `error_occurred` | `data: string` | General error message |
| `error_occurred` | `message: string` | Alternative error format |
| `error_occurred` | `data: string`, `error: any` | Error with details |
| `warning` | `data: string` | Warning message |

## Active Time Tracking

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `total_active_seconds` | `number` | Sent every 5 seconds with active workout time (not sent when user leaves camera frame) |

## Coming Soon Events

| Event Type | Data Fields | Description |
|------------|------------|-------------|
| `active_days` | `number` | Days user has opened KinesteX |
| `total_workouts` | `number` | Total workouts completed |
| `workout_efficiency` | `number` | Workout intensity level (0.5 = average) |

### Event Flow Examples

#### Complete Workout Flow
1. `kinestex_launched` → Application starts
2. `workout_opened` → User views workout details
3. `workout_started` → Workout begins
4. `returned_camera_frame` / `left_camera_frame` → Frame tracking
5. Multiple `exercise_completed` → Each exercise finished
6. `workout_overview` → Summary statistics
7. `exercise_overview` → All exercises summary
8. `workout_completed` → User exits statistics
9. `exit_kinestex` → Application closed

#### Challenge Flow
1. `challenge_started` → Challenge begins
2. `exercise_completed` → Exercise finished
3. `challenge_completed` → Challenge complete
4. `challenge_exit` → Exit from challenge

