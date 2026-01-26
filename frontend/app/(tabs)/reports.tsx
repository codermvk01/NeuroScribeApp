import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';
import { useReports } from '../../context/ReportsContext';

export default function ReportsScreen() {
  const router = useRouter();
  const { reports } = useReports();

  const hasReports = reports.length > 0;

  const handleStartTests = () => {
    router.push('/(tabs)');
  };

  const renderReportItem = ({ item }: any) => {
    const date = new Date(item.createdAt);

    return (
      <TouchableOpacity
        style={[styles.reportRow, GlobalStyles.card]}
        onPress={() => router.push({
          pathname: '/report/[id]',
          params: { id: item.id },
        })}
        >
        <View>
          <Text style={styles.reportTitle}>Report #{item.id}</Text>
          <Text style={styles.reportDate}>
            {date.toLocaleDateString()} · {date.toLocaleTimeString()}
          </Text>
        </View>

        <MaterialIcons
          name="chevron-right"
          size={24}
          color={Colors.light.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
      </View>

      {/* Content */}
      {!hasReports ? (
        <View style={styles.content}>
          <MaterialIcons
            name="assignment"
            size={80}
            color={Colors.light.primaryLight}
          />
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete your tests to generate your first report
          </Text>

          <TouchableOpacity
            style={[GlobalStyles.primaryButton, styles.ctaButton]}
            onPress={handleStartTests}
          >
            <Text style={GlobalStyles.primaryButtonText}>Start Tests</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderReportItem}
            contentContainerStyle={styles.listContent}
          />

          <TouchableOpacity
            style={[GlobalStyles.primaryButton, styles.bottomButton]}
            onPress={handleStartTests}
          >
            <Text style={GlobalStyles.primaryButtonText}>
              Take Another Test
            </Text>
          </TouchableOpacity>
        </>
      )}
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  reportDate: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
});