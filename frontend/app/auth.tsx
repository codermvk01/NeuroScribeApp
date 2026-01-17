import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { signup, login } from "../utils/api";
import { saveToken } from "../context/AuthStorage";

export default function AuthScreen() {
  const router = useRouter();

  const [aadhaar, setAadhaar] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [locality, setLocality] = useState('');
  const [picture, setPicture] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Picture upload handler (placeholder alert for now)
  const handleUploadPicture = () => {
    Alert.alert('Upload picture feature not implemented yet');
  };

  const handleSubmit = async () => {
  if (!aadhaar || !phone || !name || !email || !password) {
    Alert.alert('Error', 'Please fill all required fields');
    return;
  }

  if (aadhaar.length !== 12) {
    Alert.alert('Error', 'Aadhaar must be 12 digits');
    return;
  }

  if (phone.length !== 10) {
    Alert.alert('Error', 'Phone number must be 10 digits');
    return;
  }

  try {
    setLoading(true);

    // Signup with full profile
    await signup({
      name,
      email,
      password,
      aadhaar,
      phone,
      age,
      locality,
    });

    // Auto-login
    const res = await login(email, password);

    // Save JWT securely
    await saveToken(res.token);

    // Go to main app
    router.replace('/(tabs)');
  } catch (err: any) {
    Alert.alert('Signup Error', err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container} >
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Aadhaar Number"
        keyboardType="number-pad"
        maxLength={12}
        value={aadhaar}
        onChangeText={setAadhaar}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Locality"
        value={locality}
        onChangeText={setLocality}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPicture}>
        <Text style={styles.uploadButtonText}>Upload Picture</Text>
        {picture && <Image source={{ uri: picture }} style={styles.imagePreview} />}
      </TouchableOpacity>
      <View style={styles.submitButton}>
        <Button
          title={loading ? 'Please wait...' : 'Submit'}
          color={Colors.light.primary}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.light.background,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 8,
  },
  uploadButton: {
    backgroundColor: Colors.light.primaryLighter,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  submitButton: {
    marginTop: 10,
  },
});
