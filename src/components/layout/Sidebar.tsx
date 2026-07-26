import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Sliders,
  Layers,
  ListMusic,
  Film,
  Calendar,
  Zap,
  AlignLeft,
  Megaphone,
  Youtube,
  Bot,
  CloudSun,
  BarChart3,
  Users,
  Settings,
  Database,
  ChevronRight,
  Tv,
} from 'lucide-react';
import { useBroadcast } from '../../context/BroadcastContext';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'livestreaming', label: 'Live Streaming', icon: Radio },
  { id: 'obscontroller', label: 'OBS Controller', icon: Sliders },
  { id: 'scenemanager', label: 'Scene Manager', icon: Layers },
  { id: 'playlist', label: 'Playlist', icon: ListMusic },
  { id: 'videomanager', label: 'Video Manager', icon: Film },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'epg', label: 'EPG Guide', icon: Tv },
  { id: 'breakingnews', label: 'Breaking News', icon: Zap },
  { id: 'runningtext', label: 'Running Text', icon: AlignLeft },
  { id: 'advertisement', label: 'Advertisement', icon: Megaphone },
  { id: 'youtubelive', label: 'YouTube Live', icon: Youtube },
  { id: 'aipresenter', label: 'AI Presenter', icon: Bot },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'supabase', label: 'Supabase DB', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { dashboard, obsSettings } = useBroadcast();

  return (
    <aside className="w-60 bg-[#0d0d0d] border-r border-white/10 flex flex-col justify-between shrink-0 h-[calc(100vh-48px)] sticky top-12 select-none">
      {/* Navigation Menu */}
      <div className="p-3 overflow-y-auto space-y-1 custom-scrollbar">
        <div className="px-3 py-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
          Studio Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors group ${
                isActive
                  ? 'bg-[#D50000] text-white shadow-lg shadow-red-900/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white' : 'text-white/40 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
            </button>
          );
        })}
      </div>

      {/* Footer System Telemetry */}
      <div className="p-3 border-t border-white/10 bg-[#141414] text-[10px] font-mono space-y-2">
        <div className="flex justify-between items-center text-white/60">
          <span>CPU USAGE</span>
          <span className="font-bold text-white">{dashboard?.systemMetrics.cpuPct ?? obsSettings?.cpuUsage ?? 0}%</span>
        </div>
        <div className="w-full bg-black h-1 rounded-full overflow-hidden">
          <div
            className="bg-[#D50000] h-full transition-all duration-300"
            style={{ width: `${dashboard?.systemMetrics.cpuPct ?? obsSettings?.cpuUsage ?? 0}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-white/60 pt-1">
          <span>RAM MEMORY</span>
          <span className="font-bold text-white">{dashboard?.systemMetrics.ramPct ?? obsSettings?.memoryUsage ?? 0}%</span>
        </div>
        <div className="w-full bg-black h-1 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${dashboard?.systemMetrics.ramPct ?? obsSettings?.memoryUsage ?? 0}%` }}
          />
        </div>

        <div className="pt-2 border-t border-white/5 flex justify-between text-[10px] text-white/40">
          <span>NVENC 4K</span>
          <span className="text-emerald-400 font-bold">60 FPS</span>
        </div>
      </div>
    </aside>
  );
};
