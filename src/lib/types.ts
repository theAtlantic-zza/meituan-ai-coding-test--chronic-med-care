export type DiseaseCategory = 'diabetes' | 'hypertension' | 'hyperlipidemia';

export type MealRelation = 'before_meal' | 'with_meal' | 'after_meal' | 'independent';

export type TimeSlot = 'morning' | 'noon' | 'evening' | 'bedtime';

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '早晨',
  noon: '中午',
  evening: '傍晚',
  bedtime: '睡前',
};

export const TIME_SLOT_HOURS: Record<TimeSlot, string> = {
  morning: '07:00',
  noon: '12:00',
  evening: '18:00',
  bedtime: '21:30',
};

export const MEAL_RELATION_LABELS: Record<MealRelation, string> = {
  before_meal: '饭前',
  with_meal: '随餐',
  after_meal: '饭后',
  independent: '不限',
};

export const DISEASE_LABELS: Record<DiseaseCategory, string> = {
  diabetes: '糖尿病',
  hypertension: '高血压',
  hyperlipidemia: '高血脂',
};

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeSlots: TimeSlot[];
  mealRelation: MealRelation;
  disease: DiseaseCategory;
  startDate: string;
  prescriptionEndDate: string;
  notes?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  date: string;
  timeSlot: TimeSlot;
  taken: boolean;
  takenAt?: string;
}

export interface DeviceReading {
  id: string;
  type: 'blood_glucose' | 'blood_pressure' | 'heart_rate';
  value: number;
  valueDiastolic?: number;
  unit: string;
  timestamp: string;
  source: string;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

export interface DiseaseTemplate {
  disease: DiseaseCategory;
  commonMedications: Omit<Medication, 'id' | 'startDate' | 'prescriptionEndDate'>[];
}

export type TabType = 'dashboard' | 'medications' | 'interaction' | 'devices' | 'renewal';
