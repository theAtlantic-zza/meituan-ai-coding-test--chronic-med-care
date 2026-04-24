'use client';

import { useState } from 'react';
import { useApp } from '../lib/context';

export default function Header() {
  const { elderlyMode, toggleElderlyMode, apiConfig, setApiConfig, clearDemo } = useApp();
  const [showApi, setShowApi] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-primary">💊 用药小管家</h1>
          <p className="text-xs text-slate-400">慢性病用药管理助手</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('确定要清空本机的用药/打卡/设备数据吗？这会回到空白模式。')) {
                clearDemo();
              }
            }}
            className="px-3 py-1.5 rounded-full text-sm bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            重置
          </button>
          <button
            onClick={toggleElderlyMode}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              elderlyMode ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {elderlyMode ? '✓ 关怀模式' : '👴 关怀模式'}
          </button>
          <button
            onClick={() => setShowApi(true)}
            className="px-3 py-1.5 rounded-full text-sm bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            🔑 API
          </button>
        </div>
      </div>

      {showApi && (
        <ApiKeyModal
          config={apiConfig}
          onSave={(c) => { setApiConfig(c); setShowApi(false); }}
          onClose={() => setShowApi(false)}
        />
      )}
    </header>
  );
}

function ApiKeyModal({ config, onSave, onClose }: {
  config: { key: string; baseUrl: string; model: string };
  onSave: (c: { key: string; baseUrl: string; model: string }) => void;
  onClose: () => void;
}) {
  const [key, setKey] = useState(config.key);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [model, setModel] = useState(config.model);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-1">API 设置</h2>
        <p className="text-xs text-slate-400 mb-4">
          密钥仅存储在浏览器本地，不会上传至任何服务器。不配置则使用演示数据。
        </p>

        <label className="block text-sm font-medium mb-1">API Key</label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-..."
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
        />

        <label className="block text-sm font-medium mb-1">Base URL</label>
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
        />

        <label className="block text-sm font-medium mb-1">模型</label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
        />

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border text-sm">取消</button>
          <button onClick={() => onSave({ key, baseUrl, model })} className="flex-1 py-2 rounded-lg bg-primary text-white text-sm">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
