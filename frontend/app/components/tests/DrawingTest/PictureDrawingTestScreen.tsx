import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import TestPrompt from '../TestPrompt';
import { Colors } from '../../../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { uploadPicture } from '../../../../utils/api';

const prompts = [
  'Please draw a clock.',
  'Please draw a house.',
  'Please draw a tree.',
];

export default function PictureDrawingTestScreen() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  async function requestGalleryPermission() {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Permission to access gallery is required!');
        return false;
      }
    }
    return true;
  }

  async function pickImageFromGallery() {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setStatus('Uploading image...');

try {
  await uploadPicture(result.assets[0].uri, {
    prompt: prompts[currentPromptIndex],
    timestamp: Date.now(),
  });
  setStatus('Image uploaded');
} catch {
  setStatus('Upload failed');
}
      setStatus('Image selected');
      // TODO: Upload or handle the image as needed
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setStatus('Uploading image...');

try {
  await uploadPicture(result.assets[0].uri, {
    prompt: prompts[currentPromptIndex],
    timestamp: Date.now(),
  });
  setStatus('Image uploaded');
} catch {
  setStatus('Upload failed');
}
      setStatus('Photo captured');
      // TODO: Upload or handle the image as needed
    }
  }

  function handleNextPrompt() {
    setImageUri(null);
    setStatus('');
    setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
  }

  return (
    <View style={styles.container}>
      <TestPrompt testType="pictureDrawing" currentPromptIndex={currentPromptIndex} />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.primary }]} onPress={takePhoto}>
          <MaterialIcons name="camera-alt" size={36} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.accent }]} onPress={pickImageFromGallery}>
          <MaterialIcons name="photo-library" size={36} color="#fff" />
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Text style={styles.status}>{status}</Text>}

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
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  status: {
    fontSize: 16,
    color: Colors.light.primary,
    marginTop: 10,
  },
  nextButton: {
    marginTop: 30,
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
