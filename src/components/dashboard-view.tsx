'use client';

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../lib/context';
import { TIME_SLOT_LABELS, TIME_SLOT_HOURS, TimeSlot, MedicationLog } from '../lib/types';
import QuickActionsSheet from './quick-actions-sheet';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function isTaken(logs: MedicationLog[], medId: string, date: string, slot: TimeSlot) {
  return logs.some((l) => l.medicationId === medId && l.date === date && l.timeSlot === slot && l.taken);
}

function doseLine(med: { dosage: string; notes?: string }) {
  if (med.notes?.trim()) return med.notes.trim();
  return `口服 · ${med.dosage}`;
}

interface MedSlotItem {
  med: import('../lib/types').Medication;
  slot: TimeSlot;
}

export default function DashboardView() {
  const { medications, logs, logMedication, loadDemo, restoreShowcase, clearDemo } = useApp();
  const [showConsult, setShowConsult] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const today = getToday();

  const allSlots = useMemo(() => {
    const items: MedSlotItem[] = [];
    medications.forEach((med) => {
      med.timeSlots.forEach((slot) => items.push({ med, slot }));
    });
    items.sort((a, b) => TIME_SLOT_HOURS[a.slot].localeCompare(TIME_SLOT_HOURS[b.slot]));
    return items;
  }, [medications]);

  const alarmSlotLabels = useMemo(
    () => [...new Set(allSlots.map((s) => `${TIME_SLOT_LABELS[s.slot]} ${TIME_SLOT_HOURS[s.slot]}`))],
    [allSlots]
  );

  const pending = allSlots.filter((item) => !isTaken(logs, item.med.id, today, item.slot));
  const taken = allSlots.filter((item) => isTaken(logs, item.med.id, today, item.slot));
  const totalDoses = allSlots.length;
  const takenCount = taken.length;
  const pct = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 0;

  useEffect(() => {
    if (pct === 100 && totalDoses > 0 && takenCount === totalDoses) {
      setShowCongrats(true);
    }
  }, [pct, totalDoses, takenCount]);

  function handleLog(medId: string, slot: TimeSlot) {
    logMedication(medId, today, slot);
  }

  const isEmpty = medications.length === 0;

  return (
    <div className="px-4 py-4 space-y-4 pb-24 bg-slate-50 min-h-full">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <p className="text-sm font-bold text-amber-700 mb-1">⚠️ 医疗 AI 边界提示</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          本应用仅用于用药提醒与自我管理，不提供诊断、处方或治疗方案。如有不适请及时就医。
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowConsult(true)}
        className="w-full text-left rounded-2xl bg-gradient-to-r from-[#2f6fd6] to-[#2457b8] text-white shadow-md active:scale-[0.99] transition-transform p-4 flex items-center gap-3"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6.5 4.5V9a3.5 3.5 0 0 0 7 0V4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="5.8" cy="5.2" r="1.1" stroke="white" strokeWidth="1.6" />
            <circle cx="13.2" cy="5.2" r="1.1" stroke="white" strokeWidth="1.6" />
            <path d="M10 12v2.2a3 3 0 0 0 3 3h1.6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="17.3" cy="17.4" r="1.9" stroke="white" strokeWidth="1.8" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-2xl leading-none text-white">极速问诊</p>
          <p className="text-sm mt-1.5 text-white/95 font-medium">身体不适？一键联系您的复诊医生</p>
        </div>
        <span className="text-3xl text-white/90 shrink-0 font-light">›</span>
      </button>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-800">今日用药进度</span>
          <span className="text-xl font-bold text-primary tabular-nums">{pct}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-2 font-medium">已服 {takenCount} / {totalDoses} 次</p>
        <button
          type="button"
          onClick={() => setShowQuickActions(true)}
          className="w-full mt-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200/90 transition-colors"
        >
          ⚡ 快捷操作（示例 / 日历 / 闹钟）
        </button>
      </div>

      {isEmpty && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 text-center">
          <div className="text-5xl mb-3">💊</div>
          <h2 className="text-base font-bold text-slate-900 mb-2">当前是空白模式</h2>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            可手动添加药物，或通过快捷操作恢复轻量示例（2 待服 + 2 已服，进度 50%）或加载完整演示数据
          </p>
          <button
            type="button"
            onClick={() => setShowQuickActions(true)}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-md shadow-primary/25"
          >
            ⚡ 打开快捷操作（示例 / 日历）
          </button>
        </div>
      )}

      {!isEmpty && pending.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-orange-500 mb-2">待服药（{pending.length}）</h3>
          <div className="space-y-2">
            {pending.map((item) => (
              <div
                key={`${item.med.id}-${item.slot}`}
                className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 border-l-4 border-l-orange-400 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs text-orange-500 font-bold mb-1">
                    🕐 {TIME_SLOT_LABELS[item.slot]} {TIME_SLOT_HOURS[item.slot]}
                  </p>
                  <p className="font-bold text-slate-900">{item.med.name}</p>
                  <p className="text-xs text-slate-500">{doseLine(item.med)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLog(item.med.id, item.slot)}
                  className="shrink-0 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold active:scale-95 transition-transform shadow-sm"
                >
                  确认打卡
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {!isEmpty && taken.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-slate-600 mb-2">已服药（{taken.length}）</h3>
          <div className="space-y-2">
            {taken.map((item) => (
              <div
                key={`${item.med.id}-${item.slot}`}
                className="bg-slate-100/80 rounded-xl p-4 border border-slate-100 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs text-slate-600 font-semibold mb-1">
                    ✅ {TIME_SLOT_LABELS[item.slot]} {TIME_SLOT_HOURS[item.slot]}（已按时）
                  </p>
                  <p className="font-bold text-slate-700">{item.med.name}</p>
                  <p className="text-xs text-slate-500">{doseLine(item.med)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLog(item.med.id, item.slot)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold active:scale-95 transition-transform"
                  aria-label="撤销打卡"
                  title="误点可撤销"
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <QuickActionsSheet
        open={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        medicationCount={medications.length}
        alarmSlotLabels={alarmSlotLabels}
        onRestoreShowcase={restoreShowcase}
        onLoadDemo={loadDemo}
        onClear={clearDemo}
      />

      {showConsult && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowConsult(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4 text-slate-900">极速问诊</h2>
            <button
              type="button"
              onClick={() => { alert('已为您连接至线上复诊平台（模拟接口）'); setShowConsult(false); }}
              className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary mb-2 transition-colors"
            >
              <p className="font-semibold text-slate-800">🩺 联系复诊医生</p>
              <p className="text-xs text-slate-500 mt-1">连接到您的主治医生或在线问诊平台</p>
            </button>
            <button
              type="button"
              onClick={() => { alert('⚠️ AI 症状预检仅供参考，不构成诊断。如有不适请及时就医。（模拟接口）'); setShowConsult(false); }}
              className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary mb-2 transition-colors"
            >
              <p className="font-semibold text-slate-800">🤖 AI 辅助常见症状检查</p>
              <p className="text-xs text-slate-500 mt-1">AI 提供初步参考，不替代专业医疗诊断</p>
            </button>
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2.5 mt-2 text-center border border-amber-200 leading-relaxed">
              ⚠️ AI 功能仅供辅助参考，不能替代专业医生诊断和处方
            </p>
            <button type="button" onClick={() => setShowConsult(false)} className="w-full mt-3 py-2 text-sm text-slate-400">关闭</button>
          </div>
        </div>
      )}

      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCongrats(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-xs shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-6xl mb-4">🎉</p>
            <p className="text-xl font-bold text-primary mb-2">太棒了！</p>
            <p className="font-semibold text-slate-800 mb-1">今日用药已全部完成</p>
            <p className="text-sm text-slate-500 mb-6">坚持用药是管理慢病的关键，您做得很好！</p>
            <button type="button" onClick={() => setShowCongrats(false)} className="px-8 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-md">继续加油 💪</button>
          </div>
        </div>
      )}
    </div>
  );
}
