import React, { useEffect, useState } from 'react';
import {
  Radio,
  Tv,
  Wifi,
  WifiOff,
  Square,
  Play,
  Clock,
  Shield,
  Activity,
  Keyboard,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBroadcast } from '../../context/BroadcastContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenHelp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHelp }) => {
  const { currentUser, switchRole } = useAuth();
  const { obsSettings, toggleStream, emergencyStop } = useBroadcast();
  const [timeWib, setTimeWib] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // WIB = UTC+7
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      const timeStr = new Intl.DateTimeFormat('id-ID', options).format(now);
      const dateStr = new Intl.DateTimeFormat('id-ID', dateOptions).format(now);
      setTimeWib(`${dateStr} | ${timeStr} WIB`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const roles: UserRole[] = ['Super Admin', 'Admin TV', 'Editor', 'Reporter', 'Operator'];

  return (
    <header className="h-12 border-b border-white/10 bg-[#111111] flex items-center justify-between px-4 sticky top-0 z-50 select-none text-white">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="bg-[#D50000] px-2.5 py-1 rounded font-bold text-xs tracking-tighter text-white shadow-lg shadow-red-950/40 flex items-center gap-1.5">
          <Tv className="w-3.5 h-3.5" />
          <span>MPTV</span>
        </div>
        <h1 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-white/80 truncate">
          Majalengka Post TV Automation
        </h1>
      </div>

      {/* Stream Status & Clock */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              obsSettings?.isStreaming ? 'bg-red-600 animate-pulse' : 'bg-zinc-600'
            }`}
          />
          <span className="text-[10px] font-mono text-red-500 uppercase font-bold hidden md:inline">
            {obsSettings?.isStreaming ? 'Live Stream: 1080p60' : 'Stream Standby'}
          </span>
        </div>

        {/* OBS WebSocket Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono">
          {obsSettings?.connected ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <Wifi className="w-3 h-3" /> OBS CONNECTED
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400">
              <WifiOff className="w-3 h-3" /> OBS DISCONNECTED
            </span>
          )}
        </div>

        <div className="h-4 w-px bg-white/20 hidden sm:block" />

        {/* Clock */}
        <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest hidden sm:block">
          {timeWib}
        </div>

        {/* Keyboard Shortcuts Helper Button */}
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="hidden sm:flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-white/10 text-white/80 hover:text-white border border-white/10 px-2 py-1 rounded text-[10px] font-mono transition"
            title="Keyboard Shortcuts Guide (Shift + ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-red-500" />
            <span className="font-bold">Shortcuts</span>
            <span className="text-[9px] bg-white/10 px-1 py-0.2 rounded text-white/50">Shift+?</span>
          </button>
        )}

        {/* Emergency Stop Button */}
        <button
          onClick={() => emergencyStop()}
          className="flex items-center gap-1 bg-red-950 hover:bg-red-900 border border-red-600/60 text-red-200 hover:text-white px-2 py-1 rounded text-[10px] font-extrabold uppercase transition active:scale-95 shadow-sm"
          title="Emergency Stop (Ctrl + Shift + E / F12)"
        >
          <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
          <span className="hidden md:inline">EMERGENCY STOP</span>
        </button>

        {/* Stream Toggle Button */}
        {obsSettings?.isStreaming ? (
          <button
            onClick={() => toggleStream(false)}
            className="flex items-center gap-1.5 bg-[#D50000] hover:bg-red-700 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase transition active:scale-95 shadow-md shadow-red-950/50"
            title="Stop Stream (Ctrl + Shift + X / F9)"
          >
            <Square className="w-3 h-3 fill-current" />
            <span className="hidden xs:inline">STOP STREAM</span>
          </button>
        ) : (
          <button
            onClick={() => toggleStream(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase transition active:scale-95 shadow-md shadow-emerald-950/50"
            title="Start Stream (Ctrl + Shift + S / F8)"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden xs:inline">START STREAM</span>
          </button>
        )}

        {/* Role Switcher */}
        <div className="relative flex items-center gap-2 bg-[#141414] border border-white/10 px-2 py-1 rounded">
          <Shield className="w-3.5 h-3.5 text-[#D50000]" />
          <select
            value={currentUser.role}
            onChange={(e) => switchRole(e.target.value as UserRole)}
            className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer pr-1"
          >
            {roles.map((r) => (
              <option key={r} value={r} className="bg-[#111111] text-white">
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

