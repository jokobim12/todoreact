import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';

export function FocusPage() {
  const [mode, setMode] = useState<'focus' | 'rest'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);

  const FOCUS_TIME = 25 * 60;
  const REST_TIME = 5 * 60;

  useEffect(() => {
    let interval: any = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play Alarm
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Simple beep
      audio.play().catch(e => console.log('Audio error:', e));
      
      if (mode === 'focus') {
          alert('Waktu fokus selesai! Saatnya istirahat sebentar.');
          setMode('rest');
          setTimeLeft(REST_TIME);
      } else {
          alert('Istirahat selesai! Kembali fokus yuk.');
          setMode('focus');
          setTimeLeft(FOCUS_TIME);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : REST_TIME);
  };

  const switchMode = (newMode: 'focus' | 'rest') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : REST_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress for circle
  const totalTime = mode === 'focus' ? FOCUS_TIME : REST_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Mode Fokus & Istirahat</h1>
        <p className="text-slate-500 text-sm">Gunakan teknik Pomodoro untuk produktivitas maksimal.</p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => switchMode('focus')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all",
            mode === 'focus' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <BrainCircuit className="w-4 h-4" />
          Fokus (25m)
        </button>
        <button
          onClick={() => switchMode('rest')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all",
            mode === 'rest' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Coffee className="w-4 h-4" />
          Istirahat (5m)
        </button>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* SVG Circle Progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={mode === 'focus' ? '#eff6ff' : '#ecfdf5'}
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={mode === 'focus' ? '#2563eb' : '#059669'}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        <div className="relative z-10 flex flex-col items-center">
             <span className={cn(
                 "text-6xl font-bold font-mono tracking-tighter",
                 mode === 'focus' ? "text-blue-600" : "text-emerald-600"
             )}>
                 {formatTime(timeLeft)}
             </span>
             <span className="text-sm text-slate-400 mt-2 font-medium uppercase tracking-widest">
                 {isActive ? 'Berjalan' : 'Jeda'}
             </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:scale-105 active:scale-95",
            isActive 
                ? "bg-slate-200 text-slate-600" 
                : (mode === 'focus' ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200")
          )}
        >
          {isActive ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 pl-1" fill="currentColor" />}
        </button>
        
        <button
          onClick={resetTimer}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
