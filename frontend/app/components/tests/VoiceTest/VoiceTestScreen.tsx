import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import VoiceRecorder from './VoiceRecorder';
import TestPrompt from '../TestPrompt';
import { uploadAudio } from '../../../../utils/api';
import { Colors } from '../../../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

const prompts = [
  'Describe your morning routine.',
  'Explain your favorite hobby.',
  'Read this sentence aloud: The quick brown fox jumps over the lazy dog.',
];

// --- Inline waveform visualizer ---
function WaveformVisualizer({ isActive }: { isActive: boolean }) {
  const [levels, setLevels] = useState(Array(16).fill(0.2));
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setLevels(levels => levels.map(() => 0.2 + Math.random() * 0.8));
      }, 100);
    } else {
      setLevels(Array(16).fill(0.2));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  return (
    <View style={styles.waveformEqContainer}>
      {levels.map((level, i) => (
        <View
          key={i}
          style={[
            styles.eqBar,
            {
              height: 20 + 40 * level,
              backgroundColor: isActive
                ? Colors.light.primary
                : Colors.light.primaryLighter,
              opacity: isActive ? 0.8 : 0.3,
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function VoiceTestScreen() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [status, setStatus] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  async function handleRecordingComplete(uri: string) {
    setIsRecording(false);
    setStatus('Uploading audio...');
    try {
      await uploadAudio(uri, {
        prompt: prompts[currentPromptIndex],
        timestamp: Date.now(),
      });
      setStatus('Upload complete');
      setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
    } catch {
      setStatus('Upload failed');
    }
  }

  function handleRecordingStatus({ isRecording }: { isRecording: boolean; volume: number }) {
    setIsRecording(isRecording);
    setStatus(isRecording ? 'Recording in progress...' : 'Recording stopped');
  }

  return (
    <View style={styles.container}>
      <TestPrompt prompt={prompts[currentPromptIndex]} />

      <WaveformVisualizer isActive={isRecording} />

      <VoiceRecorder
        onRecordingComplete={handleRecordingComplete}
        onRecordingStatus={handleRecordingStatus}
      >
        {({ isRecording, startRecording, stopRecording }) => (
          <TouchableOpacity
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? Colors.light.error : Colors.light.primary },
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            accessibilityRole="button"
            accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <MaterialIcons
              name={isRecording ? 'stop' : 'mic'}
              size={60}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </VoiceRecorder>

      <Text style={styles.status}>{status}</Text>
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
  // --- waveform visualizer bar styles ---
  waveformEqContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  eqBar: {
    width: 6,
    marginHorizontal: 2,
    borderRadius: 6,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  status: {
    color: Colors.light.primary,
    marginTop: 32,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
