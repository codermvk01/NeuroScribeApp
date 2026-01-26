import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import TestPrompt from '../TestPrompt';
import { Colors } from '../../../../constants/Colors';
import { uploadVideo } from '../../../../utils/api';
import { useTests } from '../../../../context/TestsContext';

const prompts = [
  'Stand up from the chair, walk 5 steps and return.',
  'Raise both hands above your head.',
  'Clap your hands twice.',
];

export default function VideoObservationTestScreen() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView | null>(null);
  const recordingPromiseRef = useRef<Promise<any> | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const { setTestStatus } = useTests();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const toggleRecording = async () => {
    if (!cameraRef.current) return;

    if (recording) {
      setRecording(false);
      setStatus('Recording stopped');

      cameraRef.current.stopRecording();

      if (recordingPromiseRef.current) {
        const video = await recordingPromiseRef.current;
        setVideoUri(video.uri);

        setStatus('Uploading video...');
        try {
          await uploadVideo(video.uri, {
            prompt: prompts[currentPromptIndex],
            timestamp: Date.now(),
          });
          setStatus('Video uploaded');
          setTestStatus('video', 'completed');
        } catch {
          setStatus('Upload failed');
        }
      }
    } else {
      setRecording(true);
      setStatus('Recording...');
      setTestStatus('video', 'in-progress');
      recordingPromiseRef.current = cameraRef.current.recordAsync();
    }
  };

  const handleNextPrompt = () => {
    setStatus('');
    setVideoUri(null);
    setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
  };

  return (
    <View style={styles.container}>
      <TestPrompt
        testType="videoObservation"
        currentPromptIndex={currentPromptIndex}
      />

      <CameraView
        ref={cameraRef}
        style={styles.cameraPlaceholder}
        mode="video"
      />

      <TouchableOpacity
        style={[
          styles.recordButton,
          {
            backgroundColor: recording
              ? Colors.light.error
              : Colors.light.primary,
          },
        ]}
        onPress={toggleRecording}
      >
        <MaterialIcons
          name={recording ? 'stop' : 'videocam'}
          size={64}
          color="#fff"
        />
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