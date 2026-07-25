import { useEffect, useState, useCallback } from 'react';
import { useBroadcast } from '../context/BroadcastContext';

export interface ShortcutItem {
  id: string;
  name: string;
  keyCombo: string;
  description: string;
  category: 'Stream' | 'Emergency' | 'System';
  actionType: 'start' | 'stop' | 'emergency' | 'help';
}

export interface ShortcutToast {
  id: number;
  type: 'start' | 'stop' | 'emergency' | 'info';
  title: string;
  message: string;
  keyCombo: string;
  timestamp: string;
}

export const SHORTCUT_DEFINITIONS: ShortcutItem[] = [
  {
    id: 'start-stream',
    name: 'Start Stream',
    keyCombo: 'Ctrl + Shift + S  (or Alt + S / F8)',
    description: 'Memulai siaran live streaming OBS secara instan',
    category: 'Stream',
    actionType: 'start',
  },
  {
    id: 'stop-stream',
    name: 'Stop Stream',
    keyCombo: 'Ctrl + Shift + X  (or Alt + X / F9)',
    description: 'Menghentikan siaran live streaming OBS secara normal',
    category: 'Stream',
    actionType: 'stop',
  },
  {
    id: 'emergency-stop',
    name: 'Emergency Stop',
    keyCombo: 'Ctrl + Shift + E  (or Alt + E / Shift + Esc / F12)',
    description: 'Pemberhentian darurat total siaran & alihkan ke iklan/standby',
    category: 'Emergency',
    actionType: 'emergency',
  },
  {
    id: 'help-shortcuts',
    name: 'Toggle Shortcut Guide',
    keyCombo: 'Shift + ?  (or F1)',
    description: 'Membuka / menutup panduan keyboard shortcut operator',
    category: 'System',
    actionType: 'help',
  },
];

export function useKeyboardShortcuts() {
  const { toggleStream, emergencyStop, obsSettings } = useBroadcast();
  const [toast, setToast] = useState<ShortcutToast | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const showToast = useCallback(
    (type: ShortcutToast['type'], title: string, message: string, keyCombo: string) => {
      const newToast: ShortcutToast = {
        id: Date.now(),
        type,
        title,
        message,
        keyCombo,
        timestamp: new Date().toLocaleTimeString('id-ID'),
      };
      setToast(newToast);

      // Auto dismiss toast after 4 seconds
      setTimeout(() => {
        setToast((prev) => (prev?.id === newToast.id ? null : prev));
      }, 4000);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 1. Guard against typing inside input, textarea, select, contenteditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;

      // --- 1. START STREAM: Ctrl+Shift+S OR Alt+S OR F8 ---
      if ((ctrlOrCmd && shift && key === 'S') || (alt && key === 'S') || e.key === 'F8') {
        e.preventDefault();
        if (obsSettings?.isStreaming) {
          showToast('info', 'STREAM ALREADY ACTIVE', 'Siaran live streaming sudah berjalan.', 'Ctrl+Shift+S');
        } else {
          toggleStream(true);
          showToast(
            'start',
            'START STREAM TRIGGERED',
            'Siaran Live Streaming OBS telah dinyalakan secara global!',
            'Ctrl+Shift+S / F8'
          );
        }
        return;
      }

      // --- 2. STOP STREAM: Ctrl+Shift+X OR Alt+X OR F9 ---
      if ((ctrlOrCmd && shift && key === 'X') || (alt && key === 'X') || e.key === 'F9') {
        e.preventDefault();
        if (!obsSettings?.isStreaming) {
          showToast('info', 'STREAM ALREADY OFF', 'Siaran live streaming dalam kondisi standby.', 'Ctrl+Shift+X');
        } else {
          toggleStream(false);
          showToast(
            'stop',
            'STOP STREAM TRIGGERED',
            'Siaran Live Streaming OBS dihentikan oleh operator.',
            'Ctrl+Shift+X / F9'
          );
        }
        return;
      }

      // --- 3. EMERGENCY STOP: Ctrl+Shift+E OR Alt+E OR Shift+Escape OR F12 ---
      if (
        (ctrlOrCmd && shift && key === 'E') ||
        (alt && key === 'E') ||
        (shift && e.key === 'Escape') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        emergencyStop();
        showToast(
          'emergency',
          '🚨 EMERGENCY STOP EXECUTED!',
          'Siaran dihentikan secara darurat, recording dimatikan, & scene dialihkan ke Standby/Ad Block.',
          'Ctrl+Shift+E / F12'
        );
        return;
      }

      // --- 4. TOGGLE HELP: Shift+? OR F1 ---
      if ((shift && (e.key === '?' || e.key === '/')) || e.key === 'F1') {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
        return;
      }
    },
    [obsSettings?.isStreaming, toggleStream, emergencyStop, showToast]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    toast,
    setToast,
    isHelpOpen,
    setIsHelpOpen,
    shortcuts: SHORTCUT_DEFINITIONS,
  };
}
