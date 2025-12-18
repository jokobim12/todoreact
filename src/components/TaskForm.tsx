import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskFormProps {
  onAdd: (title: string, description?: string, deadline?: number) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const deadlineTimestamp = deadline ? new Date(deadline).getTime() : undefined;
      onAdd(title, description.trim() || undefined, deadlineTimestamp);
      setTitle('');
      setDescription('');
      setDeadline('');
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 relative">
      <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-md border-blue-200 ring-2 ring-blue-50' : ''}`}>
        <div className="flex gap-2 p-1">
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Tulis tugas baru..."
            className="flex-1 bg-transparent border-0 px-4 py-3 text-sm focus:ring-0 focus:outline-none placeholder:text-slate-400"
            />
            <button
            type="submit"
            disabled={!title.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors m-1"
            >
            <Plus className="w-5 h-5" />
            </button>
        </div>
        
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                >
                    <div className="px-5 pb-3 pt-0 border-t border-slate-100 flex flex-col gap-2">
                         <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tambahkan deskripsi (opsional)..."
                            className="w-full text-xs text-slate-600 focus:outline-none resize-none bg-transparent pt-2"
                            rows={2}
                         />
                         <div className="flex items-center gap-2 border-t border-slate-50 pt-2">
                            <span className="text-xs text-slate-400">Deadline:</span>
                            <input 
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-600 focus:outline-none focus:border-blue-400"
                            />
                         </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
      {isExpanded && (
        <div 
            className="fixed inset-0 z-[-1]" 
            onClick={() => {
                if (!title && !description && !deadline) setIsExpanded(false);
            }} 
        />
      )}
    </form>
  );
}
