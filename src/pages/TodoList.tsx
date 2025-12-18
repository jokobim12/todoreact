import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodoStore } from '../store/useStore';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Filter, Trash2, FileDown } from 'lucide-react';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type FilterType = 'all' | 'active' | 'completed';

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, deleteAll } = useTodoStore();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Sort by created time (newest first)
  filteredTodos.sort((a, b) => b.createdAt - a.createdAt);

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

    const tableData = filteredTodos.map((todo) => [
        todo.title,
        todo.description || '-',
        todo.completed ? 'Selesai' : 'Belum Selesai',
        new Date(todo.createdAt).toLocaleDateString('id-ID')
    ]);

    autoTable(doc, {
        head: [['Judul Tugas', 'Deskripsi', 'Status', 'Tanggal Dibuat']],
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
                <button 
                    onClick={handleDeleteAll}
                    className="p-2 border border-slate-200 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Hapus Semua"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
                </>
            )}
           <div className="relative group">
               <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors">
                  <Filter className="w-5 h-5" />
               </button>
               {/* Simple Dropdown for filter */}
               <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 p-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top-right z-30">
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
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
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
