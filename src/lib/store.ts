import { DeviceReading, Medication, MedicationLog } from './types';

const MED_KEY = 'med-care-medications';
const LOG_KEY = 'med-care-logs';
const DEVICE_KEY = 'med-care-device-readings';
/** 用户点击「重置」后不再自动注入首页示例 */
const EMPTY_AFTER_RESET_KEY = 'med-care-empty-after-reset';
const ELDERLY_KEY = 'med-care-elderly';
const API_KEY_KEY = 'med-care-api-key';
const API_BASE_KEY = 'med-care-api-base';
const API_MODEL_KEY = 'med-care-api-model';

function get(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

export function loadMedications(): Medication[] {
  const raw = get(MED_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveMedications(meds: Medication[]) {
  localStorage.setItem(MED_KEY, JSON.stringify(meds));
}

export function loadLogs(): MedicationLog[] {
  const raw = get(LOG_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveLogs(logs: MedicationLog[]) {
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

export function loadDeviceReadings(): DeviceReading[] {
  const raw = get(DEVICE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveDeviceReadings(readings: DeviceReading[]) {
  localStorage.setItem(DEVICE_KEY, JSON.stringify(readings));
}

export function loadElderlyMode(): boolean {
  return get(ELDERLY_KEY) === 'true';
}

export function saveElderlyMode(v: boolean) {
  localStorage.setItem(ELDERLY_KEY, String(v));
}

export function loadApiConfig() {
  return {
    key: get(API_KEY_KEY) || '',
    baseUrl: get(API_BASE_KEY) || 'https://api.openai.com/v1',
    model: get(API_MODEL_KEY) || 'gpt-4o-mini',
  };
}

export function saveApiConfig(config: { key: string; baseUrl: string; model: string }) {
  localStorage.setItem(API_KEY_KEY, config.key);
  localStorage.setItem(API_BASE_KEY, config.baseUrl);
  localStorage.setItem(API_MODEL_KEY, config.model);
}

export function markEmptyAfterReset() {
  localStorage.setItem(EMPTY_AFTER_RESET_KEY, '1');
}

export function clearEmptyAfterReset() {
  localStorage.removeItem(EMPTY_AFTER_RESET_KEY);
}

export function isEmptyAfterReset(): boolean {
  return localStorage.getItem(EMPTY_AFTER_RESET_KEY) === '1';
}

export function clearAllLocalData() {
  localStorage.removeItem(MED_KEY);
  localStorage.removeItem(LOG_KEY);
  localStorage.removeItem(DEVICE_KEY);
  markEmptyAfterReset();
}
