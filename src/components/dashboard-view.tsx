'use client';

import { useState } from 'react';
import { useApp } from '../lib/context';
import { TIME_SLOT_LABELS, TIME_SLOT_HOURS, MEAL_RELATION_LABELS, TimeSlot } from '../lib/types';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTimeSlot(): TimeSlot {
  const h = new Date().getHours();
  if (h < 10) return 'morning';
  if (h < 14) return 'noon';
  if (h < 20) return 'evening';
  return 'bedtime';
}

export default function DashboardView() {
  const { medications, logs, logMedication, loadDemo } = useApp();
  const today = getToday();
  const currentSlot = getCurrentTimeSlot();
  const [calendarHint, setCalendarHint] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const slots: TimeSlot[] = ['morning', 'noon', 'evening', 'bedtime'];

  const grouped = slots
    .map((slot) => ({ slot, meds: medications.filter((m) => m.timeSlots.includes(slot)) }))
    .filter((g) => g.meds.length > 0);

  const totalDoses = medications.reduce((s, m) => s + m.timeSlots.length, 0);
  const takenDoses = logs.filter((l) => l.date === today && l.taken).length;
  const pct = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  function isTaken(medId: string, slot: TimeSlot) {
    return logs.some((l) => l.medicationId === medId && l.date === today && l.timeSlot === slot && l.taken);
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="rounded-2xl p-4 border border-warning/20 bg-warning-light">
        <p className="font-bold text-warning">⚠️ 医疗 AI 边界提示</p>
        <p className="text-sm text-slate-600 mt-1">
          本应用仅用于用药提醒与管理，不提供诊断/处方建议。任何用药调整请遵医嘱或咨询医生/药师。
        </p>
      </div>

      {/* Progress card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">今日用药进度</span>
          <span className="text-2xl font-bold text-primary">{pct}%</span>
        </div>
        <button
          onClick={() => setShowQuickActions(true)}
          className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 mb-3"
        >
          ⚡ 快捷操作（示例 / 日历）
        </button>
        {calendarHint && (
          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2 border border-slate-100">
            ✅ 已模拟导入到系统日历（模拟接口）。真实产品将调用日历权限/生成 .ics 文件并写入事件。
          </p>
        )}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: pct === 100 ? 'var(--color-success)' : 'var(--color-primary)',
            }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          已服 {takenDoses}/{totalDoses} 次{pct === 100 ? ' · 🎉 今日全部完成！' : ''}
        </p>
      </div>

      {/* Timeline */}
      {grouped.map(({ slot, meds }) => (
        <div key={slot}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block w-2 h-2 rounded-full ${
              slot === currentSlot ? 'bg-primary animate-pulse' : 'bg-slate-300'
            }`} />
            <span className="text-sm font-medium text-slate-600">
              {TIME_SLOT_LABELS[slot]} · {TIME_SLOT_HOURS[slot]}
            </span>
            {slot === currentSlot && <span className="text-xs text-primary font-medium">← 当前</span>}
          </div>

          <div className="space-y-2">
            {meds.map((med) => {
              const taken = isTaken(med.id, slot);
              return (
                <button
                  key={`${med.id}-${slot}`}
                  onClick={() => logMedication(med.id, today, slot)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    taken
                      ? 'bg-success-light border-success/20'
                      : 'bg-white border-slate-100 shadow-sm active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{med.name}</span>
                      <span className="text-sm text-slate-400 ml-2">{med.dosage}</span>
                    </div>
                    <span className={`text-xl ${taken ? '' : 'opacity-30'}`}>
                      {taken ? '✅' : '⬜'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {MEAL_RELATION_LABELS[med.mealRelation]}
                    {med.notes ? ` · ${med.notes}` : ''}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {medications.length === 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center text-slate-500">
          <p className="text-4xl mb-2">💊</p>
          <p className="font-medium">当前是空白模式</p>
          <p className="text-sm text-slate-400 mt-1">你可以手动添加药物，或一键加载示例数据演示完整流程</p>
          <button
            onClick={() => setShowQuickActions(true)}
            className="w-full mt-4 py-3 rounded-xl bg-primary text-white text-sm font-bold"
          >
            ⚡ 打开快捷操作（示例 / 日历）
          </button>
        </div>
      )}

      {showQuickActions && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowQuickActions(false)}>
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-1">快捷操作</h3>
            <p className="text-xs text-slate-400 mb-4">演示模式与日历导入均为示例能力展示</p>

            {medications.length === 0 && (
              <button
                onClick={() => {
                  loadDemo();
                  setShowQuickActions(false);
                }}
                className="w-full py-3 rounded-xl bg-primary text-white text-sm font-bold mb-2"
              >
                ✨ 进入示例模式（Mock）
              </button>
            )}

            <button
              onClick={() => {
                setCalendarHint(true);
                window.setTimeout(() => setCalendarHint(false), 2500);
                setShowQuickActions(false);
              }}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50"
            >
              🗓️ 一键导入日历（模拟接口）
            </button>

            <button onClick={() => setShowQuickActions(false)} className="w-full mt-4 py-2 text-sm text-slate-400">
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
