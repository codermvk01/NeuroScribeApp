import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Report = {
  id: number;
  createdAt: string;
};

type ReportsContextType = {
  reports: Report[];
  addReport: () => void;
};

const STORAGE_KEY = 'REPORTS_HISTORY';

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  // Load persisted reports
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setReports(JSON.parse(saved));
      }
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  const addReport = () => {
    setReports((prev) => {
      const nextId = prev.length + 1;

      const newReport: Report = {
        id: nextId,
        createdAt: new Date().toISOString(),
      };

      // newest first
      return [newReport, ...prev];
    });
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) {
    throw new Error('useReports must be used within ReportsProvider');
  }
  return ctx;
}