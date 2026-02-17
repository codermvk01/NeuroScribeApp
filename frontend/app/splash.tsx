import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { getToken } from '../context/AuthStorage';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
     const timer = setTimeout(async () => {
      const token = await getToken();
      if (token) {
        router.replace('/(tabs)');
        return;
      }
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>NeuroScribe+</Text>
        <Text style={styles.tagline}>Early Detection for Better Care</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
