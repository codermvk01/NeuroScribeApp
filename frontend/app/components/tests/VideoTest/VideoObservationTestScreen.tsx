import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TestPrompt from '../TestPrompt';
import { Colors } from '../../../../constants/Colors';

const prompts = [
  'Stand up from the chair, walk 5 steps and return.',
  'Raise both hands above your head.',
  'Clap your hands twice.',
];

export default function VideoObservationTestScreen() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('');

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setStatus('Recording stopped.');
    } else {
      setRecording(true);
      setStatus('Recording...');
    }
  };

  const handleNextPrompt = () => {
    setStatus('');
    setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
  };

  return (
    <View style={styles.container}>
      <TestPrompt testType="videoObservation" currentPromptIndex={currentPromptIndex} />

      <View style={styles.cameraPlaceholder}>
        <Text style={styles.cameraPlaceholderText}>Camera Preview Here</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.recordButton,
          { backgroundColor: recording ? Colors.light.error : Colors.light.primary },
        ]}
        onPress={toggleRecording}
      >
        <MaterialIcons name={recording ? 'stop' : 'videocam'} size={64} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.status}>{status}</Text>

      <TouchableOpacity style={styles.nextButton} onPress={handleNextPrompt}>
        <Text style={styles.nextButtonText}>Next Prompt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    width: '100%',
    height: 300,
    marginVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholderText: {
    color: Colors.light.primary,
    fontSize: 18,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginVertical: 10,
  },
  status: {
    color: Colors.light.primary,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
