'use client';

import { useMemo, useState } from 'react';
import { useApp } from '../lib/context';
import type { DeviceReading } from '../lib/types';

export default function DeviceView() {
  const { deviceReadings, syncDeviceMock } = useApp();
  const [syncedHint, setSyncedHint] = useState(false);
  const readings = deviceReadings;

  const glucose = readings.filter((r) => r.type === 'blood_glucose');
  const bp = readings.filter((r) => r.type === 'blood_pressure');
  const hr = readings.filter((r) => r.type === 'heart_rate');

  function glucoseTag(v: number) {
    if (v < 3.9) return { label: '偏低', cls: 'text-sky-800' };
    if (v <= 6.1) return { label: '正常', cls: 'text-emerald-600' };
    if (v <= 7.8) return { label: '偏高', cls: 'text-sky-800' };
    return { label: '过高', cls: 'text-red-600' };
  }

  function bpTag(sys: number) {
    if (sys < 120) return { label: '正常', cls: 'text-emerald-600' };
    if (sys < 140) return { label: '偏高', cls: 'text-sky-800' };
    return { label: '高血压', cls: 'text-red-600' };
  }

  return (
    <div className="px-4 py-4 space-y-4 pb-24 bg-slate-50 min-h-full">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <p className="text-sm font-bold text-amber-700 mb-1">⚠️ 医疗 AI 边界提示</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          以下为模拟设备数据与折线图趋势，仅供自我管理参考，不能替代医院检查与医生诊断。
        </p>
      </div>

      <h2 className="text-lg font-bold text-slate-800">健康数据</h2>
      <p className="text-sm text-slate-400">来自智能设备的监测数据（模拟接口）</p>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-slate-800">设备同步（模拟接口）</p>
            <p className="text-xs text-slate-400 mt-1">点击按钮模拟从血糖仪/血压计/手表同步数据</p>
          </div>
          <button
            type="button"
            onClick={() => {
              syncDeviceMock();
              setSyncedHint(true);
              window.setTimeout(() => setSyncedHint(false), 2500);
            }}
            className="shrink-0 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold"
          >
            模拟同步
          </button>
        </div>
        {syncedHint && (
          <p className="text-xs text-emerald-700 mt-3 bg-emerald-50 rounded-lg p-2 border border-emerald-100">
            ✅ 已通过模拟接口同步设备数据（示例）
          </p>
        )}
      </div>

      {readings.length === 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
          <p className="text-4xl mb-2">📡</p>
          <p className="text-sm font-semibold text-slate-700 mb-1">暂无设备数据</p>
          <p className="text-xs text-slate-400 mb-4">同步后将展示列表与折线图趋势</p>
          <button
            type="button"
            onClick={() => syncDeviceMock()}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
          >
            立即模拟同步
          </button>
        </div>
      )}

      {glucose.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🩸</span>
            <h3 className="font-semibold text-slate-800">血糖趋势</h3>
            <span className="text-xs text-slate-300 ml-auto">mmol/L · 按日平均</span>
          </div>
          <GlucoseLineChart readings={glucose} />
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            折线图适合观察多日波动；单次数值仍须结合空腹/餐后场景解读，具体请以医生意见为准。
          </p>
        </div>
      )}

      {bp.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💓</span>
            <h3 className="font-semibold text-slate-800">收缩压趋势</h3>
            <span className="text-xs text-slate-300 ml-auto">mmHg · 按日</span>
          </div>
          <BpLineChart readings={bp} />
        </div>
      )}

      {readings.length > 0 && (
      <Section icon="🩸" title="血糖明细" source="三诺安稳血糖仪">
        {glucose.slice(-6).map((r) => {
          const tag = glucoseTag(r.value);
          return (
            <Row key={r.id} time={r.timestamp}>
              <span className="font-semibold">{r.value}</span>
              <span className="text-slate-400 ml-1">{r.unit}</span>
              <span className={`ml-2 text-xs font-semibold ${tag.cls}`}>{tag.label}</span>
            </Row>
          );
        })}
        {glucose.some((r) => r.value > 7.8) && (
          <p className="text-xs text-amber-700 mt-3 bg-amber-50 rounded-lg p-2 border border-amber-200 leading-relaxed">
            ⚠️ 近期有血糖偏高记录，建议关注饮食并确认按时服用降糖药物。如持续偏高请及时就医。
          </p>
        )}
      </Section>
      )}

      {readings.length > 0 && (
      <Section icon="💓" title="血压明细" source="欧姆龙 U726">
        {bp.map((r) => {
          const tag = bpTag(r.value);
          return (
            <Row key={r.id} time={r.timestamp}>
              <span className="font-semibold">{r.value}/{r.valueDiastolic}</span>
              <span className="text-slate-400 ml-1">{r.unit}</span>
              <span className={`ml-2 text-xs font-semibold ${tag.cls}`}>{tag.label}</span>
            </Row>
          );
        })}
      </Section>
      )}

      {readings.length > 0 && (
      <Section icon="⌚" title="心率明细" source="华为 Watch GT">
        {hr.map((r) => (
          <Row key={r.id} time={r.timestamp}>
            <span className="font-semibold">{r.value}</span>
            <span className="text-slate-400 ml-1">{r.unit}</span>
          </Row>
        ))}
      </Section>
      )}

      <div className="bg-slate-50 rounded-xl p-3 border border-dashed border-slate-200">
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          📡 以上数据来自模拟接口（Mock API），用于展示产品与智能设备的数据联动能力。实际产品中将对接设备厂商 SDK。
        </p>
      </div>

      <p className="text-xs text-slate-300 text-center">
        ⚕️ 监测数据仅供自我健康管理参考，不作为诊断依据。
      </p>
    </div>
  );
}

