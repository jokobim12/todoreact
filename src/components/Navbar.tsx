import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Beranda', icon: LayoutDashboard },
    { path: '/tasks', label: 'Daftar Tugas', icon: ListTodo },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50">
      <div className="max-w-3xl mx-auto flex justify-around md:justify-center md:gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-6 py-2 rounded-lg transition-colors",
                isActive 
                    ? "text-blue-600 bg-blue-50 font-medium" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] md:text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
