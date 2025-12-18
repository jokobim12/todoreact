import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodoStore } from '../store/useStore';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Filter, Trash2, FileDown, ArrowUpDown } from 'lucide-react';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'smart' | 'newest' | 'oldest';

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, deleteAll } = useTodoStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('smart');

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityWeight = (p: string | undefined) => {
      if (p === 'high') return 3;
      if (p === 'medium') return 2;
      return 1;
  };

  const sortedTodos = [...filteredTodos].sort((a, b) => {
      if (sort === 'newest') return b.createdAt - a.createdAt;
      if (sort === 'oldest') return a.createdAt - b.createdAt;
      
      // Smart Sorting
      // 1. Completed tasks go to bottom
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      // 2. Deadlines
      const now = Date.now();
      const aDeadline = a.deadline || Infinity;
      const bDeadline = b.deadline || Infinity;
      
      // If deadline is passed (overdue), it's highest priority
      const aOverdue = a.deadline && a.deadline < now;
      const bOverdue = b.deadline && b.deadline < now;
      
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      // If both overdue, sort by closest deadline
      if (aOverdue && bOverdue) return a.deadline! - b.deadline!;

      // 3. Just Priority
      const aWeight = getPriorityWeight(a.priority);
      const bWeight = getPriorityWeight(b.priority);
      if (aWeight !== bWeight) return bWeight - aWeight;

      // 4. Upcoming Deadlines (within 24h)
      if (a.deadline !== b.deadline) return aDeadline - bDeadline;

      // 5. Created Date
      return b.createdAt - a.createdAt;
  });

  const handleDeleteAll = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua tugas? Tindakan ini tidak bisa dibatalkan.')) {
        deleteAll();
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(18);
    doc.text("Laporan Daftar Tugas", 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);

    const tableData = sortedTodos.map((todo) => [
        todo.title,
        todo.priority ? todo.priority.toUpperCase() : '-',
        todo.description || '-',
        todo.completed ? 'Selesai' : 'Belum Selesai',
        new Date(todo.createdAt).toLocaleDateString('id-ID')
    ]);

    autoTable(doc, {
        head: [['Judul Tugas', 'Prioritas', 'Deskripsi', 'Status', 'Tanggal Dibuat']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] }, // Blue-600
        styles: { fontSize: 9 }
    });

    doc.save('daftar-tugas.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Tugas</h1>
          <p className="text-sm text-slate-400">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="flex items-center gap-2">
            {todos.length > 0 && (
                <>
                <button 
                    onClick={handleExportPDF}
                    className="p-2 border border-slate-200 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                    title="Ekspor ke PDF"
                >
                    <FileDown className="w-5 h-5" />
                </button>
                <div className="relative group z-20">
                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors">
                        <ArrowUpDown className="w-5 h-5" />
                    </button>
                     <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 p-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top-right">
                        {(['smart', 'newest', 'oldest'] as SortType[]).map((s) => (
                            <button
                                key={s}
                                onClick={() => setSort(s)}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-sm capitalize",
                                    sort === s ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {s === 'smart' ? 'Prioritas (Cerdas)' : s === 'newest' ? 'Terbaru' : 'Terlama'}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={handleDeleteAll}
                    className="p-2 border border-slate-200 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Hapus Semua"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
                </>
            )}
           <div className="relative group z-20">
               <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors">
                  <Filter className="w-5 h-5" />
               </button>
               {/* Simple Dropdown for filter */}
               <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 p-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top-right">
                  {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm capitalize",
                            filter === f ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Selesai'}
                      </button>
                  ))}
               </div>
            </div>
        </div>
      </div>

      <TaskForm onAdd={addTodo} />

      <div className="space-y-3 pb-24 md:pb-0">
        <AnimatePresence mode='popLayout'>
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl opacity-50">📝</span>
               </div>
               <p className="text-slate-500 text-sm">Tidak ada tugas ditemukan</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
