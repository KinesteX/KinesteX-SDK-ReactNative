# Content API

The Content API allows you to fetch workouts, exercises, and plans programmatically. Build custom content browsers, search interfaces, or integrate fitness content into your existing UI.

---

## Quick Start

```typescript
import { KinesteXAPI, ContentType, BodyPart } from 'kinestex-sdk-react-native';

// Initialize the API
const api = new KinesteXAPI('your-api-key', 'YourCompany');

// Fetch a single workout by ID
const result = await api.fetchContent({
  contentType: ContentType.WORKOUT,
  id: 'workout-123',
});

if (result.success) {
  console.log('Workout:', result.data);
} else {
  console.log('Error:', result.error);
}
```

---

## API Reference

### KinesteXAPI

```typescript
const api = new KinesteXAPI(apiKey: string, companyName: string);
```

### fetchContent

```typescript
const result = await api.fetchContent(request: ContentAPIRequest);
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contentType` | `ContentType` | Yes | Type of content: `WORKOUT`, `PLAN`, or `EXERCISE` |
| `id` | `string` | No | Fetch specific content by ID |
| `title` | `string` | No | Search by title (when `id` not provided) |
| `category` | `string` | No | Filter by category: `Fitness`, `Rehabilitation` |
| `bodyParts` | `BodyPart[]` | No | Filter by body parts |
| `lang` | `string` | No | Language code (default: `en`) |
| `lastDocId` | `string` | No | Pagination cursor |
| `limit` | `number` | No | Maximum items to return |

#### Response

```typescript
interface ContentAPIResponse {
  success: boolean;
  data?: any;        // Content data on success
  error?: string;    // Error message on failure
}
```

---

## Content Types

```typescript
enum ContentType {
  WORKOUT = 'Workout',
  PLAN = 'Plan',
  EXERCISE = 'Exercise',
}
```

---

## Body Parts Filter

```typescript
enum BodyPart {
  ABS = 'Abs',
  BICEPS = 'Biceps',
  CALVES = 'Calves',
  CHEST = 'Chest',
  EXTERNAL_OBLIQUE = 'External oblique',
  FOREARMS = 'Forearms',
  GLUTES = 'Glutes',
  HAMSTRINGS = 'Hamstrings',
  LATS = 'Lats',
  LOWER_BACK = 'Lower back',
  NECK = 'Neck',
  QUADS = 'Quads',
  SHOULDERS = 'Shoulders',
  TRAPS = 'Traps',
  TRICEPS = 'Triceps',
  FULL_BODY = 'Full body',
}
```

---

## Examples

### Fetch Workouts by Category

```typescript
const result = await api.fetchContent({
  contentType: ContentType.WORKOUT,
  category: 'Fitness',
  limit: 10,
});

if (result.success && result.data.workouts) {
  result.data.workouts.forEach((workout: any) => {
    console.log(workout.title, workout.totalMinutes + ' min');
  });
}
```

### Fetch Exercises by Body Parts

```typescript
const result = await api.fetchContent({
  contentType: ContentType.EXERCISE,
  bodyParts: [BodyPart.ABS, BodyPart.GLUTES],
  limit: 20,
});

if (result.success && result.data.exercises) {
  result.data.exercises.forEach((exercise: any) => {
    console.log(exercise.title);
  });
}
```

### Fetch Plans with Pagination

```typescript
// First page
const firstPage = await api.fetchContent({
  contentType: ContentType.PLAN,
  category: 'Fitness',
  limit: 5,
});

if (firstPage.success) {
  console.log('Plans:', firstPage.data.plans);

  // Fetch next page using lastDocId
  if (firstPage.data.lastDocId) {
    const nextPage = await api.fetchContent({
      contentType: ContentType.PLAN,
      category: 'Fitness',
      limit: 5,
      lastDocId: firstPage.data.lastDocId,
    });
  }
}
```

### Fetch Single Workout by ID

```typescript
const result = await api.fetchContent({
  contentType: ContentType.WORKOUT,
  id: 'workout-abc123',
});

if (result.success) {
  const workout = result.data;
  console.log('Title:', workout.title);
  console.log('Duration:', workout.totalMinutes, 'minutes');
  console.log('Calories:', workout.calories);
  console.log('Exercises:', workout.sequence.length);
}
```

---

## Data Models

### WorkoutModel

```typescript
{
  id: string;
  title: string;
  imgURL: string;
  category?: string;
  description: string;
  totalMinutes?: number;
  totalCalories?: number;
  bodyParts: string[];
  difficultyLevel?: string;
  sequence: ExerciseModel[];  // List of exercises
}
```

### ExerciseModel

```typescript
{
  id: string;
  title: string;
  thumbnailURL: string;
  videoURL: string;
  maleVideoURL: string;
  maleThumbnailURL: string;
  workoutReps?: number;
  workoutCountdown?: number;
  averageReps?: number;
  averageCountdown?: number;
  restDuration: number;
  averageCalories?: number;
  bodyParts: string[];
  description: string;
  difficultyLevel: string;
  commonMistakes: string;
  steps: string[];
  tips: string;
}
```

### PlanModel

```typescript
{
  id: string;
  title: string;
  imgURL: string;
  category: {
    description: string;
    levels: { [key: string]: number };
  };
  levels: {
    [levelKey: string]: {
      title: string;
      description: string;
      days: {
        [dayKey: string]: {
          title: string;
          description: string;
          workouts: WorkoutSummary[];
        };
      };
    };
  };
  createdBy: string;
}
```

---

## Using the Content Browser Component

For a ready-to-use UI, import the `ContentNavigator` component:

```typescript
import { ContentNavigator } from 'kinestex-sdk-react-native/content';

const MyScreen = () => {
  return (
    <ContentNavigator
      apiKey="your-api-key"
      companyName="YourCompany"
      onClose={() => navigation.goBack()}
    />
  );
};
```

The `ContentNavigator` provides:
- Search screen with content type selection
- Grid view for browsing results
- Detail screens for workouts, exercises, and plans
- Body parts filtering
- Automatic pagination

---

## Error Handling

```typescript
const result = await api.fetchContent({
  contentType: ContentType.WORKOUT,
  id: 'invalid-id',
});

if (!result.success) {
  // Handle errors
  console.error('API Error:', result.error);

  // Common errors:
  // - Network errors
  // - Invalid API key
  // - Content not found
  // - Rate limiting
}
```

---

## Best Practices

1. **Initialize Once**: Create a single `KinesteXAPI` instance and reuse it
2. **Handle Errors**: Always check `result.success` before accessing data
3. **Use Pagination**: For large datasets, use `limit` and `lastDocId`
4. **Cache Results**: Consider caching frequently accessed content
5. **Filter Early**: Use `category` and `bodyParts` to reduce data transfer

---

## Next Steps

- [View Workout Editor for content management](../plug-and-play/workout-editor.md)
- [View Custom Workout integration](./custom-workout.md)
- [Explore more integration options](../overview.md)
