'use client';

import { AppProvider, useApp } from '../lib/context';
import Header from '../components/header';
import NavBar from '../components/nav-bar';
import DashboardView from '../components/dashboard-view';
import PlanView from '../components/plan-view';
import InteractionView from '../components/interaction-view';
import DeviceView from '../components/device-view';
import RenewalView from '../components/renewal-view';

function MainContent() {
  const { activeTab, setActiveTab, requestAddMedication } = useApp();

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'medications' && <PlanView />}
        {activeTab === 'interaction' && <InteractionView />}
        {activeTab === 'devices' && <DeviceView />}
        {activeTab === 'renewal' && <RenewalView />}
      </main>
      <NavBar />

      <button
        onClick={() => {
          setActiveTab('medications');
          requestAddMedication();
        }}
        className="fixed bottom-24 left-4 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center text-3xl leading-none active:scale-95"
        aria-label="快速添加药物"
        title="快速添加药物"
      >
        +
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
