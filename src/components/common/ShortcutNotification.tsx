import React from 'react';
import {
  Play,
  Square,
  AlertTriangle,
  Keyboard,
  X,
  Radio,
  Tv,
  CheckCircle2,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { ShortcutToast, ShortcutItem } from '../../hooks/useKeyboardShortcuts';
import { useBroadcast } from '../../context/BroadcastContext';

interface ShortcutNotificationProps {
  toast: ShortcutToast | null;
  onCloseToast: () => void;
  isHelpOpen: boolean;
  onCloseHelp: () => void;
  shortcuts: ShortcutItem[];
}

export const ShortcutNotification: React.FC<ShortcutNotificationProps> = ({
  toast,
  onCloseToast,
  isHelpOpen,
  onCloseHelp,
  shortcuts,
}) => {
  const { toggleStream, emergencyStop, obsSettings } = useBroadcast();

  return (
    <>
      {/* 1. FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-16 right-4 z-[9999] max-w-md w-full animate-bounce-in select-none">
          <div
            className={`p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all ${
              toast.type === 'emergency'
                ? 'bg-red-950/95 border-red-500 text-white shadow-red-900/80 animate-pulse'
                : toast.type === 'start'
                ? 'bg-emerald-950/95 border-emerald-500 text-white shadow-emerald-900/80'
                : toast.type === 'stop'
                ? 'bg-amber-950/95 border-amber-500 text-white shadow-amber-900/80'
                : 'bg-zinc-900/95 border-zinc-700 text-white shadow-zinc-950/80'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    toast.type === 'emergency'
                      ? 'bg-red-600 text-white'
                      : toast.type === 'start'
                      ? 'bg-emerald-600 text-white'
                      : toast.type === 'stop'
                      ? 'bg-amber-600 text-white'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {toast.type === 'emergency' ? (
                    <ShieldAlert className="w-6 h-6 animate-spin" />
                  ) : toast.type === 'start' ? (
                    <Play className="w-6 h-6 fill-current" />
                  ) : toast.type === 'stop' ? (
                    <Square className="w-6 h-6 fill-current" />
                  ) : (
                    <Info className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs uppercase tracking-widest">
                      {toast.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-white/80">
                      {toast.keyCombo}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 font-medium mt-1 leading-snug">
                    {toast.message}
                  </p>
                  <div className="text-[10px] text-white/50 font-mono mt-1">
                    Waktu eksekusi: {toast.timestamp} WIB
                  </div>
                </div>
              </div>

              <button
                onClick={onCloseToast}
                className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. KEYBOARD SHORTCUTS GUIDE MODAL */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/20 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#111111] px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D50000] rounded-lg text-white">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
                    PANDUAN KEYBOARD SHORTCUT OPERATOR
                  </h2>
                  <p className="text-xs text-white/60">
                    Sistem Kontrol Pintar Siaran Majalengka Post TV
                  </p>
                </div>
              </div>

              <button
                onClick={onCloseHelp}
                className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar text-xs">
              {/* Active Stream Status Banner inside modal */}
              <div className="flex items-center justify-between p-3 bg-black/60 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      obsSettings?.isStreaming ? 'bg-red-500 animate-ping' : 'bg-zinc-600'
                    }`}
                  />
                  <span className="font-bold text-white uppercase tracking-wider">
                    Status Siaran Saat Ini:
                  </span>
                  <span
                    className={`font-black text-xs px-2 py-0.5 rounded uppercase ${
                      obsSettings?.isStreaming ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {obsSettings?.isStreaming ? 'ON AIR (STREAMING)' : 'STANDBY / OFF AIR'}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-white/50">
                  OBS Status: {obsSettings?.connected ? 'CONNECTED' : 'DISCONNECTED'}
                </div>
              </div>

              {/* Shortcuts Table */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                  Daftar Kombinasi Tombol Pintar
                </div>

                <div className="space-y-2">
                  {shortcuts.map((sc) => {
                    return (
                      <div
                        key={sc.id}
                        className="p-3 bg-black/40 border border-white/5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white">{sc.name}</span>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                sc.category === 'Emergency'
                                  ? 'bg-red-950 text-red-400 border border-red-800/60'
                                  : sc.category === 'Stream'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {sc.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/60">{sc.description}</p>
                        </div>

                        {/* Quick Trigger Button & Key Combo Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2.5 py-1 bg-[#111111] border border-white/10 rounded font-mono font-bold text-red-400 text-[11px] shadow-inner">
                            {sc.keyCombo}
                          </span>

                          {sc.actionType === 'start' && (
                            <button
                              onClick={() => {
                                toggleStream(true);
                                onCloseHelp();
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] flex items-center gap-1 transition"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Test</span>
                            </button>
                          )}

                          {sc.actionType === 'stop' && (
                            <button
                              onClick={() => {
                                toggleStream(false);
                                onCloseHelp();
                              }}
                              className="px-2.5 py-1 bg-[#D50000] hover:bg-red-700 text-white font-bold rounded text-[11px] flex items-center gap-1 transition"
                            >
                              <Square className="w-3 h-3 fill-current" />
                              <span>Test</span>
                            </button>
                          )}

                          {sc.actionType === 'emergency' && (
                            <button
                              onClick={() => {
                                emergencyStop();
                                onCloseHelp();
                              }}
                              className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white font-black rounded text-[11px] flex items-center gap-1 transition animate-pulse"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>Emergency</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Note / Instructions */}
              <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg text-white/70 text-[11px] space-y-1">
                <div className="font-bold text-red-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Petunjuk Keamanan Operator:</span>
                </div>
                <p>
                  1. Shortcut global bekerja di seluruh tampilan aplikasi.
                  <br />
                  2. Saat mengetik dalam form (misal: input judul berita/running text), shortcut tidak akan terabaikan secara tidak sengaja.
                  <br />
                  3. Tombol <strong>Emergency Stop (Ctrl+Shift+E / F12)</strong> akan langsung mematikan stream dan mengalihkan scene ke Standby secara langsung.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#111111] px-5 py-3 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/40 font-mono text-[10px]">
                Tekan [Shift + ?] kapan saja untuk membuka menu ini
              </span>
              <button
                onClick={onCloseHelp}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
