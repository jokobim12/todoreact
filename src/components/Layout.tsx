import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { WhatsAppSettings } from './WhatsAppSettings';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 md:pb-0 md:pt-20">
      <Navbar />
      <WhatsAppSettings />
      <main className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
