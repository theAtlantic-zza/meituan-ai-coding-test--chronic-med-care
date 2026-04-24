'use client';

import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../lib/context';
import {
  Medication, DiseaseCategory, TimeSlot, MealRelation,
  DISEASE_LABELS, TIME_SLOT_LABELS, MEAL_RELATION_LABELS,
} from '../lib/types';
import { DISEASE_TEMPLATES } from '../lib/mock-data';

export default function PlanView() {
  const { medications, addMedication, removeMedication, addMedicationRequestId } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showOcr, setShowOcr] = useState(false);

  const byDisease = Object.entries(DISEASE_LABELS)
    .map(([key, label]) => ({
      disease: key as DiseaseCategory,
      label,
      meds: medications.filter((m) => m.disease === key),
    }))
    .filter((g) => g.meds.length > 0);

  useEffect(() => {
    if (addMedicationRequestId > 0) setShowAdd(true);
  }, [addMedicationRequestId]);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">我的药箱</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowOcr(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200"
          >
            📷 识别处方
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
          >
            + 添加药物
          </button>
        </div>
      </div>

      {byDisease.map(({ disease, label, meds }) => (
        <div key={disease}>
          <h3 className="text-sm font-medium text-slate-500 mb-2">{label}</h3>
          <div className="space-y-2">
            {meds.map((med) => (
              <div key={med.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{med.name}</span>
                    <span className="text-sm text-slate-400 ml-2">{med.dosage}</span>
                  </div>
                  <button onClick={() => removeMedication(med.id)} className="text-slate-300 hover:text-danger text-sm">
                    删除
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {med.frequency} · {med.timeSlots.map((s) => TIME_SLOT_LABELS[s]).join('、')} · {MEAL_RELATION_LABELS[med.mealRelation]}
                </p>
                {med.notes && <p className="text-xs text-slate-400 mt-1">{med.notes}</p>}
                <p className="text-xs text-slate-300 mt-2">
                  处方有效期至 {new Date(med.prescriptionEndDate).toLocaleDateString('zh-CN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {medications.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-2">📦</p>
          <p>药箱为空</p>
          <p className="text-sm">点击上方按钮添加药物</p>
        </div>
      )}

      {showAdd && (
        <AddMedicationModal
          onAdd={(med) => { addMedication(med); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {showOcr && (
        <PrescriptionOcrModal
          onClose={() => setShowOcr(false)}
          onImport={(items) => {
            items.forEach(addMedication);
            setShowOcr(false);
          }}
        />
      )}
    </div>
  );
}

/* ── Add medication modal with disease template selection ── */

function AddMedicationModal({ onAdd, onClose }: {
  onAdd: (med: Medication) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<'disease' | 'template' | 'custom'>('disease');
  const [disease, setDisease] = useState<DiseaseCategory | null>(null);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('每日1次');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(['morning']);
  const [mealRelation, setMealRelation] = useState<MealRelation>('after_meal');
  const [notes, setNotes] = useState('');
  const [months, setMonths] = useState(3);

  function toggleSlot(slot: TimeSlot) {
    setTimeSlots((p) => (p.includes(slot) ? p.filter((s) => s !== slot) : [...p, slot]));
  }

  function handleSubmit() {
    if (!name || !dosage || !disease) return;
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + months);
    onAdd({
      id: `med-${Date.now()}`,
      name, dosage, frequency, timeSlots, mealRelation,
      disease,
      startDate: now.toISOString(),
      prescriptionEndDate: end.toISOString(),
      notes: notes || undefined,
    });
  }

  function applyTemplate(tmpl: (typeof DISEASE_TEMPLATES)[number]['commonMedications'][number]) {
    setName(tmpl.name);
    setDosage(tmpl.dosage);
    setFrequency(tmpl.frequency);
    setTimeSlots(tmpl.timeSlots);
    setMealRelation(tmpl.mealRelation);
    setNotes(tmpl.notes || '');
    setStep('custom');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step 1: pick disease */}
        {step === 'disease' && (
          <>
            <h2 className="text-lg font-bold mb-4">选择病种</h2>
            <div className="space-y-2">
              {Object.entries(DISEASE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setDisease(key as DiseaseCategory); setStep('template'); }}
                  className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary hover:bg-primary-light transition-colors"
                >
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
            <button onClick={onClose} className="w-full mt-4 py-2 text-sm text-slate-400">取消</button>
          </>
        )}

        {/* Step 2: template or manual */}
        {step === 'template' && disease && (
          <>
            <h2 className="text-lg font-bold mb-2">常见药物模板</h2>
            <p className="text-sm text-slate-400 mb-4">选择模板快速填入，或手动添加</p>
            <div className="space-y-2">
              {DISEASE_TEMPLATES.find((t) => t.disease === disease)?.commonMedications.map((tmpl, i) => (
                <button
                  key={i}
                  onClick={() => applyTemplate(tmpl)}
                  className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary transition-colors"
                >
                  <span className="font-medium">{tmpl.name}</span>
                  <span className="text-sm text-slate-400 ml-2">{tmpl.dosage} · {tmpl.frequency}</span>
                </button>
              ))}
              <button
                onClick={() => setStep('custom')}
                className="w-full text-left p-4 rounded-xl border border-dashed border-slate-200 text-slate-400 hover:border-primary transition-colors"
              >
                + 手动输入
              </button>
            </div>
            <button onClick={() => setStep('disease')} className="w-full mt-4 py-2 text-sm text-slate-400">返回</button>
          </>
        )}

        {/* Step 3: form */}
        {step === 'custom' && (
          <>
            <h2 className="text-lg font-bold mb-4">添加药物</h2>

            <label className="block text-sm font-medium mb-1">药品名称</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm" placeholder="如：二甲双胍" />

            <label className="block text-sm font-medium mb-1">剂量</label>
            <input value={dosage} onChange={(e) => setDosage(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm" placeholder="如：500mg" />

            <label className="block text-sm font-medium mb-1">频次</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm">
              <option>每日1次</option>
              <option>每日2次</option>
              <option>每日3次</option>
              <option>每周1次</option>
            </select>

            <label className="block text-sm font-medium mb-1">服药时间</label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {(['morning', 'noon', 'evening', 'bedtime'] as TimeSlot[]).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    timeSlots.includes(slot) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {TIME_SLOT_LABELS[slot]}
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium mb-1">餐时关系</label>
            <select value={mealRelation} onChange={(e) => setMealRelation(e.target.value as MealRelation)} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm">
              {Object.entries(MEAL_RELATION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>

            <label className="block text-sm font-medium mb-1">处方有效期（月）</label>
            <input type="number" value={months} onChange={(e) => setMonths(+e.target.value)} min={1} max={12} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm" />

            <label className="block text-sm font-medium mb-1">备注</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-4 text-sm" placeholder="服药注意事项" />

            <div className="flex gap-2">
              <button onClick={() => setStep('template')} className="flex-1 py-2 rounded-lg border text-sm">返回</button>
              <button onClick={handleSubmit} disabled={!name || !dosage} className="flex-1 py-2 rounded-lg bg-primary text-white text-sm disabled:opacity-50">
                确认添加
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PrescriptionOcrModal({ onClose, onImport }: {
  onClose: () => void;
  onImport: (meds: Medication[]) => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsed, setParsed] = useState<Medication[] | null>(null);

  const demo = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 2);
    return [
      {
        id: `ocr-${Date.now()}-1`,
        name: '阿托伐他汀',
        dosage: '20mg',
        frequency: '每日1次',
        timeSlots: ['bedtime'] as TimeSlot[],
        mealRelation: 'independent' as MealRelation,
        disease: 'hyperlipidemia' as DiseaseCategory,
        startDate: now.toISOString(),
        prescriptionEndDate: end.toISOString(),
        notes: '模拟识别：睡前服用',
      },
      {
        id: `ocr-${Date.now()}-2`,
        name: '氨氯地平',
        dosage: '5mg',
        frequency: '每日1次',
        timeSlots: ['morning'] as TimeSlot[],
        mealRelation: 'independent' as MealRelation,
        disease: 'hypertension' as DiseaseCategory,
        startDate: now.toISOString(),
        prescriptionEndDate: end.toISOString(),
        notes: '模拟识别：每日固定时间',
      },
    ] satisfies Medication[];
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2">拍照识别处方（模拟示例）</h2>
        <div className="rounded-xl p-4 border border-warning/20 bg-warning-light mb-4">
          <p className="font-bold text-warning">⚠️ 医疗 AI 边界提示</p>
          <p className="text-sm text-slate-600 mt-1">
            处方识别结果仅用于录入辅助，最终请以医生处方为准，勿据此自行调整用药。
          </p>
        </div>

        <label className="block text-sm font-medium mb-1">上传处方照片</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setFileName(f.name);
            setParsed(null);
            window.setTimeout(() => setParsed(demo), 600);
          }}
        />
        <p className="text-xs text-slate-400 mb-4">
          {fileName ? `已选择：${fileName}（模拟解析中…）` : '本 demo 不做真实 OCR，仅展示“我考虑到了该功能”的产品能力。'}
        </p>

        {parsed ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">识别结果（示例）</p>
            {parsed.map((m) => (
              <div key={m.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-sm text-slate-400">{m.dosage}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {m.frequency} · {m.timeSlots.map((s) => TIME_SLOT_LABELS[s]).join('、')} · {MEAL_RELATION_LABELS[m.mealRelation]}
                </p>
              </div>
            ))}
            <button
              onClick={() => onImport(parsed)}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-medium text-sm mt-2"
            >
              导入到药箱
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">
              你可以上传任意图片触发“模拟识别”结果，展示产品可扩展至处方拍照录入。
            </p>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-4 py-2 text-sm text-slate-400">关闭</button>
      </div>
    </div>
  );
}
