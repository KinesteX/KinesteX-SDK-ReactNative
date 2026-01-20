# Admin Workout Editor

The Admin Workout Editor is an embedded view for creating and managing workouts, exercises, and plans. This component allows administrators to build custom fitness content directly within your application.

---

## Integration Example

```typescript
import KinestexSDK, {
  IntegrationOption,
  IPostData,
} from 'kinestex-sdk-react-native';

const WorkoutEditorComponent = () => {
  const postData: IPostData = {
    key: 'your-api-key',
    userId: 'user-id',
    company: 'YourCompany',
    organization: 'YourOrganization', // REQUIRED for admin view
    customQueries: {
      // Optional: customize the admin dashboard
      hidePlansTab: true,        // Hide plans tab
      tab: 'workouts',           // Default tab: 'workouts', 'exercises', or 'plans'
      isSelectableMenu: true,    // Show select buttons on cards
    },
    style: {
      style: 'dark',
      loadingBackgroundColor: '000000',
    },
  };

  const handleMessage = (type: string, data: { [key: string]: any }) => {
    switch (type) {
      case 'workout_saved':
        console.log('Workout saved:', data.workout_id);
        break;
      case 'exercise_selected':
        console.log('Exercise selected:', data.exercise_id, data.exercise_title);
        break;
      // Handle other events...
    }
  };

  return (
    <KinestexSDK
      data={postData}
      integrationOption={IntegrationOption.WORKOUT_ADMIN_VIEW}
      handleMessage={handleMessage}
    />
  );
};
```

---

## Configuration Options

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization` | `string` | Yes | Organization name for multi-tenant support |
| `customQueries.hidePlansTab` | `boolean` | No | Hide the plans tab in dashboard |
| `customQueries.tab` | `string` | No | Default tab: `workouts`, `exercises`, or `plans` |
| `customQueries.isSelectableMenu` | `boolean` | No | Show select buttons on content cards |

---

## Available Events

### System Events

| Event Type | Payload | Description |
|------------|---------|-------------|
| `kinestex_loaded` | `{ type: "kinestex_loaded" }` | Admin dashboard fully loaded |
| `kinestex_launched` | `{ type: "kinestex_launched" }` | Authenticated successfully |
| `error_occurred` | `{ error_message: string }` | Authentication or loading error |

### Exercise Events

| Event Type | Payload | Description |
|------------|---------|-------------|
| `exercise_opened` | `{ exercise_id, exercise_title }` | Exercise detail page opened |
| `exercise_selection_opened` | `{ from_workout_id? }` | Exercise list page opened |
| `exercise_selected` | `{ exercise_id, exercise_title }` | Exercise selected (when `isSelectableMenu: true`) |
| `exercise_saved` | `{ exercise_id }` | Exercise created or updated |
| `exercise_removed` | `{ workout_id, exercise_id }` | Exercise removed from workout |

### Workout Events

| Event Type | Payload | Description |
|------------|---------|-------------|
| `workout_opened` | `{ workout_id, workout_title }` | Workout detail page opened |
| `workout_selection_opened` | `{}` | Workout list page opened |
| `workout_selected` | `{ workout_id, workout_title }` | Workout selected (when `isSelectableMenu: true`) |
| `workout_saved` | `{ workout_id }` | Workout created or updated |

### Plan Events

| Event Type | Payload | Description |
|------------|---------|-------------|
| `plan_opened` | `{ plan_id, plan_title }` | Plan detail page opened |
| `plan_selection_opened` | `{}` | Plan list page opened |
| `plan_selected` | `{ plan_id, plan_title }` | Plan selected (when `isSelectableMenu: true`) |
| `plan_saved` | `{ plan_id }` | Plan created or updated |

---

## Use Cases

- **Content Management**: Allow admin users to create and edit workouts
- **Content Selection**: Let users select exercises/workouts to add to custom flows
- **Organization-specific Content**: Manage content per organization

---

## Next Steps

- [View handleMessage available data points](../../data.md)
- [Explore Content API for fetching content](../custom/content-api.md)
- [Explore more integration options](../overview.md)
