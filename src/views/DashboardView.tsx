import React from 'react';
import {
  Activity,
  Tv,
  Wifi,
  HardDrive,
  Cpu,
  Radio,
  Clock,
  Layers,
  ListMusic,
  Film,
  Megaphone,
  AlignLeft,
  AlertTriangle,
  Play,
  Zap,
} from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';
import { ProgramMonitor } from '../components/broadcast/ProgramMonitor';
import { PreviewMonitor } from '../components/broadcast/PreviewMonitor';
import { AudioMixer } from '../components/broadcast/AudioMixer';

export const DashboardView: React.FC = () => {
  const { dashboard, obsSettings, publishBreakingNews } = useBroadcast();

  const handleQuickBreaking = () => {
    publishBreakingNews({
      title: 'BREAKING NEWS: Peringatan Cuaca Ekstrem Jalur Cikijing - Argapura',
      content: 'BMKG Majalengka mengimbau warga & pengguna jalan waspada hujan deras dan angin kencang.',
      priority: 'Emergency',
      durationSeconds: 15,
      autoTriggerObs: true,
    });
  };

  return (
    <div className="space-y-4 p-4 max-w-[1700px] mx-auto text-white">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#141414] border border-white/10 p-3.5 rounded-lg gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-extrabold uppercase tracking-widest text-white">
              CONTROL ROOM TV BROADCAST 24 JAM
            </h1>
            <span className="px-2 py-0.5 text-[10px] bg-[#D50000] text-white rounded font-bold uppercase tracking-wider">
              LIVE STUDIO
            </span>
          </div>
          <p className="text-[11px] text-white/60 mt-0.5">
            Pusat Otomatisasi Siaran Digital Majalengka Post TV Berbasis OBS Studio & Gemini AI
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleQuickBreaking}
            className="flex items-center gap-2 bg-[#D50000] hover:bg-red-700 text-white font-extrabold px-3.5 py-1.5 rounded text-xs shadow-lg shadow-red-950/50 transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
            <span>TRIGGER BREAKING NEWS OVERLAY</span>
          </button>
        </div>
      </div>

      {/* Program & Preview Broadcast Monitors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ProgramMonitor />
        </div>
        <div>
          <PreviewMonitor />
        </div>
      </div>

      {/* Key Broadcast Telemetry Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* OBS Status */}
        <div className="bg-[#141414] border border-white/5 p-3 rounded-lg">
          <div className="flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-wider">
            <span>OBS Status</span>
            <Tv className="w-3.5 h-3.5 text-[#D50000]" />
          </div>
          <div className="text-xs font-bold text-white mt-1.5 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                obsSettings?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="truncate">{obsSettings?.connected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {/* YouTube Status */}
        <div className="bg-[#141414] border border-white/5 p-3 rounded-lg">
          <div className="flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-wider">
            <span>YouTube Live</span>
            <Radio className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="text-xs font-bold text-white mt-1.5 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                dashboard?.youtubeStatus.isLive ? 'bg-red-500 animate-ping' : 'bg-zinc-600'
              }`}
            />
            <span>{dashboard?.youtubeStatus.isLive ? 'LIVE ON AIR' : 'OFF AIR'}</span>
          </div>
        </div>

        {/* Internet Status */}
        <div className="bg-[#141414] border border-white/5 p-3 rounded-lg">
          <div className="flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-wider">
            <span>Network</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-emerald-400 mt-1.5 font-mono">1 Gbps Dedicated</div>
        </div>

        {/* CPU */}
        <div className="bg-[#141414] border border-white/5 p-3 rounded-lg">
          <div className="flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-wider">
            <span>CPU Load</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xs font-bold text-white mt-1.5 font-mono">
            {dashboard?.systemMetrics.cpuPct}%
          </div>
        </div>

        {/* RAM */}
        <div className="bg-[#141414] border border-white/5 p-3 rounded-lg">
          <div className="flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-wider">
            <span>RAM Memory</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xs font-bold text-white mt-1.5 font-mono">
            {dashboard?.systemMetrics.ramPct}%
          </div>
        </div>

        {/* Disk */}
        <div className="bg-[#141414] border border-white/5 p-3 rounded-lg">
          <div className="flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-wider">
            <span>Storage</span>
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xs font-bold text-white mt-1.5 font-mono">482 GB Free</div>
        </div>

        {/* Live Viewers */}
        <div className="bg-[#141414] border border-[#D50000]/30 p-3 rounded-lg">
          <div className="flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-wider">
            <span>Viewers</span>
            <Activity className="w-3.5 h-3.5 text-[#D50000]" />
          </div>
          <div className="text-sm font-extrabold text-[#D50000] mt-1 font-mono">
            {dashboard?.systemMetrics.liveViewersCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Active Program & Playlist Telemetry bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#141414] p-3.5 rounded-lg border border-white/5 text-xs">
        <div className="flex items-center gap-3 border-r border-white/10 pr-3">
          <Layers className="w-4 h-4 text-[#D50000] shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Current Scene</span>
            <p className="font-bold text-white truncate">{dashboard?.currentScene}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-r border-white/10 pr-3">
          <ListMusic className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Current Playlist</span>
            <p className="font-bold text-white truncate">{dashboard?.currentPlaylistName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-r border-white/10 pr-3">
          <Film className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Playing Video</span>
            <p className="font-bold text-white truncate">{dashboard?.currentVideoTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Countdown</span>
            <p className="font-bold text-emerald-400 font-mono text-sm">
              {dashboard?.videoCountdownSec}s
            </p>
          </div>
        </div>
      </div>

      {/* Audio Mixer Control Room */}
      <AudioMixer />

      {/* Footer Running Text Ticker Bar */}
      <div className="h-12 bg-[#111111] rounded-lg border border-white/10 flex items-center px-4 gap-4">
        <div className="bg-[#D50000] px-2 py-1 text-[10px] font-black italic rounded whitespace-nowrap text-white tracking-wider">
          RUNNING TEXT
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-xs text-white/90 font-medium">
            MAJALENGKA POST TV 24 JAM: Menyajikan berita terkini dari wilayah Kabupaten Majalengka & sekitarnya. Pantau jadwal siaran digital dan update breaking news langsung dari studio kontrol.
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-white/60 shrink-0">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> YOUTUBE ONLINE
          </span>
          <span className="flex items-center gap-1 text-[#D50000]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D50000] animate-pulse" /> OBS CONNECTED
          </span>
        </div>
      </div>
    </div>
  );
};
