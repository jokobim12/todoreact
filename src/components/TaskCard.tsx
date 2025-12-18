import { Trash2, Check, Clock, Edit2, Calendar } from 'lucide-react';
import { type Todo } from '../store/useStore';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface TaskCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string, newDescription?: string, newDeadline?: number, newPriority?: 'high' | 'medium' | 'low') => void;
}

export function TaskCard({ todo, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editDeadline, setEditDeadline] = useState(
    todo.deadline 
      ? new Date(todo.deadline - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) 
      : ''
  );
  const [editPriority, setEditPriority] = useState<'high' | 'medium' | 'low'>(todo.priority || 'medium');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
        const deadlineTimestamp = editDeadline ? new Date(editDeadline).getTime() : undefined;
        onEdit(todo.id, editTitle, editDescription.trim() || undefined, deadlineTimestamp, editPriority);
        setIsEditing(false);
    }
  };

  const getDeadlineStatus = (deadline: number) => {
      if (todo.completed) return null;
      const now = Date.now();
      const diff = deadline - now;
      
      if (diff < 0) return { text: 'Terlambat', color: 'text-rose-600 bg-rose-50' };
      if (diff < 3600000) return { text: 'Segera', color: 'text-amber-600 bg-amber-50' }; // 1 hour
      if (diff < 86400000) return { text: 'Hari ini', color: 'text-blue-600 bg-blue-50' }; // 24 hours
      return { 
          text: new Date(deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour:'2-digit', minute:'2-digit' }), 
          color: 'text-slate-500 bg-slate-50' 
      };
  };

  const status = todo.deadline ? getDeadlineStatus(todo.deadline) : null;

  const priorities = [
    { value: 'high', label: 'Penting', color: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200' },
    { value: 'medium', label: 'Sedang', color: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' },
    { value: 'low', label: 'Santai', color: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
  ] as const;

  const priorityConfig = priorities.find(p => p.value === (todo.priority || 'medium')) || priorities[1];

  return (
    <div className={cn(
        "group flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all",
        todo.completed && "bg-slate-50 border-slate-100"
    )}>
        <button
          onClick={() => onToggle(todo.id)}
          className={cn(
            "mt-1 w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-100",
            todo.completed
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-slate-300 text-transparent hover:border-blue-400"
          )}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
             <form onSubmit={handleSubmit} className="w-full space-y-2">
                 <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    autoFocus
                 />
                 <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={2}
                    placeholder="Deskripsi..."
                 />
                 <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">Deadline:</span>
                        <input 
                            type="datetime-local"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            className="text-xs bg-white border border-blue-300 rounded px-2 py-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                     <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">Prioritas:</span>
                         <select 
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as any)}
                            className="text-xs bg-white border border-blue-300 rounded px-2 py-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                         >
                             {priorities.map(p => (
                                 <option key={p.value} value={p.value}>{p.label}</option>
                             ))}
                         </select>
                     </div>
                 </div>
                 <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="text-xs text-slate-500 hover:text-slate-800">Batal</button>
                    <button type="submit" className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Simpan</button>
                 </div>
             </form>
          ) : (
             <div className="flex flex-col">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                             {/* Priority Badge */}
                             {!todo.completed && (
                                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", priorityConfig.color)} title={`Prioritas: ${priorityConfig.label}`} />
                             )}
                            <p className={cn(
                                "text-sm font-medium transition-all break-words",
                                todo.completed ? "text-slate-400 line-through" : "text-slate-700"
                            )}>
                                {todo.title}
                            </p>
                        </div>
                    </div>
                    {status && (
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap", status.color)}>
                            {status.text}
                        </span>
                    )}
                </div>
                {todo.description && (
                   <p className={cn(
                       "text-xs mt-1 whitespace-pre-wrap break-words ml-3.5",
                        todo.completed ? "text-slate-300" : "text-slate-500"
                   )}>
                       {todo.description}
                   </p>
                )}
                 <div className="flex items-center gap-3 mt-1.5 ml-3.5">
                    {/* Timestamp */}
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] text-slate-400">
                            {new Date(todo.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    
                    {/* Deadline info if not showing status badge */}
                    {todo.deadline && !status && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] text-slate-400">
                                {new Date(todo.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    )}
                </div>
            </div>
          )}
        </div>

        {!isEditing && (
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
                onClick={() => {
                    setIsEditing(true);
                    setEditTitle(todo.title);
                    setEditDescription(todo.description || '');
                    setEditDeadline(todo.deadline 
                        ? new Date(todo.deadline - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) 
                        : ''
                    );
                    setEditPriority(todo.priority || 'medium');
                }}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
            >
                <Edit2 className="w-4 h-4" />
            </button>
            <button
                onClick={() => onDelete(todo.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                title="Hapus"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            </div>
        )}
    </div>
  );
}
