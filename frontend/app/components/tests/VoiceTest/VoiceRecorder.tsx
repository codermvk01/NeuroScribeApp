// Path: components/tests/voicetest/VoiceRecorder.tsx

import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  AudioModule,
  setAudioModeAsync,
  RecordingPresets,
} from 'expo-audio';

type Props = {
  onRecordingComplete: (uri: string) => void;
  onRecordingStatus?: (status: { isRecording: boolean; volume: number }) => void;
  children: (args: {
    isRecording: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
  }) => React.ReactNode;
};

export default function VoiceRecorder({
  onRecordingComplete,
  onRecordingStatus,
  children,
}: Props) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const volRef = useRef<number>(0);

  // Permission setup
  useEffect(() => {
    (async () => {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Microphone permission is required to record audio.');
        return;
      }
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  // Poll for amplitude for visualization (demo/random until native API supports amplitude)
  useEffect(() => {
    let isMounted = true;
    let interval: undefined | ReturnType<typeof setInterval>;
    if (recorderState.isRecording && onRecordingStatus) {
      interval = setInterval(() => {
        const fakeVolume = Math.random();
        volRef.current = fakeVolume;
        if (isMounted) {
          onRecordingStatus({ isRecording: true, volume: fakeVolume });
        }
      }, 100);
    } else if (onRecordingStatus) {
      onRecordingStatus({ isRecording: false, volume: 0 });
    }
    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [recorderState.isRecording, onRecordingStatus]);

  // Control functions
  const startRecording = async () => {
    try {
      await recorder.prepareToRecordAsync();
      await recorder.record(); // Await here!
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (uri) {
        onRecordingComplete(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <>
      {children({
        isRecording: recorderState.isRecording,
        startRecording,
        stopRecording,
      })}
    </>
  );
}
