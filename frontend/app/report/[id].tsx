import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';
import { Stack } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const overallScore = 43;
  type RiskBand = 'Low' | 'Moderate' | 'High';
  const riskBand: RiskBand = 'Moderate';

  const getRiskColor = (band: RiskBand = riskBand) => {
    if (band === 'Low') return '#2E7D32';
    if (band === 'Moderate') return '#F9A825';
    return '#C62828';
  };

  const generatePDF = async () => {
    const html = `
      <html>
        <body style="font-family: Arial; padding: 40px; color: #333;">
          <h1 style="margin-bottom: 5px;">NeuroScribe Report</h1>
          <p><strong>Report ID:</strong> ${id}</p>
          <p><strong>Date:</strong> ${new Date().toDateString()}</p>

          <hr style="margin: 20px 0;" />

          <h2>Overall Risk Score</h2>
          <h1 style="color:${getRiskColor()};">
            ${overallScore} / 100
          </h1>
          <h3 style="color:${getRiskColor()};">
            ${riskBand} Risk
          </h3>

          <p>
            Your screening results indicate moderate indicators of potential
            neurocognitive or motor changes. This is a risk assessment only
            and does not represent a medical diagnosis.
          </p>

          <hr style="margin: 20px 0;" />

          <h2>Test Summary</h2>

          <h3>Drawing Assessment</h3>
          <p>
            Low risk indicators. Spatial organization and sequencing were
            largely within expected range.
          </p>

          <h3>Speech & Voice Analysis</h3>
          <p>
            Moderate risk indicators. Subtle speech variability and motor
            patterns were observed.
          </p>

          <h3>Behavioral Observation</h3>
          <p>
            Low risk indicators. Movement and response patterns were within
            expected range.
          </p>

          <hr style="margin: 20px 0;" />

          <h2>Recommendations</h2>
          <ul>
            <li>Monitor cognitive and motor changes over time</li>
            <li>Consider neurological consultation if symptoms persist</li>
            <li>Repeat screening in 6–12 months</li>
          </ul>

          <hr style="margin: 20px 0;" />

          <p style="font-size: 12px; color: gray;">
            This report is generated using AI-based screening models and is
            intended for early risk detection only. It does not provide a
            medical diagnosis. Please consult a licensed healthcare
            professional for formal evaluation.
          </p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

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
          <Text style={styles.title}>NeuroScribe Report</Text>
        </View>

        {/* Main Card */}
        <View style={[styles.card, GlobalStyles.card]}>
          <Text style={styles.sectionTitle}>Neurocognitive Screening Report</Text>
          <Text style={styles.date}>Report ID: #{id}</Text>
          <Text style={styles.date}>
            Generated on {new Date().toDateString()}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.subHeading}>Overall Risk Score</Text>

          <View style={styles.scoreContainer}>
            <Text style={[styles.score, { color: getRiskColor() }]}>
              {overallScore} / 100
            </Text>
            <Text style={[styles.riskBand, { color: getRiskColor() }]}>
              {riskBand} Risk
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Your screening results indicate moderate indicators of potential
            neurocognitive or motor changes. This is a risk assessment only
            and does not represent a medical diagnosis.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.subHeading}>Test Summary</Text>

          <Text style={styles.testTitle}>Drawing Assessment</Text>
          <Text style={styles.paragraph}>
            Low risk indicators. Spatial organization and sequencing were
            largely within expected range.
          </Text>

          <Text style={styles.testTitle}>Speech & Voice Analysis</Text>
          <Text style={styles.paragraph}>
            Moderate risk indicators. Subtle speech variability and motor
            patterns were observed.
          </Text>

          <Text style={styles.testTitle}>Behavioral Observation</Text>
          <Text style={styles.paragraph}>
            Low risk indicators. Movement and response patterns were within
            expected range.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.subHeading}>Recommendations</Text>
          <Text style={styles.paragraph}>
            • Monitor cognitive and motor changes over time{"\n"}
            • Consider neurological consultation if symptoms persist{"\n"}
            • Repeat screening in 6–12 months
          </Text>

          <View style={styles.divider} />

          <Text style={styles.disclaimer}>
            This report is generated using AI-based screening models and is
            intended for early risk detection only. It does not provide a
            medical diagnosis. Please consult a licensed healthcare
            professional for formal evaluation.
          </Text>

          {/* Download Button */}
          <TouchableOpacity style={styles.button} onPress={generatePDF}>
            <Text style={styles.buttonText}>Download as PDF</Text>
          </TouchableOpacity>
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
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.text,
  },
  date: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.primaryLighter,
    marginVertical: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  riskBand: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  testTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    color: Colors.light.text,
  },
  paragraph: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: Colors.light.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
