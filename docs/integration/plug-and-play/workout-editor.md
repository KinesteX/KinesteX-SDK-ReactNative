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
    company: 'your-company',
    organization: 'YourOrganization', // REQUIRED for admin view
    customQueries: {
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

## Next Steps

- [Explore more integration options](../overview.md)
