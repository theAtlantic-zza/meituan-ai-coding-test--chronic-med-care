import { DiseaseTemplate, Medication, DeviceReading, DrugInteraction } from './types';

export const DISEASE_TEMPLATES: DiseaseTemplate[] = [
  {
    disease: 'diabetes',
    commonMedications: [
      {
        name: '二甲双胍',
        dosage: '500mg',
        frequency: '每日2次',
        timeSlots: ['morning', 'evening'],
        mealRelation: 'after_meal',
        disease: 'diabetes',
        notes: '餐后服用，减少胃肠不适',
      },
      {
        name: '格列美脲',
        dosage: '1mg',
        frequency: '每日1次',
        timeSlots: ['morning'],
        mealRelation: 'before_meal',
        disease: 'diabetes',
        notes: '早餐前15分钟服用',
      },
    ],
  },
  {
    disease: 'hypertension',
    commonMedications: [
      {
        name: '氨氯地平',
        dosage: '5mg',
        frequency: '每日1次',
        timeSlots: ['morning'],
        mealRelation: 'independent',
        disease: 'hypertension',
        notes: '每天固定时间服用',
      },
      {
        name: '缬沙坦',
        dosage: '80mg',
        frequency: '每日1次',
        timeSlots: ['morning'],
        mealRelation: 'independent',
        disease: 'hypertension',
      },
    ],
  },
  {
    disease: 'hyperlipidemia',
    commonMedications: [
      {
        name: '阿托伐他汀',
        dosage: '20mg',
        frequency: '每日1次',
        timeSlots: ['bedtime'],
        mealRelation: 'independent',
        disease: 'hyperlipidemia',
        notes: '睡前服用效果最佳',
      },
    ],
  },
];

export function getDefaultMedications(): Medication[] {
  const now = new Date();
  const threeMonths = new Date(now);
  threeMonths.setMonth(threeMonths.getMonth() + 3);
  const oneMonth = new Date(now);
  oneMonth.setMonth(oneMonth.getMonth() + 1);
  const twoWeeks = new Date(now);
  twoWeeks.setDate(twoWeeks.getDate() + 14);

  return [
    {
      id: 'med-1',
      name: '二甲双胍',
      dosage: '500mg',
      frequency: '每日2次',
      timeSlots: ['morning', 'evening'],
      mealRelation: 'after_meal',
      disease: 'diabetes',
      startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(),
      prescriptionEndDate: oneMonth.toISOString(),
      notes: '餐后服用，减少胃肠不适',
    },
    {
      id: 'med-2',
      name: '格列美脲',
      dosage: '1mg',
      frequency: '每日1次',
      timeSlots: ['morning'],
      mealRelation: 'before_meal',
      disease: 'diabetes',
      startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(),
      prescriptionEndDate: oneMonth.toISOString(),
      notes: '早餐前15分钟服用',
    },
    {
      id: 'med-3',
      name: '氨氯地平',
      dosage: '5mg',
      frequency: '每日1次',
      timeSlots: ['morning'],
      mealRelation: 'independent',
      disease: 'hypertension',
      startDate: new Date(now.getFullYear(), now.getMonth() - 5, 15).toISOString(),
      prescriptionEndDate: threeMonths.toISOString(),
    },
    {
      id: 'med-4',
      name: '缬沙坦',
      dosage: '80mg',
      frequency: '每日1次',
      timeSlots: ['morning'],
      mealRelation: 'independent',
      disease: 'hypertension',
      startDate: new Date(now.getFullYear(), now.getMonth() - 5, 15).toISOString(),
      prescriptionEndDate: threeMonths.toISOString(),
    },
    {
      id: 'med-5',
      name: '阿托伐他汀',
      dosage: '20mg',
      frequency: '每日1次',
      timeSlots: ['bedtime'],
      mealRelation: 'independent',
      disease: 'hyperlipidemia',
      startDate: new Date(now.getFullYear(), now.getMonth() - 3, 10).toISOString(),
      prescriptionEndDate: twoWeeks.toISOString(),
      notes: '睡前服用效果最佳',
    },
  ];
}

export function generateMockDeviceReadings(): DeviceReading[] {
  const readings: DeviceReading[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);

    readings.push({
      id: `bg-am-${i}`,
      type: 'blood_glucose',
      value: +(5.5 + Math.random() * 3).toFixed(1),
      unit: 'mmol/L',
      timestamp: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 7, 0).toISOString(),
      source: '血糖仪 · 三诺安稳',
    });

    readings.push({
      id: `bg-pm-${i}`,
      type: 'blood_glucose',
      value: +(7.0 + Math.random() * 4).toFixed(1),
      unit: 'mmol/L',
      timestamp: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 14, 0).toISOString(),
      source: '血糖仪 · 三诺安稳',
    });

    const systolic = Math.round(120 + Math.random() * 30);
    readings.push({
      id: `bp-${i}`,
      type: 'blood_pressure',
      value: systolic,
      valueDiastolic: Math.round(systolic * 0.6 + Math.random() * 10),
      unit: 'mmHg',
      timestamp: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 8, 0).toISOString(),
      source: '血压计 · 欧姆龙 U726',
    });

    readings.push({
      id: `hr-${i}`,
      type: 'heart_rate',
      value: Math.round(65 + Math.random() * 20),
      unit: 'bpm',
      timestamp: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 10, 0).toISOString(),
      source: '智能手表 · 华为 Watch GT',
    });
  }

  return readings;
}

export const KNOWN_INTERACTIONS: DrugInteraction[] = [
  {
    drug1: '阿托伐他汀',
    drug2: '红霉素',
    severity: 'high',
    description: '红霉素会抑制阿托伐他汀的代谢（CYP3A4抑制），显著增加他汀类药物的血药浓度，增加横纹肌溶解风险。',
    recommendation: '避免同时使用。如需抗感染治疗，请咨询医生更换抗生素种类（如阿奇霉素）。',
  },
  {
    drug1: '二甲双胍',
    drug2: '碘造影剂',
    severity: 'high',
    description: '碘造影剂可能导致急性肾功能下降，与二甲双胍合用增加乳酸酸中毒风险。',
    recommendation: '造影检查前48小时停用二甲双胍，检查后确认肾功能正常方可恢复。',
  },
  {
    drug1: '缬沙坦',
    drug2: '补钾制剂',
    severity: 'medium',
    description: '缬沙坦本身可升高血钾，与补钾制剂合用可能导致高钾血症。',
    recommendation: '如确需补钾，请在医生指导下定期监测血钾水平。',
  },
  {
    drug1: '格列美脲',
    drug2: '氟康唑',
    severity: 'medium',
    description: '氟康唑抑制CYP2C9酶，可能增加格列美脲的降糖作用，导致低血糖风险。',
    recommendation: '合用时需加强血糖监测，必要时调整格列美脲剂量。',
  },
  {
    drug1: '氨氯地平',
    drug2: '西咪替丁',
    severity: 'low',
    description: '西咪替丁可能轻度升高氨氯地平血药浓度。',
    recommendation: '通常无需调整剂量，但注意监测血压变化。',
  },
];

export function getMockInteractionResult(drug1: string, drug2: string): DrugInteraction | null {
  return KNOWN_INTERACTIONS.find(
    (i) =>
      (i.drug1.includes(drug1) && i.drug2.includes(drug2)) ||
      (i.drug1.includes(drug2) && i.drug2.includes(drug1))
  ) ?? null;
}
