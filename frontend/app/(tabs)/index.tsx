// Path: app/(tabs)/index.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTests } from '../../context/TestsContext';

export default function TestsScreen() {
  const router = useRouter();

  // ------------------------------
  // Test definitions
  // ------------------------------
  const { tests } = useTests();

  const testList = [
  {
    id: 1,
    key: 'voice',
    name: 'Voice Test',
    icon: 'mic',
    status: tests.voice,
  },
  {
    id: 2,
    key: 'picture',
    name: 'Picture Drawing Test',
    icon: 'draw',
    status: tests.picture,
  },
  {
    id: 3,
    key: 'video',
    name: 'Video Observation Test',
    icon: 'videocam',
    status: tests.video,
  },
];

  // ------------------------------
  // Status badge color helper
  // ------------------------------
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.light.success;
      case 'in-progress':
        return Colors.light.primary;
      default:
        return Colors.light.textLight;
    }
  };

  // ------------------------------
  // Handle navigation for each test
  // ------------------------------
  const handleTestPress = (testId: number) => {
    switch (testId) {
      case 1:
        router.push('/(tabs)/voice-test');
        break;
      case 2:
        router.push('./picture-drawing-test');
        break;
      case 3:
        router.push('./video-observation-test');
        break;
      default:
        console.warn('Unknown test id:', testId);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Tests</Text>
        <Text style={styles.subtitle}>Complete tests to unlock your report</Text>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Complete your tests to unlock your report
        </Text>
      </View>

      <View style={styles.testsGrid}>
        {testList.map((test) => (
          <TouchableOpacity
            key={test.id}
            style={[styles.testCard, GlobalStyles.card]}
            onPress={() => handleTestPress(test.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: Colors.light.primaryLighter }]}>
              <MaterialIcons
                name={test.icon as any}
                size={40}
                color={Colors.light.primary}
              />
            </View>
            <Text style={styles.testName}>{test.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(test.status) }]}>
              <Text style={styles.statusText}>
                {test.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ------------------------------
// Styles
// ------------------------------
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  banner: {
    backgroundColor: Colors.light.primaryLighter,
    margin: 20,
    padding: 16,
    borderRadius: 8,
  },
  bannerText: {
    color: Colors.light.primary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  testsGrid: {
    padding: 20,
  },
  testCard: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  testName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
