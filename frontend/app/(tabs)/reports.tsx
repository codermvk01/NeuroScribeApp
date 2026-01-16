import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';
import { MaterialIcons } from '@expo/vector-icons';

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
      </View>

      <View style={styles.content}>
        <MaterialIcons name="assignment" size={80} color={Colors.light.primaryLight} />
        <Text style={styles.emptyTitle}>No Reports Yet</Text>
        <Text style={styles.emptySubtitle}>
          Complete your tests to generate your first report
        </Text>
        
        <TouchableOpacity style={[GlobalStyles.primaryButton, styles.ctaButton]}>
          <Text style={GlobalStyles.primaryButtonText}>Start Tests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  ctaButton: {
    paddingHorizontal: 32,
  },
});
