'use client';

import { useState } from 'react';
import { useApp } from '../lib/context';
import { DrugInteraction } from '../lib/types';
import { getMockInteractionResult, KNOWN_INTERACTIONS } from '../lib/mock-data';

type Result = DrugInteraction | 'none' | 'loading' | null;

export default function InteractionView() {
  const { medications, apiConfig } = useApp();
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [result, setResult] = useState<Result>(null);

  async function check() {
    if (!drug1 || !drug2) return;
    setResult('loading');

    if (apiConfig.key) {
      try {
        const res = await fetch('/api/check-interaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ drug1, drug2, ...apiConfig }),
        });
        const data = await res.json();
        setResult(data.interaction || 'none');
        return;
      } catch { /* fall through to mock */ }
    }

    await new Promise((r) => setTimeout(r, 800));
    setResult(getMockInteractionResult(drug1, drug2) || 'none');
  }

  const severity: Record<string, { bg: string; border: string; text: string; label: string }> = {
    high:   { bg: 'bg-danger-light',  border: 'border-danger/20',  text: 'text-danger',  label: '⚠️ 高风险' },
    medium: { bg: 'bg-warning-light', border: 'border-warning/20', text: 'text-warning', label: '⚡ 中风险' },
    low:    { bg: 'bg-primary-light', border: 'border-primary/20', text: 'text-primary', label: 'ℹ️ 低风险' },
  };

  const allDrugNames = [
    ...medications.map((m) => m.name),
    ...KNOWN_INTERACTIONS.flatMap((i) => [i.drug1, i.drug2]),
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="px-4 py-4 space-y-4">
      <h2 className="text-lg font-bold">药物相互作用查询</h2>
      <p className="text-sm text-slate-400">输入两种药物名称，查询是否存在相互作用</p>

      <div className="rounded-2xl p-4 border border-warning/20 bg-warning-light">
        <p className="font-bold text-warning">⚠️ 医疗 AI 边界提示</p>
        <p className="text-sm text-slate-600 mt-1">
          相互作用分析仅供参考，不替代医生或药师判断；如需调整用药，请咨询专业人员。
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">药物 1</label>
          <input
            value={drug1}
            onChange={(e) => setDrug1(e.target.value)}
            list="drug-hints"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="输入药品名称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">药物 2</label>
          <input
            value={drug2}
            onChange={(e) => setDrug2(e.target.value)}
            list="drug-hints"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="输入药品名称"
          />
        </div>

        <datalist id="drug-hints">
          {allDrugNames.map((n) => <option key={n} value={n} />)}
        </datalist>

        <button
          onClick={check}
          disabled={!drug1 || !drug2 || result === 'loading'}
          className="w-full py-2.5 rounded-xl bg-primary text-white font-medium text-sm disabled:opacity-50"
        >
          {result === 'loading' ? '查询中...' : '🔍 查询相互作用'}
        </button>
      </div>

      {/* Result display */}
      {result && result !== 'loading' && result !== 'none' && (
        <div className={`rounded-2xl p-4 border ${severity[result.severity].bg} ${severity[result.severity].border}`}>
          <div className={`font-bold mb-2 ${severity[result.severity].text}`}>
            {severity[result.severity].label}
          </div>
          <p className="text-sm mb-2">{result.description}</p>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-sm font-medium">建议：</p>
            <p className="text-sm text-slate-600">{result.recommendation}</p>
          </div>
        </div>
      )}

      {result === 'none' && (
        <div className="bg-success-light rounded-2xl p-4 border border-success/20">
          <p className="text-success font-medium">✅ 未发现已知相互作用</p>
          <p className="text-sm text-slate-500 mt-1">
            「{drug1}」与「{drug2}」暂未查询到明确的相互作用记录。
          </p>
        </div>
      )}
      {!apiConfig.key && (
        <p className="text-xs text-slate-300 text-center">
          当前为演示模式（Mock）。配置 API Key 后可获取 AI 实时分析。
        </p>
      )}
    </div>
  );
}
