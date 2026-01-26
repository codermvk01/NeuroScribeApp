import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';
import { Stack } from 'expo-router';
export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={Colors.light.primary}
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Report #{id}</Text>
      </View>

      {/* Report Card */}
      <View style={[styles.card, GlobalStyles.card]}>
        <Text style={styles.sectionTitle}>Cognitive Assessment Report</Text>
        <Text style={styles.date}>
          Generated on {new Date().toDateString()}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.paragraph}>
          This is a static placeholder report generated after completing the
          voice, picture drawing, and video observation tests.
        </Text>

        <Text style={styles.paragraph}>
          In future versions, this section will include detailed analysis,
          scoring, trends, and professional insights derived from your test
          responses.
        </Text>

        <Text style={styles.paragraph}>
          This report is observational only and does not represent a medical
          diagnosis.
        </Text>
      </View>
    </ScrollView>
    </>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  card: {
    margin: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.primaryLighter,
    marginVertical: 16,
  },
  paragraph: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
});