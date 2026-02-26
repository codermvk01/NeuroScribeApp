import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';
import { Stack } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import * as FileSystem from 'expo-file-system/legacy';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const scores = {
    drawing: 28,
    voice: 52,
    behavior: 31,
    overall: 43,
  };

  type RiskBand = 'Low' | 'Moderate' | 'High';
  const riskBand: RiskBand = 'Moderate';

  const getRiskColor = (band: RiskBand = riskBand) => {
    if (band === 'Low') return '#2E7D32';
    if (band === 'Moderate') return '#F9A825';
    return '#C62828';
  };

  const getBarColor = (score: number) => {
    if (score <= 33) return '#2E7D32';
    if (score <= 66) return '#F9A825';
    return '#C62828';
  };

    const generatePDF = async () => {
    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial;
            padding: 40px;
            color: #333;
          }
          h1 { margin-bottom: 5px; }
          .section { margin-top: 25px; }
          .score {
            font-size: 34px;
            font-weight: bold;
            color: ${getRiskColor()};
          }
          .badge {
            font-size: 18px;
            font-weight: 600;
            color: ${getRiskColor()};
          }
          .bar-container {
            margin-top: 6px;
            height: 8px;
            background: #eaeaea;
            border-radius: 6px;
          }
          .bar {
            height: 8px;
            border-radius: 6px;
          }
          .disclaimer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <h1>NeuroScribe Screening Report</h1>
        <p><strong>Report ID:</strong> ${id}</p>
        <p><strong>Date:</strong> ${new Date().toDateString()}</p>

        <div class="section">
          <h2>Overall Risk Score</h2>
          <div class="score">${scores.overall} / 100</div>
          <div class="badge">${riskBand} Risk</div>
        </div>

        <div class="section">
          <h2>Risk Breakdown</h2>

          <p><strong>Drawing:</strong> ${scores.drawing}</p>
          <div class="bar-container">
            <div class="bar" style="width:${scores.drawing}%; background:${getBarColor(scores.drawing)};"></div>
          </div>

          <p><strong>Speech & Voice:</strong> ${scores.voice}</p>
          <div class="bar-container">
            <div class="bar" style="width:${scores.voice}%; background:${getBarColor(scores.voice)};"></div>
          </div>

          <p><strong>Behavior:</strong> ${scores.behavior}</p>
          <div class="bar-container">
            <div class="bar" style="width:${scores.behavior}%; background:${getBarColor(scores.behavior)};"></div>
          </div>
        </div>

        <div class="section">
          <p>
            This report is generated using AI-based screening models and does not
            constitute a medical diagnosis. Please consult a licensed healthcare
            professional for formal evaluation.
          </p>
        </div>

        <div class="disclaimer">
          NeuroScribe AI Screening System
        </div>
      </body>
    </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

    // Ask permission to access Downloads
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) {
      Alert.alert('Permission required', 'Storage permission is needed.');
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await FileSystem.StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      `NeuroScribe_Report_${id}.pdf`,
      'application/pdf'
    ).then(async (fileUri) => {
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
    });

    Alert.alert('Success', 'PDF downloaded to selected folder');
  } catch (error) {
    Alert.alert('Error', 'Failed to download PDF');
  }
};


  const ScoreBar = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: number;
    highlight?: boolean;
  }) => (
    <View style={{ marginBottom: 14 }}>
      <View style={styles.scoreRow}>
        <Text
          style={[
            styles.scoreLabel,
            highlight && { fontWeight: '600', color: Colors.light.text },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.scoreValue,
            highlight && { fontWeight: '600' },
          ]}
        >
          {value} / 100
        </Text>
      </View>

      <View style={[styles.barBackground, highlight && { height: 12 }]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${value}%`,
              backgroundColor: getBarColor(value),
            },
          ]}
        />
      </View>
    </View>
  );

  // ---------------- RADAR LOGIC ----------------

  const radarSize = 280;
  const center = radarSize / 2;
  const radius = radarSize * 0.35;

  const labels = ['Drawing', 'Voice', 'Behavior', 'Overall'];
  const data = [
    scores.drawing,
    scores.voice,
    scores.behavior,
    scores.overall,
  ];

  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (value: number, index: number, scale = 1) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * (value / 100) * scale;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const dataPoints = data
    .map((v, i) => {
      const p = getPoint(v, i);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const gridLevels = [0.33, 0.66, 1];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.light.primary}
            onPress={() => router.back()}
          />
          <Text style={styles.title}>NeuroScribe Report</Text>
        </View>

        <View style={[styles.card, GlobalStyles.card]}>
          <Text style={styles.sectionTitle}>
            Neurocognitive Screening Report
          </Text>

          <View style={styles.divider} />

          <Text style={styles.subHeading}>Overall Risk Score</Text>

          <View style={styles.scoreContainer}>
            <Text style={[styles.score, { color: getRiskColor() }]}>
              {scores.overall} / 100
            </Text>
            <Text style={[styles.riskBand, { color: getRiskColor() }]}>
              {riskBand} Risk
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.subHeading}>Risk Breakdown</Text>

          <ScoreBar label="Drawing Assessment" value={scores.drawing} />
          <ScoreBar label="Speech & Voice" value={scores.voice} />
          <ScoreBar label="Behavioral Observation" value={scores.behavior} />

          <View style={styles.divider} />

          {/* ---------------- RADAR SECTION ---------------- */}

          <Text style={styles.subHeading}>Cognitive Risk Profile</Text>

          <View style={styles.radarContainer}>
            <Svg width={radarSize} height={radarSize}>
              {/* Grid */}
              {gridLevels.map((level, idx) => {
                const points = data
                  .map((_, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const r = radius * level;
                    const x = center + r * Math.cos(angle);
                    const y = center + r * Math.sin(angle);
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <Polygon
                    key={idx}
                    points={points}
                    fill="none"
                    stroke={Colors.light.primaryLighter}
                    strokeWidth={1}
                  />
                );
              })}

              {/* Axis lines */}
              {data.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);

                return (
                  <Line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke={Colors.light.primaryLighter}
                    strokeWidth={1}
                  />
                );
              })}

              {/* Data polygon */}
              <Polygon
                points={dataPoints}
                fill={getRiskColor()}
                fillOpacity={0.25}
                stroke={getRiskColor()}
                strokeWidth={2}
              />

              {/* Labels */}
              {labels.map((label, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const labelRadius = radius + 20;
                const x = center + labelRadius * Math.cos(angle);
                const y = center + labelRadius * Math.sin(angle);

                return (
                  <SvgText
                    key={i}
                    x={x}
                    y={y}
                    fontSize="12"
                    fill={Colors.light.textSecondary}
                    textAnchor="middle"
                  >
                    {label}
                  </SvgText>
                );
              })}
            </Svg>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.push('/(tabs)/doctors')}
          >
            <Text style={styles.outlineButtonText}>
              Consult Doctor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={generatePDF}
          >
            <Text style={styles.buttonText}>
              Download as PDF
            </Text>
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
    marginBottom: 12,
    color: Colors.light.text,
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
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  scoreLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  scoreValue: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  barBackground: {
    height: 10,
    backgroundColor: Colors.light.primaryLighter,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  radarContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  outlineButton: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: Colors.light.primary,
    fontWeight: '600',
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