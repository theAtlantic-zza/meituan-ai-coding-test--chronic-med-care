'use client';

import { useApp } from '../lib/context';
import { TabType } from '../lib/types';

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'dashboard', label: '今日用药', icon: '📋' },
  { id: 'medications', label: '药箱管理', icon: '💊' },
  { id: 'interaction', label: '用药查询', icon: '🔍' },
  { id: 'devices', label: '健康数据', icon: '📱' },
  { id: 'renewal', label: '续方管理', icon: '📅' },
];

export default function NavBar() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex max-w-lg mx-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              activeTab === tab.id ? 'text-primary font-medium' : 'text-slate-400'
            }`}
          >
            <span className="text-xl mb-0.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
