'use client';

import { AppProvider, useApp } from '../lib/context';
import Header from '../components/header';
import NavBar from '../components/nav-bar';
import DashboardView from '../components/dashboard-view';
import PharmacyView from '../components/pharmacy-view';
import HealthView from '../components/health-view';

function MainContent() {
  const { activeTab } = useApp();

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-slate-50">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'today' && <DashboardView />}
        {activeTab === 'pharmacy' && <PharmacyView />}
        {activeTab === 'health' && <HealthView />}
      </main>
      <NavBar />
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
