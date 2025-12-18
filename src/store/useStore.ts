import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ReminderSettings {
  fonnteToken: string;
  targetPhone: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  deadline?: number;
  priority: 'high' | 'medium' | 'low';
  remindersSent: Record<string, boolean>; // e.g., { '2d': true, '1h': false }
  completed: boolean;
  createdAt: number;
}

interface TodoState {
  todos: Todo[];
  settings: ReminderSettings;
  addTodo: (title: string, description?: string, deadline?: number, priority?: 'high' | 'medium' | 'low') => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newTitle: string, newDescription?: string, newDeadline?: number, newPriority?: 'high' | 'medium' | 'low') => void;
  deleteAll: () => void;
  updateSettings: (settings: ReminderSettings) => void;
  markReminderSent: (todoId: string, reminderKey: string) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      settings: {
        fonnteToken: '',
        targetPhone: '',
      },
      addTodo: (title: string, description?: string, deadline?: number, priority: 'high' | 'medium' | 'low' = 'medium') => set((state: TodoState) => ({
        todos: [
          {
            id: crypto.randomUUID(),
            title,
            description,
            deadline,
            priority,
            remindersSent: {},
            completed: false,
            createdAt: Date.now(),
          },
          ...state.todos,
        ],
      })),
      toggleTodo: (id: string) => set((state: TodoState) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      })),
      deleteTodo: (id: string) => set((state: TodoState) => ({
        todos: state.todos.filter((t) => t.id !== id),
      })),
      editTodo: (id: string, newTitle: string, newDescription?: string, newDeadline?: number, newPriority?: 'high' | 'medium' | 'low') => set((state: TodoState) => ({
        todos: state.todos.map((t) =>
            t.id === id ? { 
                ...t, 
                title: newTitle, 
                description: newDescription, 
                deadline: newDeadline,
                priority: newPriority || t.priority || 'medium',
                remindersSent: newDeadline !== t.deadline ? {} : t.remindersSent 
            } : t
        )
      })),
      deleteAll: () => set({ todos: [] }),
      updateSettings: (newSettings: ReminderSettings) => set({ settings: newSettings }),
      markReminderSent: (todoId: string, reminderKey: string) => set((state: TodoState) => ({
          todos: state.todos.map((t) => 
            t.id === todoId ? { ...t, remindersSent: { ...t.remindersSent, [reminderKey]: true } } : t
          )
      }))
    }),
    {
      name: 'todo-storage',
    }
  )
)
