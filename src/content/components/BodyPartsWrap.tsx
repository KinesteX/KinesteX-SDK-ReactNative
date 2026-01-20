/**
 * BodyPartsWrap Component
 *
 * Displays body parts as chip-style tags
 * Similar to: lib/content/body_parts_wrap.dart
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BodyPartsWrapProps {
  bodyParts: string[];
  containerStyle?: object;
  chipStyle?: object;
  textStyle?: object;
}

export const BodyPartsWrap: React.FC<BodyPartsWrapProps> = ({
  bodyParts,
  containerStyle,
  chipStyle,
  textStyle,
}) => {
  if (!bodyParts || bodyParts.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {bodyParts.map((bodyPart, index) => (
        <View key={`${bodyPart}-${index}`} style={[styles.chip, chipStyle]}>
          <Text style={[styles.chipText, textStyle]}>{bodyPart}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  chip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  chipText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
});
