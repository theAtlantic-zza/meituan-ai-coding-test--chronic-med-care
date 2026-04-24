import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '慢病用药小管家',
  description: '帮助慢性病患者管理用药计划、智能提醒、药物查询的AI助手',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="h-full bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  );
}
