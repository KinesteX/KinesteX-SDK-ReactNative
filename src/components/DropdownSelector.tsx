import React from 'react';
import {View, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export type ComponentType =
  | 'main'
  | 'plan'
  | 'workout'
  | 'challenge'
  | 'experience'
  | 'camera'
  | 'leaderboard'
  | 'personalized-plan';

interface DropdownSelectorProps {
  selectedComponent: ComponentType | null;
  onComponentChange: (component: ComponentType) => void;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  selectedComponent,
  onComponentChange,
}) => {
  const pickerItems = [
    {label: 'Main Integration', value: 'main'},
    {label: 'Plan Integration', value: 'plan'},
    {label: 'Workout Integration', value: 'workout'},
    {label: 'Challenge Integration', value: 'challenge'},
    {label: 'Experience Integration', value: 'experience'},
    {label: 'Camera Integration', value: 'camera'},
    {label: 'Leaderboard Integration', value: 'leaderboard'},
    {label: 'Personalized Plan Integration', value: 'personalized-plan'},
  ];

  return (
    <View style={styles.container}>
      <RNPickerSelect
        placeholder={{
          label: 'Select KinesteX Integration...',
          value: null,
        }}
        items={pickerItems}
        onValueChange={(value: ComponentType) => {
          if (value) {
            onComponentChange(value);
          }
        }}
        value={selectedComponent || ''}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 4,
    color: 'white',
    paddingRight: 30,
    backgroundColor: '#333',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#666',
    borderRadius: 8,
    color: 'white',
    paddingRight: 30,
    backgroundColor: '#333',
  },
  placeholder: {
    color: '#999',
  },
});

export default DropdownSelector;
