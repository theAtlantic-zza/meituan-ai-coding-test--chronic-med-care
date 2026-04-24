'use client';

import { useState } from 'react';
import { useApp } from '../lib/context';
import { Medication } from '../lib/types';
import AddMedicationModal from './add-medication-modal';
import DeviceView from './device-view';
import InteractionView from './interaction-view';

type SubView = 'main' | 'devices' | 'interaction';

export default function HealthView() {
  const { medications, addMedication, restoreShowcase } = useApp();
  const [subView, setSubView] = useState<SubView>('main');
  const [showAdd, setShowAdd] = useState(false);
  const [calendarHint, setCalendarHint] = useState(false);

  function handleAdd(med: Medication) {
    addMedication(med);
    setShowAdd(false);
  }

  if (subView === 'devices') {
    return (
      <div>
        <button
          type="button"
          onClick={() => setSubView('main')}
          className="sticky top-0 z-10 w-full text-left px-4 py-3 bg-white border-b border-slate-100 text-sm font-semibold text-primary"
        >
          ← 返回健康档案
        </button>
        <DeviceView />
      </div>
    );
  }

  if (subView === 'interaction') {
    return (
      <div>
        <button
          type="button"
          onClick={() => setSubView('main')}
          className="sticky top-0 z-10 w-full text-left px-4 py-3 bg-white border-b border-slate-100 text-sm font-semibold text-primary"
        >
          ← 返回健康档案
        </button>
        <InteractionView />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4 pb-24 bg-slate-50 min-h-full">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <p className="text-sm font-bold text-amber-700 mb-1">⚠️ 医疗 AI 边界提示</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          本应用所有 AI 功能仅供辅助参考，不能替代专业医生的诊断、治疗和处方。
          如有任何健康问题，请及时咨询您的主治医生。
        </p>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <h3 className="text-sm font-bold text-slate-700 px-4 pt-4 pb-2">我的用药计划</h3>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="w-full text-left px-4 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-slate-800">建立新用药计划</p>
            <p className="text-xs text-slate-400 mt-0.5">添加药品、设置剂量与频次</p>
          </div>
          <span className="text-slate-300 text-lg">›</span>
        </button>
        <button
          type="button"
          onClick={() => setCalendarHint(true)}
          className="w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-slate-800">复诊提醒日历</p>
            <p className="text-xs text-slate-400 mt-0.5">管理就医日程（模拟接口）</p>
          </div>
          <span className="text-slate-300 text-lg">›</span>
        </button>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <h3 className="text-sm font-bold text-slate-700 px-4 pt-4 pb-2">健康工具</h3>
        <button
          type="button"
          onClick={() => setSubView('devices')}
          className="w-full text-left px-4 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-slate-800">健康设备同步</p>
            <p className="text-xs text-slate-400 mt-0.5">血糖、血压趋势折线图（模拟接口）</p>
          </div>
          <span className="text-slate-300 text-lg">›</span>
        </button>
        <button
          type="button"
          onClick={() => setSubView('interaction')}
          className="w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-slate-800">药物相互作用查询</p>
            <p className="text-xs text-slate-400 mt-0.5">AI 辅助防范联合用药风险</p>
          </div>
          <span className="text-slate-300 text-lg">›</span>
        </button>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <h3 className="text-sm font-bold text-slate-700 mb-2">当前用药概览</h3>
        {medications.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-slate-400 mb-3">暂无药品，可在「购药续方」或上方入口添加</p>
            <button
              type="button"
              onClick={() => restoreShowcase()}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium"
            >
              ✨ 恢复轻量示例
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-2">共 {medications.length} 种药物在管理中</p>
            <div className="flex flex-wrap gap-2">
              {medications.map((med) => (
                <span key={med.id} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {med.name}
                </span>
              ))}
            </div>
          </>
        )}
      </section>

      <p className="text-center text-xs text-slate-300 pt-2">
        目前处于演示模式（Mock API）
      </p>

      {calendarHint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setCalendarHint(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-xs shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl mb-3">🗓️</p>
            <p className="font-bold mb-1">复诊提醒日历</p>
            <p className="text-sm text-slate-400 mb-4">已为您创建下次复诊提醒（模拟接口）</p>
            <button type="button" onClick={() => setCalendarHint(false)} className="px-6 py-2 rounded-lg bg-primary text-white text-sm">好的</button>
          </div>
        </div>
      )}

      {showAdd && <AddMedicationModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
