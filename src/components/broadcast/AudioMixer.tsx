import React, { useState } from 'react';
import { Volume2, VolumeX, SlidersHorizontal } from 'lucide-react';
import { useBroadcast } from '../../context/BroadcastContext';

export const AudioMixer: React.FC = () => {
  const { audioChannels } = useBroadcast();
  const [channels, setChannels] = useState(audioChannels || []);

  const handleVolumeChange = (id: string, vol: number) => {
    setChannels((prev) =>
      (prev || []).map((c) => (c.id === id ? { ...c, volume: vol } : c))
    );
  };

  const handleMuteToggle = (id: string) => {
    setChannels((prev) =>
      (prev || []).map((c) => (c.id === id ? { ...c, muted: !c.muted } : c))
    );
  };

  return (
    <div className="bg-[#141414] border border-white/5 rounded-lg p-3.5 shadow-xl">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#D50000]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            AUDIO MIXER CONTROL ROOM
          </h3>
        </div>
        <span className="text-[10px] text-white/40 font-mono">24-Bit / 48kHz Digital Audio</span>
      </div>

      {/* Audio Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {(channels || []).map((ch) => (
          <div
            key={ch.id}
            className={`p-2.5 rounded-lg border transition-colors flex flex-col justify-between ${
              ch.muted
                ? 'bg-black/40 border-white/5 text-white/40'
                : 'bg-black/80 border-white/10 text-white'
            }`}
          >
            {/* Title & Mute */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold truncate max-w-[100px]" title={ch.name}>
                {ch.name}
              </span>
              <button
                onClick={() => handleMuteToggle(ch.id)}
                className={`p-1 rounded text-xs transition ${
                  ch.muted
                    ? 'bg-red-950 text-red-500 border border-red-800/50'
                    : 'bg-white/10 text-white/80 hover:text-white'
                }`}
              >
                {ch.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* VU Meter Visualizer */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 bg-black h-3 rounded overflow-hidden flex gap-0.5 p-0.5 border border-white/10">
                {Array.from({ length: 12 }).map((_, i) => {
                  const level = (i + 1) * 8;
                  const isActive = !ch.muted && ch.volume >= level;
                  let colorClass = 'bg-emerald-500';
                  if (i >= 8) colorClass = 'bg-yellow-500';
                  if (i >= 10) colorClass = 'bg-[#D50000]';

                  return (
                    <div
                      key={i}
                      className={`flex-1 h-full rounded-xs transition-opacity ${
                        isActive ? colorClass : 'bg-white/5 opacity-20'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] font-mono text-white/60 w-8 text-right">
                {ch.muted ? 'MUTE' : `${ch.volume}%`}
              </span>
            </div>

            {/* Volume Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={ch.muted ? 0 : ch.volume}
              onChange={(e) => handleVolumeChange(ch.id, Number(e.target.value))}
              disabled={ch.muted}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D50000]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
