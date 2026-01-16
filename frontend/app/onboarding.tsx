import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { GlobalStyles } from '../constants/Styles';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to NeuroScribe+</Text>
        <Text style={styles.subtitle}>
          Get started with early neurodegenerative condition monitoring
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[GlobalStyles.primaryButton, styles.button]}
          onPress={() => router.push('/auth')}
        >
          <Text style={GlobalStyles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[GlobalStyles.outlineButton, styles.button]}
          onPress={() => router.push('/guest-questionnaire')}
        >
          <Text style={GlobalStyles.outlineButtonText}>Guest Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingBottom: 50,
  },
  button: {
    marginVertical: 8,
  },
});
