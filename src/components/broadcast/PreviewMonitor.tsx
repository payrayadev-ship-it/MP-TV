import React from 'react';
import { Layers, ArrowRightLeft } from 'lucide-react';
import { useBroadcast } from '../../context/BroadcastContext';

export const PreviewMonitor: React.FC = () => {
  const { obsSettings, changeScene } = useBroadcast();

  const previewSceneName = obsSettings?.previewScene || 'Kertajati Live Stream Cam';

  return (
    <div className="bg-black border-2 border-green-600 rounded-lg overflow-hidden shadow-2xl flex flex-col">
      {/* Monitor Header */}
      <div className="bg-[#111111] px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
            PREVIEW STAGE
          </span>
        </div>
        <span className="text-[10px] font-mono bg-green-950 text-green-300 border border-green-500/30 px-1.5 py-0.5 rounded font-bold uppercase">
          {previewSceneName}
        </span>
      </div>

      {/* Screen Frame */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
        <video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          loop
          muted
          autoPlay
          playsInline
          className="w-full h-full object-cover filter brightness-90 contrast-105"
        />

        {/* Transition Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => changeScene(previewSceneName)}
            className="flex items-center gap-2 bg-[#D50000] hover:bg-red-700 text-white font-bold px-3.5 py-1.5 rounded text-xs shadow-xl transition active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>CUT TO PROGRAM</span>
          </button>
        </div>

        <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white/60 border border-white/10">
          Ready for Transition
        </div>
      </div>
    </div>
  );
};
