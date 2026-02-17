import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useReports } from './ReportsContext';

type TestStatus = 'not-started' | 'in-progress' | 'completed';

type TestsState = {
  voice: TestStatus;
  picture: TestStatus;
  video: TestStatus;
};

type TestsContextType = {
  tests: TestsState;
  setTestStatus: (test: keyof TestsState, status: TestStatus) => void;
  resetTests: () => void;
};

const DEFAULT_STATE: TestsState = {
  voice: 'not-started',
  picture: 'not-started',
  video: 'not-started',
};

const STORAGE_KEY = 'TESTS_STATE';

const TestsContext = createContext<TestsContextType | undefined>(undefined);

export function TestsProvider({ children }: { children: React.ReactNode }) {
  const [tests, setTests] = useState<TestsState>(DEFAULT_STATE);
  const [reportGenerated, setReportGenerated] = useState(false);

  const router = useRouter();
  const { addReport } = useReports();

  // Load persisted state
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTests(JSON.parse(saved));
      }
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  }, [tests]);

  const setTestStatus = (test: keyof TestsState, status: TestStatus) => {
    setTests(prev => ({ ...prev, [test]: status }));
  };

  useEffect(() => {
    const allCompleted =
      tests.voice === 'completed' &&
      tests.picture === 'completed' &&
      tests.video === 'completed';

    if (allCompleted && !reportGenerated) {
      setReportGenerated(true);

      addReport();

      // Reset immediately
      setTests(DEFAULT_STATE);
      AsyncStorage.removeItem(STORAGE_KEY);

      router.replace('/reports');
    }
  }, [tests, reportGenerated]);

  const resetTests = () => {
    setTests(DEFAULT_STATE);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TestsContext.Provider value={{ tests, setTestStatus, resetTests }}>
      {children}
    </TestsContext.Provider>
  );
}

export function useTests() {
  const ctx = useContext(TestsContext);
  if (!ctx) {
    throw new Error('useTests must be used within TestsProvider');
  }
  return ctx;
}
