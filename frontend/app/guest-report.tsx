import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function GuestReport() {
  const router = useRouter();

  const handleSignupRedirect = async () => {
    // Optional: ensure the user is still marked as guest
    await AsyncStorage.setItem('isGuest', 'true');

    // Redirect to Auth screen with signup mode
    router.replace('/auth?mode=signup&reason=guest');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Generic Report</Text>
        <Text style={styles.feedback}>
          Your responses have been recorded. To see full reports, please sign up.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleSignupRedirect}>
          <Text style={styles.ctaText}>Sign Up to See Full Reports</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.primaryLighter,
    padding: 20,
  },
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  feedback: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
