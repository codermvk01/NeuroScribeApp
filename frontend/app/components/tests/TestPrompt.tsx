import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

type TestType = 'voice' | 'pictureDrawing' | 'videoObservation';

type Props = {
  testType: TestType;
  currentPromptIndex: number;
};

const promptsData: Record<TestType, string[]> = {
  voice: [
    'Describe your morning routine.',
    'Explain your favorite hobby.',
    'Read this sentence aloud: The quick brown fox jumps over the lazy dog.',
  ],
  pictureDrawing: [
    'Please draw a clock.',
    'Please draw a house.',
    'Please draw a tree.',
  ],
  videoObservation: [
    'Stand up from the chair, walk 5 steps and return.',
    'Raise both hands above your head.',
    'Clap your hands twice.',
  ],
};

export default function TestPrompt({ testType, currentPromptIndex }: Props) {
  const prompts = promptsData[testType];
  const prompt =
    prompts && currentPromptIndex >= 0 && currentPromptIndex < prompts.length
      ? prompts[currentPromptIndex]
      : '';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Test Prompt:</Text>
      <Text style={styles.prompt}>{prompt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.primary,
  },
  prompt: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
