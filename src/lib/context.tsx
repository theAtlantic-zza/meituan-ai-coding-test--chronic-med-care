'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { DeviceReading, Medication, MedicationLog, TabType, TimeSlot } from './types';
import * as store from './store';
import {
  generateMockDeviceReadings,
  getDefaultMedications,
  getShowcaseMedications,
  getShowcaseLogsForToday,
} from './mock-data';

interface AppContextType {
  elderlyMode: boolean;
  toggleElderlyMode: () => void;
  medications: Medication[];
  setMedications: (meds: Medication[]) => void;
  addMedication: (med: Medication) => void;
  removeMedication: (id: string) => void;
  logs: MedicationLog[];
  logMedication: (medicationId: string, date: string, timeSlot: TimeSlot) => void;
  deviceReadings: DeviceReading[];
  syncDeviceMock: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  apiConfig: { key: string; baseUrl: string; model: string };
  setApiConfig: (config: { key: string; baseUrl: string; model: string }) => void;
  loadDemo: () => void;
  restoreShowcase: () => void;
  clearDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [elderlyMode, setElderlyMode] = useState(false);
  const [medications, setMedicationsState] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [deviceReadings, setDeviceReadings] = useState<DeviceReading[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [apiConfig, setApiConfigState] = useState({
    key: '', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini',
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setElderlyMode(store.loadElderlyMode());
    setMedicationsState(store.loadMedications());
    setLogs(store.loadLogs());
    setDeviceReadings(store.loadDeviceReadings());
    setApiConfigState(store.loadApiConfig());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) document.documentElement.classList.toggle('elderly', elderlyMode);
  }, [elderlyMode, loaded]);

  const toggleElderlyMode = useCallback(() => {
    setElderlyMode((v) => {
      store.saveElderlyMode(!v);
      return !v;
    });
  }, []);

  const setMedications = useCallback((meds: Medication[]) => {
    setMedicationsState(meds);
    store.saveMedications(meds);
  }, []);

  const addMedication = useCallback((med: Medication) => {
    store.clearEmptyAfterReset();
    setMedicationsState((prev) => {
      const next = [...prev, med];
      store.saveMedications(next);
      return next;
    });
  }, []);

  const removeMedication = useCallback((id: string) => {
    setMedicationsState((prev) => {
      const next = prev.filter((m) => m.id !== id);
      store.saveMedications(next);
      return next;
    });
  }, []);

  const logMedication = useCallback((medicationId: string, date: string, timeSlot: TimeSlot) => {
    setLogs((prev) => {
      const existing = prev.find(
        (l) => l.medicationId === medicationId && l.date === date && l.timeSlot === timeSlot
      );
      let next: MedicationLog[];
      if (existing) {
        next = prev.map((l) =>
          l.id === existing.id
            ? { ...l, taken: !l.taken, takenAt: !l.taken ? new Date().toISOString() : undefined }
            : l
        );
      } else {
        next = [...prev, {
          id: `log-${Date.now()}`,
          medicationId,
          date,
          timeSlot,
          taken: true,
          takenAt: new Date().toISOString(),
        }];
      }
      store.saveLogs(next);
      return next;
    });
  }, []);

  const syncDeviceMock = useCallback(() => {
    const next = generateMockDeviceReadings();
    setDeviceReadings(next);
    store.saveDeviceReadings(next);
  }, []);

  const setApiConfig = useCallback((config: { key: string; baseUrl: string; model: string }) => {
    setApiConfigState(config);
    store.saveApiConfig(config);
  }, []);

  const loadDemo = useCallback(() => {
    store.clearEmptyAfterReset();
    const meds = getDefaultMedications();
    setMedicationsState(meds);
    setLogs([]);
    store.saveMedications(meds);
    store.saveLogs([]);
  }, []);

  const restoreShowcase = useCallback(() => {
    store.clearEmptyAfterReset();
    const today = new Date().toISOString().split('T')[0];
    const meds = getShowcaseMedications();
    const lg = getShowcaseLogsForToday(today);
    const dr = generateMockDeviceReadings();
    setMedicationsState(meds);
    setLogs(lg);
    setDeviceReadings(dr);
    store.saveMedications(meds);
    store.saveLogs(lg);
    store.saveDeviceReadings(dr);
  }, []);

  const clearDemo = useCallback(() => {
    store.clearAllLocalData();
    setMedicationsState([]);
    setLogs([]);
    setDeviceReadings([]);
  }, []);

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      elderlyMode, toggleElderlyMode,
      medications, setMedications, addMedication, removeMedication,
      logs, logMedication,
      deviceReadings, syncDeviceMock,
      activeTab, setActiveTab,
      apiConfig, setApiConfig,
      loadDemo, restoreShowcase, clearDemo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
