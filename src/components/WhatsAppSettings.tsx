import { useState } from 'react';
import { useTodoStore } from '../store/useStore';
import { Settings, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WhatsAppSettings() {
  const { settings, updateSettings } = useTodoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [fonnteToken, setFonnteToken] = useState(settings.fonnteToken);
  const [targetPhone, setTargetPhone] = useState(settings.targetPhone);

  const handleSave = () => {
    updateSettings({ fonnteToken, targetPhone });
    setIsOpen(false);
    alert('Pengaturan disimpan!');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-3 bg-white border border-slate-200 rounded-full shadow-lg text-slate-500 hover:text-emerald-600 hover:scale-110 transition-all z-40"
        title="Pengaturan WhatsApp"
      >
        <Settings className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-emerald-50">
                <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                  <span className="text-xl">💬</span> Integrasi WhatsApp
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-emerald-100 text-emerald-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Token Fonnte</label>
                  <input
                    type="text"
                    value={fonnteToken}
                    onChange={(e) => setFonnteToken(e.target.value)}
                    placeholder="Masukkan token API Fonnte..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-400">Dapatkan token di <a href="https://fonnte.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">fonnte.com</a></p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nomor WhatsApp Tujuan</label>
                  <input
                    type="text"
                    value={targetPhone}
                    onChange={(e) => setTargetPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-400">Nomor yang akan menerima pengingat.</p>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleSave}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Save className="w-5 h-5" />
                    Simpan Pengaturan
                  </button>
                  
                  {settings.fonnteToken && settings.targetPhone && (
                      <button
                        onClick={async () => {
                            const { sendWhatsApp } = await import('../services/reminderService');
                            const success = await sendWhatsApp(targetPhone, "*Test Koneksi*\n\nHalo! Jika Anda menerima pesan ini, berarti integrasi WhatsApp Todo App berhasil.\n\n_Dikirim dari Todo App Premium_", fonnteToken);
                            if (success) {
                                alert("Berhasil! Pesan terkirim. Cek WhatsApp Anda.");
                            } else {
                                alert("Gagal mengirim. Cek console browser untuk detail error (F12). Kemungkinan token salah atau masalah koneksi (CORS).");
                            }
                        }}
                        className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
                      >
                         Kirim Pesan Test
                      </button>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
                Peringatan hanya dikirim saat aplikasi ini dibuka di browser.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
