import { useTodoStore } from '../store/useStore';
import { CheckCircle2, Circle, ListTodo, ArrowRight, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const todos = useTodoStore((state) => state.todos);
  
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Ringkasan
        </h1>
        <p className="text-slate-500 text-sm">
          Pantau produktivitas harian Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progress Card - Cleaner */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-1 md:col-span-3">
            <div className="flex justify-between items-center mb-4">
                <div>
                     <h2 className="text-lg font-semibold text-slate-800">Progres Harian</h2>
                     <p className="text-sm text-slate-500">{completed} dari {total} tugas selesai</p>
                </div>
                <div className={`text-2xl font-bold ${progress === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {progress}%
                </div>
            </div>
             <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${progress}%` }} 
                />
             </div>
        </div>

        {/* Stat Cards - Simple & Flat */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <div>
                    <span className="text-3xl font-bold text-slate-800 block">{total}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Semua Tugas</span>
                </div>
                 <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <ListTodo className="w-5 h-5" />
                 </div>
            </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
             <div className="flex items-start justify-between">
                <div>
                    <span className="text-3xl font-bold text-slate-800 block">{pending}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Tertunda</span>
                </div>
                 <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                    <Circle className="w-5 h-5" />
                 </div>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
             <div className="flex items-start justify-between">
                <div>
                    <span className="text-3xl font-bold text-slate-800 block">{completed}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Selesai</span>
                </div>
                 <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
            </div>
        </div>
      </div>

      <div>
        <Link 
          to="/tasks" 
          className="group w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-sm flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
             <div className="p-1">
                <PieChart className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-semibold text-sm">Lihat Detail Tugas</h3>
                <p className="text-xs text-blue-100">Kelola dan update status tugasmu</p>
             </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
