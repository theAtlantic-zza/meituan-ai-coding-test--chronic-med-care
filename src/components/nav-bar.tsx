'use client';

import { useApp } from '../lib/context';
import { TabType } from '../lib/types';

const TABS: { id: TabType; label: string }[] = [
  { id: 'today', label: '今日用药' },
  { id: 'pharmacy', label: '购药续方' },
  { id: 'health', label: '健康档案' },
];

function TabIcon({ tab, active }: { tab: TabType; active: boolean }) {
  const color = active ? '#3d7dd6' : '#9ca3af';
  if (tab === 'today') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <rect x="3" y="10" width="18" height="4" rx="2" transform="rotate(-40 3 10)" stroke={color} strokeWidth="1.9" />
        <rect x="7.2" y="13.5" width="9.8" height="4" rx="2" transform="rotate(-40 7.2 13.5)" stroke={color} strokeWidth="1.9" />
      </svg>
    );
  }
  if (tab === 'pharmacy') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <rect x="5" y="7" width="14" height="12" rx="2.4" stroke={color} strokeWidth="1.9" />
        <path d="M9 7a3 3 0 0 1 6 0" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke={color} strokeWidth="1.9" />
      <path d="M5.5 18a6.5 6.5 0 0 1 13 0" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export default function NavBar() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex max-w-lg mx-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2.5 text-xs transition-colors ${
              activeTab === tab.id ? 'text-primary font-semibold' : 'text-slate-400'
            }`}
          >
            <span className="mb-0.5"><TabIcon tab={tab.id} active={activeTab === tab.id} /></span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
