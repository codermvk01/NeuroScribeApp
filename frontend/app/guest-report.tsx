import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

export default function GuestReport() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Generic Report</Text>
        <Text style={styles.feedback}>Your responses have been recorded. To see full reports, please sign up.</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={() => alert('Navigate to Sign Up')}>
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
    backgroundColor: Colors.light.accent,
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
