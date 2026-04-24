'use client';

import { useState } from 'react';
import {
  Medication, DiseaseCategory, TimeSlot, MealRelation,
  DISEASE_LABELS, TIME_SLOT_LABELS, MEAL_RELATION_LABELS,
} from '../lib/types';
import { DISEASE_TEMPLATES } from '../lib/mock-data';

export default function AddMedicationModal({ onAdd, onClose }: {
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
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {step === 'disease' && (
          <>
            <h2 className="text-lg font-bold mb-4">选择病种</h2>
            <div className="space-y-2">
              {Object.entries(DISEASE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    const selected = key as DiseaseCategory;
                    setDisease(selected);
                    setStep(selected === 'other' ? 'custom' : 'template');
                  }}
                  className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary hover:bg-primary-light transition-colors">
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
            <button onClick={onClose} className="w-full mt-4 py-2 text-sm text-slate-400">取消</button>
          </>
        )}

        {step === 'template' && disease && (
          <>
            <h2 className="text-lg font-bold mb-2">常见药物模板</h2>
            <p className="text-sm text-slate-400 mb-4">选择模板快速填入，或手动添加</p>
            <div className="space-y-2">
              {DISEASE_TEMPLATES.find((t) => t.disease === disease)?.commonMedications.map((tmpl, i) => (
                <button key={i} onClick={() => applyTemplate(tmpl)}
                  className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary transition-colors">
                  <span className="font-medium">{tmpl.name}</span>
                  <span className="text-sm text-slate-400 ml-2">{tmpl.dosage} · {tmpl.frequency}</span>
                </button>
              ))}
              <button onClick={() => setStep('custom')}
                className="w-full text-left p-4 rounded-xl border border-dashed border-slate-200 text-slate-400 hover:border-primary transition-colors">
                + 手动输入
              </button>
            </div>
            <button onClick={() => setStep('disease')} className="w-full mt-4 py-2 text-sm text-slate-400">返回</button>
          </>
        )}

        {step === 'custom' && (
          <>
            <h2 className="text-lg font-bold mb-4">添加药物</h2>
            <label className="block text-sm font-medium mb-1">药品名称</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm" placeholder="如：二甲双胍" />
            <label className="block text-sm font-medium mb-1">剂量</label>
            <input value={dosage} onChange={(e) => setDosage(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm" placeholder="如：500mg" />
            <label className="block text-sm font-medium mb-1">频次</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm">
              <option>每日1次</option><option>每日2次</option><option>每日3次</option><option>每周1次</option>
            </select>
            <label className="block text-sm font-medium mb-1">服药时间</label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {(['morning', 'noon', 'evening', 'bedtime'] as TimeSlot[]).map((slot) => (
                <button key={slot} type="button" onClick={() => toggleSlot(slot)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${timeSlots.includes(slot) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {TIME_SLOT_LABELS[slot]}
                </button>
              ))}
            </div>
            <label className="block text-sm font-medium mb-1">餐时关系</label>
            <select value={mealRelation} onChange={(e) => setMealRelation(e.target.value as MealRelation)} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm">
              {Object.entries(MEAL_RELATION_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
            </select>
            <label className="block text-sm font-medium mb-1">处方有效期（月）</label>
            <input type="number" value={months} onChange={(e) => setMonths(+e.target.value)} min={1} max={12} className="w-full border rounded-lg px-3 py-2 mb-3 text-sm" />
            <label className="block text-sm font-medium mb-1">备注</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-4 text-sm" placeholder="服药注意事项" />
            <div className="flex gap-2">
              <button onClick={() => setStep('template')} className="flex-1 py-2 rounded-lg border text-sm">返回</button>
              <button onClick={handleSubmit} disabled={!name || !dosage} className="flex-1 py-2 rounded-lg bg-primary text-white text-sm disabled:opacity-50">确认添加</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
