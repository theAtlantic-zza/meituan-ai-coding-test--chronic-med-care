'use client';

import { useApp } from '../lib/context';
import { DISEASE_LABELS } from '../lib/types';

export default function RenewalView() {
  const { medications } = useApp();
  const now = new Date();

  const sorted = [...medications].sort(
    (a, b) => new Date(a.prescriptionEndDate).getTime() - new Date(b.prescriptionEndDate).getTime()
  );

  function daysLeft(endDate: string) {
    return Math.ceil((new Date(endDate).getTime() - now.getTime()) / 86_400_000);
  }

  function urgency(days: number) {
    if (days <= 7)  return { bg: 'bg-danger-light',  border: 'border-danger/20',  text: 'text-danger',  label: '即将到期' };
    if (days <= 30) return { bg: 'bg-warning-light', border: 'border-warning/20', text: 'text-warning', label: '注意续方' };
    return              { bg: 'bg-success-light', border: 'border-success/20', text: 'text-success', label: '有效期内' };
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <h2 className="text-lg font-bold">续方管理</h2>
      <p className="text-sm text-slate-400">追踪处方有效期，及时线上续方</p>

      <div className="space-y-3">
        {sorted.map((med) => {
          const d = daysLeft(med.prescriptionEndDate);
          const s = urgency(d);
          return (
            <div key={med.id} className={`rounded-2xl p-4 border ${s.bg} ${s.border}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{med.name} {med.dosage}</span>
                <span className={`text-xs font-bold ${s.text}`}>{s.label}</span>
              </div>
              <p className="text-sm text-slate-500">
                {DISEASE_LABELS[med.disease]} · 到期日 {new Date(med.prescriptionEndDate).toLocaleDateString('zh-CN')}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-sm font-bold ${s.text}`}>
                  {d > 0 ? `剩余 ${d} 天` : `已过期 ${Math.abs(d)} 天`}
                </span>
                {d <= 30 && (
                  <button className="px-4 py-1.5 rounded-lg bg-white text-primary text-sm font-medium border border-primary/20">
                    去续方
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {medications.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-2">📅</p>
          <p>暂无处方记录</p>
        </div>
      )}

      <div className="bg-slate-50 rounded-xl p-3 border border-dashed border-slate-200">
        <p className="text-xs text-slate-400 text-center">
          💡 慢性病处方通常有效期为1-3个月，建议在到期前两周启动续方流程。可通过美团买药或线上问诊平台完成续方。
        </p>
      </div>
    </div>
  );
}
