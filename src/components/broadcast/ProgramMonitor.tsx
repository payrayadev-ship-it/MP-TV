import React, { useRef, useEffect } from 'react';
import { Tv, Radio, AlertCircle } from 'lucide-react';
import { useBroadcast } from '../../context/BroadcastContext';

export const ProgramMonitor: React.FC = () => {
  const { dashboard, obsSettings, runningTexts } = useBroadcast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeRunningText = runningTexts?.find((rt) => rt.active) || runningTexts?.[0];
  const isBreaking = dashboard?.activeBreakingNews;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play policy catch
      });
    }
  }, [dashboard?.currentScene]);

  return (
    <div className="bg-black border-2 border-[#D50000] rounded-lg overflow-hidden shadow-2xl shadow-red-900/10 flex flex-col">
      {/* Monitor Header */}
      <div className="bg-[#111111] px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
            PROGRAM OUTPUT (LIVE ON AIR)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
          <span className="bg-[#D50000] text-white px-1.5 py-0.5 rounded font-bold uppercase">
            {obsSettings?.currentScene || 'Studio Utama'}
          </span>
          <span>3840x2160 @ 60FPS</span>
        </div>
      </div>

      {/* Screen Frame */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
        {/* Simulated Video Stream Player */}
        <video
          ref={videoRef}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          loop
          muted
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Top-Right Watermark Logo */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5">
          <Tv className="w-3.5 h-3.5 text-[#D50000]" />
          <span className="text-[10px] font-black tracking-widest text-white uppercase">
            MPTV <span className="text-red-500">24H</span>
          </span>
        </div>

        {/* Top-Left Live Badge */}
        <div className="absolute top-3 left-3 bg-[#D50000] text-white font-black text-[10px] px-2 py-0.5 rounded tracking-widest uppercase flex items-center gap-1 shadow-md">
          <Radio className="w-3 h-3 animate-spin" />
          <span>LIVE</span>
        </div>

        {/* BREAKING NEWS OVERLAY */}
        {isBreaking && (
          <div className="absolute inset-x-0 top-12 bg-red-700 text-white p-2.5 shadow-2xl border-y-2 border-yellow-400 animate-pulse flex items-center gap-2 z-30">
            <div className="bg-yellow-400 text-black px-1.5 py-0.5 rounded font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1 shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>BREAKING NEWS</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap text-xs font-bold tracking-wide">
              {isBreaking.title}: {isBreaking.content}
            </div>
          </div>
        )}

        {/* RUNNING TEXT TICKER BOTTOM */}
        {activeRunningText && (
          <div className="absolute inset-x-0 bottom-0 bg-[#D50000] text-white py-1 px-3 border-t border-yellow-400 flex items-center z-20 shadow-2xl font-bold">
            <div className="bg-black text-yellow-400 text-[9px] uppercase font-black px-1.5 py-0.5 rounded mr-2 shrink-0 tracking-wider">
              MAJALENGKA POST
            </div>
            <div className="overflow-hidden whitespace-nowrap w-full">
              <div className="inline-block animate-marquee tracking-wide text-[11px]">
                {activeRunningText.text}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="h-8 bg-black/80 flex items-center justify-between px-3 border-t border-white/10 text-[10px] font-mono text-[#D50000]">
        <div className="flex items-center gap-2 truncate text-white/80">
          <span className="text-white/40">NOW PLAYING:</span>
          <span className="font-bold truncate">{dashboard?.currentVideoTitle || 'Majalengka Bulletin 24H'}</span>
        </div>
        <div className="shrink-0 font-bold">
          SISA: <span className="text-red-400">{dashboard?.videoCountdownSec || 0}s</span>
        </div>
      </div>
    </div>
  );
};
