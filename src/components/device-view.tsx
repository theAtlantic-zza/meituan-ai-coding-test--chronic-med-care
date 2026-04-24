'use client';

import { useState } from 'react';
import { useApp } from '../lib/context';

export default function DeviceView() {
  const { deviceReadings, syncDeviceMock } = useApp();
  const [syncedHint, setSyncedHint] = useState(false);
  const readings = deviceReadings;

  const glucose = readings.filter((r) => r.type === 'blood_glucose');
  const bp = readings.filter((r) => r.type === 'blood_pressure');
  const hr = readings.filter((r) => r.type === 'heart_rate');

  function glucoseTag(v: number) {
    if (v < 3.9) return { label: '偏低', cls: 'text-warning' };
    if (v <= 6.1) return { label: '正常', cls: 'text-success' };
    if (v <= 7.8) return { label: '偏高', cls: 'text-warning' };
    return { label: '过高', cls: 'text-danger' };
  }

  function bpTag(sys: number) {
    if (sys < 120) return { label: '正常', cls: 'text-success' };
    if (sys < 140) return { label: '偏高', cls: 'text-warning' };
    return { label: '高血压', cls: 'text-danger' };
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <h2 className="text-lg font-bold">健康数据</h2>
      <p className="text-sm text-slate-400">来自智能设备的监测数据（模拟接口）</p>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">设备同步（模拟接口）</p>
            <p className="text-xs text-slate-400 mt-1">点击按钮模拟从血糖仪/血压计/手表同步数据</p>
          </div>
          <button
            onClick={() => {
              syncDeviceMock();
              setSyncedHint(true);
              window.setTimeout(() => setSyncedHint(false), 2500);
            }}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
          >
            模拟同步
          </button>
        </div>
        {syncedHint && (
          <p className="text-xs text-success mt-3 bg-success-light rounded-lg p-2 border border-success/20">
            ✅ 已通过模拟接口同步设备数据（示例）
          </p>
        )}
      </div>

      {readings.length === 0 && (
        <div className="text-center py-10 text-slate-400">
          <p className="text-4xl mb-2">📡</p>
          <p>暂无设备数据</p>
          <p className="text-sm">点击上方「模拟同步」导入示例数据</p>
        </div>
      )}

      {/* Blood glucose */}
      {readings.length > 0 && (
      <Section icon="🩸" title="血糖监测" source="三诺安稳血糖仪">
        {glucose.slice(-6).map((r) => {
          const tag = glucoseTag(r.value);
          return (
            <Row key={r.id} time={r.timestamp}>
              <span className="font-medium">{r.value}</span>
              <span className="text-slate-400 ml-1">{r.unit}</span>
              <span className={`ml-2 text-xs font-medium ${tag.cls}`}>{tag.label}</span>
            </Row>
          );
        })}
        {glucose.some((r) => r.value > 7.8) && (
          <p className="text-xs text-warning mt-3 bg-warning-light rounded-lg p-2">
            ⚠️ 近期有血糖偏高记录，建议关注饮食并确认按时服用降糖药物。如持续偏高请及时就医。
          </p>
        )}
      </Section>
      )}

      {/* Blood pressure */}
      {readings.length > 0 && (
      <Section icon="💓" title="血压监测" source="欧姆龙 U726">
        {bp.map((r) => {
          const tag = bpTag(r.value);
          return (
            <Row key={r.id} time={r.timestamp}>
              <span className="font-medium">{r.value}/{r.valueDiastolic}</span>
              <span className="text-slate-400 ml-1">{r.unit}</span>
              <span className={`ml-2 text-xs font-medium ${tag.cls}`}>{tag.label}</span>
            </Row>
          );
        })}
      </Section>
      )}

      {/* Heart rate */}
      {readings.length > 0 && (
      <Section icon="⌚" title="心率监测" source="华为 Watch GT">
        {hr.map((r) => (
          <Row key={r.id} time={r.timestamp}>
            <span className="font-medium">{r.value}</span>
            <span className="text-slate-400 ml-1">{r.unit}</span>
          </Row>
        ))}
      </Section>
      )}

      <div className="bg-slate-50 rounded-xl p-3 border border-dashed border-slate-200">
        <p className="text-xs text-slate-400 text-center">
          📡 以上数据来自模拟接口（Mock API），用于展示产品与智能设备的数据联动能力。实际产品中将对接设备厂商 SDK。
        </p>
      </div>

      <p className="text-xs text-slate-300 text-center">
        ⚕️ 监测数据仅供自我健康管理参考，不作为诊断依据。
      </p>
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
        <h3 className="font-medium">{title}</h3>
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
