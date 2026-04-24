'use client';

import { useState, useMemo } from 'react';
import { useApp } from '../lib/context';
import {
  Medication, TimeSlot, MealRelation,
  DISEASE_LABELS, TIME_SLOT_LABELS, MEAL_RELATION_LABELS,
} from '../lib/types';
import AddMedicationModal from './add-medication-modal';

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function PharmacyView() {
  const { medications, addMedication, removeMedication, restoreShowcase } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showOcr, setShowOcr] = useState(false);

  const expiringSoon = useMemo(() =>
    medications.filter((m) => m.prescriptionEndDate && daysUntil(m.prescriptionEndDate) <= 14)
      .sort((a, b) => daysUntil(a.prescriptionEndDate!) - daysUntil(b.prescriptionEndDate!)),
    [medications]
  );

  const allSorted = useMemo(() =>
    [...medications].sort((a, b) => {
      const da = a.prescriptionEndDate ? daysUntil(a.prescriptionEndDate) : 999;
      const db = b.prescriptionEndDate ? daysUntil(b.prescriptionEndDate) : 999;
      return da - db;
    }),
    [medications]
  );

  function handleAdd(med: Medication) {
    addMedication(med);
    setShowAdd(false);
  }

  const isEmpty = medications.length === 0;

  return (
    <div className="px-4 py-4 space-y-4 pb-24 bg-slate-50 min-h-full">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <p className="text-sm font-bold text-amber-700 mb-1">⚠️ 医疗 AI 边界提示</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          续方与购药入口仅为产品演示，实际用药请遵医嘱，以医院与药师指导为准。
        </p>
      </div>

      {expiringSoon.length > 0 && (
        <section className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm">
          <h3 className="text-sm font-bold text-red-600 mb-3">⚠️ 药箱库存预警</h3>
          {expiringSoon.map((med) => {
            const days = daysUntil(med.prescriptionEndDate!);
            const pct = Math.max(0, Math.min(100, (days / 14) * 100));
            return (
              <div key={med.id} className="bg-white rounded-xl p-3 mb-2 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{med.name}</span>
                  <span className="text-xs text-red-500 font-medium">
                    {days <= 0 ? '已过期' : `约剩余 ${days} 天用量`}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => alert('已跳转至美团买药页面（模拟接口）')}
            className="w-full mt-3 py-3.5 rounded-2xl bg-yellow-400 text-slate-900 font-bold text-lg active:scale-[0.98] transition-transform shadow-sm"
          >
            🛒 美团买药 一键复购
          </button>
        </section>
      )}

      <section>
        <h3 className="text-sm font-bold text-slate-500 mb-3">我的处方记录</h3>
        {isEmpty ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm font-bold text-slate-700 mb-1">暂无处方记录</p>
            <p className="text-xs text-slate-400 mb-4">可拍照识别、手动添加，或恢复示例数据</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => restoreShowcase()}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium"
              >
                ✨ 恢复轻量示例
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowOcr(true)} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium">📷 拍照识别</button>
                <button type="button" onClick={() => setShowAdd(true)} className="flex-1 py-2.5 rounded-xl border-2 border-primary text-primary text-sm font-medium">+ 手动添加</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {allSorted.map((med) => {
              const days = med.prescriptionEndDate ? daysUntil(med.prescriptionEndDate) : null;
              const isExpiring = days !== null && days <= 14;
              const isExpired = days !== null && days <= 0;
              return (
                <div key={med.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">{med.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isExpired ? 'bg-red-100 text-red-600' :
                          isExpiring ? 'bg-sky-100 text-sky-800' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {isExpired ? '已过期' : isExpiring ? '即将过期' : '有效'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {DISEASE_LABELS[med.disease]} · {med.dosage} · {med.frequency}
                      </p>
                      <p className="text-xs text-slate-400">
                        {med.timeSlots.map((s) => TIME_SLOT_LABELS[s]).join('、')} · {MEAL_RELATION_LABELS[med.mealRelation]}
                      </p>
                    </div>
                    {days !== null && (
                      <span className={`text-xs font-medium whitespace-nowrap ${isExpired ? 'text-red-500' : isExpiring ? 'text-amber-600' : 'text-slate-400'}`}>
                        {isExpired ? '已过期' : isExpiring ? `剩 ${days} 天有效` : `剩 ${days} 天`}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {isExpiring && (
                      <button
                        type="button"
                        onClick={() => alert('已提交线上续方申请（模拟接口）')}
                        className="flex-1 py-2 rounded-lg bg-primary text-white text-xs font-medium"
                      >
                        申请线上续方
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedication(med.id)}
                      className="px-3 py-2 rounded-lg text-xs text-red-400 border border-red-100 hover:bg-red-50 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {!isEmpty && (
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowOcr(true)}
            className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-md active:scale-[0.98] transition-transform"
          >
            📷 拍照识别处方
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="flex-1 py-3 rounded-xl border-2 border-primary text-primary text-sm font-semibold active:scale-[0.98] transition-transform"
          >
            + 手动添加
          </button>
        </div>
      )}

      {showAdd && <AddMedicationModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {showOcr && <PrescriptionOcrModal onAdd={addMedication} onClose={() => setShowOcr(false)} />}
    </div>
  );
}

const MOCK_OCR_RESULTS: { name: string; dosage: string; frequency: string; timeSlots: TimeSlot[]; mealRelation: MealRelation; disease: 'diabetes' | 'hypertension' | 'hyperlipidemia' }[] = [
  { name: '盐酸二甲双胍片', dosage: '500mg', frequency: '每日2次', timeSlots: ['morning', 'evening'], mealRelation: 'after_meal', disease: 'diabetes' },
  { name: '苯磺酸氨氯地平片', dosage: '5mg', frequency: '每日1次', timeSlots: ['morning'], mealRelation: 'independent', disease: 'hypertension' },
];

function PrescriptionOcrModal({ onAdd, onClose }: { onAdd: (med: Medication) => void; onClose: () => void }) {
  const [mode, setMode] = useState<'choose' | 'scanning' | 'edit'>('choose');
  const [editItems, setEditItems] = useState<typeof MOCK_OCR_RESULTS>([]);
  const [editIndex, setEditIndex] = useState(0);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [mealRelation, setMealRelation] = useState<MealRelation>('after_meal');
  const [months, setMonths] = useState(3);

  function startScan() {
    setMode('scanning');
    setTimeout(() => {
      setEditItems(MOCK_OCR_RESULTS);
      loadItem(0);
      setMode('edit');
    }, 1500);
  }

  function loadItem(idx: number) {
    const item = MOCK_OCR_RESULTS[idx];
    if (!item) return;
    setEditIndex(idx);
    setName(item.name);
    setDosage(item.dosage);
    setTimeSlots(item.timeSlots);
    setMealRelation(item.mealRelation);
  }

  function toggleSlot(slot: TimeSlot) {
    setTimeSlots((p) => (p.includes(slot) ? p.filter((s) => s !== slot) : [...p, slot]));
  }

  function confirmCurrent() {
    const item = editItems[editIndex];
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + months);
    onAdd({
      id: `med-ocr-${Date.now()}-${editIndex}`,
      name, dosage,
      frequency: item.frequency,
      timeSlots,
      mealRelation,
      disease: item.disease,
      startDate: now.toISOString(),
      prescriptionEndDate: end.toISOString(),
    });
    if (editIndex < editItems.length - 1) {
      loadItem(editIndex + 1);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>

        {mode === 'choose' && (
          <>
            <h2 className="text-lg font-bold mb-4">智能识别</h2>
            <button type="button" onClick={startScan}
              className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary mb-2 transition-colors">
              <p className="font-medium">📄 拍照识别处方</p>
              <p className="text-xs text-slate-400 mt-1">拍摄处方单，自动识别药品信息</p>
            </button>
            <button type="button" onClick={startScan}
              className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary mb-2 transition-colors">
              <p className="font-medium">📦 拍药盒识别药品</p>
              <p className="text-xs text-slate-400 mt-1">拍摄药盒，自动识别药品名称和剂量</p>
            </button>
            <button type="button" onClick={onClose} className="w-full mt-3 py-2 text-sm text-slate-400">取消</button>
          </>
        )}

        {mode === 'scanning' && (
          <div className="py-12 text-center">
            <div className="animate-pulse text-5xl mb-4">📷</div>
            <p className="font-medium text-slate-600">正在识别中...</p>
            <p className="text-xs text-slate-400 mt-1">模拟 OCR 处理</p>
          </div>
        )}

        {mode === 'edit' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">确认识别结果</h2>
              <span className="text-xs text-slate-400">{editIndex + 1}/{editItems.length}</span>
            </div>
            <p className="text-xs text-sky-900/90 bg-sky-50 rounded-lg p-2 mb-4 border border-sky-200/80 leading-relaxed">
              ⚠️ 请仔细核对识别结果，确保用药信息准确
            </p>

            <label className="block text-sm font-medium mb-1">药品名称</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3 text-sm" />

            <label className="block text-sm font-medium mb-1">剂量</label>
            <input value={dosage} onChange={(e) => setDosage(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3 text-sm" />

            <label className="block text-sm font-medium mb-1">用药时间</label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {(['morning', 'noon', 'evening', 'bedtime'] as TimeSlot[]).map((slot) => (
                <button key={slot} type="button" onClick={() => toggleSlot(slot)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${timeSlots.includes(slot) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {TIME_SLOT_LABELS[slot]}
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium mb-1">餐时关系</label>
            <select value={mealRelation} onChange={(e) => setMealRelation(e.target.value as MealRelation)}
              className="w-full border rounded-lg px-3 py-2 mb-3 text-sm">
              {Object.entries(MEAL_RELATION_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
            </select>

            <label className="block text-sm font-medium mb-1">处方有效期（月）</label>
            <input type="number" value={months} onChange={(e) => setMonths(+e.target.value)}
              min={1} max={12} className="w-full border rounded-lg px-3 py-2 mb-4 text-sm" />

            <div className="flex gap-2">
              <button type="button" onClick={() => { if (editIndex < editItems.length - 1) loadItem(editIndex + 1); else onClose(); }}
                className="flex-1 py-2 rounded-lg border text-sm text-slate-500">跳过</button>
              <button type="button" onClick={confirmCurrent} disabled={!name || !dosage}
                className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-50">
                确认并同步
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
