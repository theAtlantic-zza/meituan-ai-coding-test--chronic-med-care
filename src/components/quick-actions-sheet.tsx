'use client';

import { useState, useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  medicationCount: number;
  alarmSlotLabels: string[];
  onRestoreShowcase: () => void;
  onLoadDemo: () => void;
  onClear: () => void;
};

export default function QuickActionsSheet({
  open,
  onClose,
  medicationCount,
  alarmSlotLabels,
  onRestoreShowcase,
  onLoadDemo,
  onClear,
}: Props) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [alarmOpen, setAlarmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setCalendarOpen(false);
      setAlarmOpen(false);
    }
  }, [open]);

  if (!open && !calendarOpen && !alarmOpen) return null;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4 text-slate-900">快捷操作</h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => { onRestoreShowcase(); onClose(); }}
                className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary transition-colors"
              >
                <span className="font-semibold text-slate-800">✨ 恢复轻量示例（2 待服 + 2 已服）</span>
                <p className="text-xs text-slate-500 mt-1">快速预览今日用药与 50% 进度</p>
              </button>
              <button
                type="button"
                onClick={() => { onLoadDemo(); onClose(); }}
                className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary transition-colors"
              >
                <span className="font-semibold text-slate-800">📦 加载完整示例数据</span>
                <p className="text-xs text-slate-500 mt-1">多病种、多药物完整演示</p>
              </button>
              <button
                type="button"
                onClick={() => { setCalendarOpen(true); onClose(); }}
                className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary transition-colors"
              >
                <span className="font-semibold text-slate-800">🗓️ 一键导入日历（模拟接口）</span>
                <p className="text-xs text-slate-500 mt-1">将用药时间同步到系统日历</p>
              </button>
              <button
                type="button"
                onClick={() => { setAlarmOpen(true); onClose(); }}
                className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary transition-colors"
              >
                <span className="font-semibold text-slate-800">⏰ 一键创建闹钟（模拟接口）</span>
                <p className="text-xs text-slate-500 mt-1">为每个服药时间创建系统闹钟</p>
              </button>
              <button
                type="button"
                onClick={() => { onClear(); onClose(); }}
                className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-red-200 text-red-600 transition-colors"
              >
                <span className="font-semibold">🗑️ 清空所有数据</span>
              </button>
            </div>
            <button type="button" onClick={onClose} className="w-full mt-3 py-2 text-sm text-slate-400">关闭</button>
          </div>
        </div>
      )}

      {calendarOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setCalendarOpen(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-xs shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl mb-3">🗓️</p>
            <p className="font-bold mb-1 text-slate-900">已模拟导入系统日历</p>
            <p className="text-sm text-slate-500 mb-4">已为 {Math.max(medicationCount, 1)} 种药物创建日历提醒事件</p>
            <button type="button" onClick={() => setCalendarOpen(false)} className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-semibold">好的</button>
          </div>
        </div>
      )}

      {alarmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setAlarmOpen(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-xs shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl mb-3">⏰</p>
            <p className="font-bold mb-1 text-slate-900">已模拟创建系统闹钟</p>
            <p className="text-sm text-slate-500 mb-4">
              {alarmSlotLabels.length > 0
                ? `已为每个服药时间创建闹钟（${alarmSlotLabels.join('、')}）`
                : '暂无用药时间，请先在「今日用药」恢复示例或添加药物'}
            </p>
            <button type="button" onClick={() => setAlarmOpen(false)} className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-semibold">好的</button>
          </div>
        </div>
      )}
    </>
  );
}