function dailyAverageGlucose(readings: DeviceReading[]) {
  const map = new Map<string, number[]>();
  readings.forEach((r) => {
    const d = r.timestamp.slice(0, 10);
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push(r.value);
  });
  return [...map.entries()]
    .map(([day, vals]) => ({ day, avg: vals.reduce((a, b) => a + b, 0) / vals.length }))
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-7);
}

function GlucoseLineChart({ readings }: { readings: DeviceReading[] }) {
  const series = useMemo(() => dailyAverageGlucose(readings), [readings]);
  return <SimpleLineChart series={series} unit="mmol/L" color="#3d7dd6" />;
}

function dailySystolic(readings: DeviceReading[]) {
  const map = new Map<string, number[]>();
  readings.forEach((r) => {
    const d = r.timestamp.slice(0, 10);
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push(r.value);
  });
  return [...map.entries()]
    .map(([day, vals]) => ({ day, avg: vals.reduce((a, b) => a + b, 0) / vals.length }))
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-7);
}

function BpLineChart({ readings }: { readings: DeviceReading[] }) {
  const series = useMemo(() => dailySystolic(readings), [readings]);
  return <SimpleLineChart series={series} unit="mmHg" color="#2563eb" />;
}

function SimpleLineChart({ series, unit, color }: {
  series: { day: string; avg: number }[];
  unit: string;
  color: string;
}) {
  const w = 320;
  const h = 120;
  const padL = 36;
  const padR = 12;
  const padT = 14;
  const padB = 28;

  if (series.length === 0) return <p className="text-xs text-slate-400">数据不足</p>;

  const vals = series.map((s) => s.avg);
  const minV = Math.min(...vals) - 0.5;
  const maxV = Math.max(...vals) + 0.5;
  const span = maxV - minV || 1;

  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const n = series.length;
  const step = n <= 1 ? 0 : innerW / (n - 1);

  const points = series.map((s, i) => {
    const x = padL + step * i;
    const y = padT + innerH - ((s.avg - minV) / span) * innerH;
    return { x, y, ...s };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-36" role="img" aria-label={`趋势折线图，单位 ${unit}`}>
        <line x1={padL} y1={padT + innerH} x2={w - padR} y2={padT + innerH} stroke="#e2e8f0" strokeWidth="1" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p) => (
          <circle key={p.day} cx={p.x} cy={p.y} r="4" fill={color} stroke="white" strokeWidth="2" />
        ))}
        <text x={4} y={padT + 8} fontSize="10" fill="#94a3b8">{maxV.toFixed(1)}</text>
        <text x={4} y={padT + innerH} fontSize="10" fill="#94a3b8">{minV.toFixed(1)}</text>
      </svg>
      <div className="flex justify-between px-1 text-[10px] text-slate-400 mt-1">
        {series.map((s) => (
          <span key={s.day}>{s.day.slice(5).replace('-', '/')}</span>
        ))}
      </div>
    </div>
  );
}

function Section({ icon, title, source, children }: {
  icon: string; title: string; source: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-300 ml-auto">{source}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ time, children }: { time: string; children: React.ReactNode }) {
  const d = new Date(time);
  const label = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span>{children}</span>
    </div>
  );
}
