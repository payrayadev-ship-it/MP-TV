import React, { useState } from 'react';
import {
  Radio,
  Video,
  Pause,
  Play,
  Square,
  Camera,
  Activity,
  Copy,
  Check,
  Zap,
  Sliders,
  Settings,
} from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';

export const LiveStreamingView: React.FC = () => {
  const { obsSettings, toggleStream } = useBroadcast();
  const [copiedKey, setCopiedKey] = useState(false);
  const [recState, setRecState] = useState<'stopped' | 'recording' | 'paused'>('recording');
  const [vcamState, setVcamState] = useState(true);

  const copyRtmp = () => {
    navigator.clipboard.writeText('rtmp://a.rtmp.youtube.com/live2');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-4 text-white">
      {/* Title */}
      <div className="flex justify-between items-center bg-[#141414] p-3.5 rounded-lg border border-white/10">
        <div>
          <h1 className="text-sm md:text-base font-extrabold uppercase tracking-widest flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#D50000]" />
            <span>LIVE STREAMING CONTROL CENTER</span>
          </h1>
          <p className="text-[11px] text-white/60 mt-0.5">
            Pengaturan Siaran Langsung OBS Studio & Integrasi YouTube Live RTMP
          </p>
        </div>

        {/* Master Live Indicator Badge */}
        {obsSettings?.isStreaming ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D50000] border border-red-500 rounded text-white font-bold text-xs shadow-md">
            <Radio className="w-3.5 h-3.5 text-white animate-spin" />
            <span>SIARAN LIVE SEDANG BERLANGSUNG</span>
          </div>
        ) : (
          <div className="px-3 py-1.5 bg-black/60 border border-white/10 text-white/60 font-bold text-xs rounded">
            STANDBY / OFFLINE
          </div>
        )}
      </div>

      {/* Main Broadcast Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Stream & Recording Action Buttons */}
        <div className="space-y-4">
          {/* Stream Switch */}
          <div className="bg-[#141414] border border-white/5 p-4 rounded-lg space-y-3">
            <h2 className="text-xs font-bold uppercase text-white/40 tracking-wider">
              1. Master Live Stream
            </h2>
            {obsSettings?.isStreaming ? (
              <button
                onClick={() => toggleStream(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#D50000] hover:bg-red-700 text-white font-extrabold py-2.5 rounded text-xs transition shadow-lg shadow-red-950/80 active:scale-95"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>STOP STREAMING SIARAN</span>
              </button>
            ) : (
              <button
                onClick={() => toggleStream(true)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded text-xs transition shadow-lg shadow-emerald-950/80 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>MULAI SIARAN LIVE STREAMING</span>
              </button>
            )}
          </div>

          {/* Recording Control */}
          <div className="bg-[#141414] border border-white/5 p-4 rounded-lg space-y-3">
            <h2 className="text-xs font-bold uppercase text-white/40 tracking-wider">
              2. Local Recording Control
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {recState === 'stopped' ? (
                <button
                  onClick={() => setRecState('recording')}
                  className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded text-xs"
                >
                  <Video className="w-3.5 h-3.5 text-red-500" />
                  <span>Start Record</span>
                </button>
              ) : (
                <button
                  onClick={() => setRecState('stopped')}
                  className="flex items-center justify-center gap-1.5 bg-[#D50000] text-white font-bold py-2 rounded text-xs"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop Record</span>
                </button>
              )}

              {recState === 'recording' ? (
                <button
                  onClick={() => setRecState('paused')}
                  className="flex items-center justify-center gap-1.5 bg-amber-950 text-amber-400 border border-amber-800/60 font-bold py-2 rounded text-xs"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Record</span>
                </button>
              ) : (
                <button
                  onClick={() => setRecState('recording')}
                  className="flex items-center justify-center gap-1.5 bg-white/10 text-white/80 font-bold py-2 rounded text-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Record</span>
                </button>
              )}
            </div>
          </div>

          {/* Virtual Camera */}
          <div className="bg-[#141414] border border-white/5 p-4 rounded-lg space-y-3">
            <h2 className="text-xs font-bold uppercase text-white/40 tracking-wider">
              3. Virtual Camera Output
            </h2>
            <button
              onClick={() => setVcamState(!vcamState)}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-bold border transition ${
                vcamState
                  ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                  : 'bg-black/60 border-white/10 text-white/40'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{vcamState ? 'Virtual Camera ACTIVE' : 'Virtual Camera OFF'}</span>
            </button>
          </div>

          {/* Server Stream Encoder Info */}
          <div className="bg-[#141414] border border-white/5 p-4 rounded-lg text-xs font-mono space-y-2">
            <div className="flex justify-between text-white/40">
              <span>Encoder Hardware:</span>
              <span className="text-white font-bold">NVIDIA NVENC H.264</span>
            </div>
            <div className="flex justify-between text-white/40">
              <span>Resolution:</span>
              <span className="text-white font-bold">3840x2160 (4K UHD)</span>
            </div>
            <div className="flex justify-between text-white/40">
              <span>Bitrate Target:</span>
              <span className="text-emerald-400 font-bold">8500 Kbps CBR</span>
            </div>
            <div className="flex justify-between text-white/40">
              <span>Audio Rate:</span>
              <span className="text-white font-bold">320 Kbps AAC-LC</span>
            </div>
          </div>
        </div>

        {/* Center & Right: Live Stream Monitor & RTMP Configuration */}
        <div className="lg:col-span-2 space-y-4">
          {/* Output Monitor Player */}
          <div className="bg-[#141414] border border-white/5 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-xs text-white/40 font-mono">
              <span className="font-bold text-white">OBS Broadcast Live Feed</span>
              <span>Drop Frames: 0 (0.0%)</span>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative border border-white/10">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#D50000] text-white font-black text-[10px] px-2 py-0.5 rounded tracking-widest uppercase">
                RTMP ENCODER PREVIEW
              </div>
            </div>
          </div>

          {/* RTMP Credentials */}
          <div className="bg-[#141414] border border-white/5 p-4 rounded-lg space-y-3">
            <h3 className="text-xs font-bold uppercase text-white/80">
              Pengaturan Server RTMP YouTube Live
            </h3>

            <div className="space-y-2">
              <label className="text-[11px] text-white/40 font-semibold">Server RTMP URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="rtmp://a.rtmp.youtube.com/live2"
                  className="flex-1 bg-black/60 border border-white/10 px-3 py-1.5 rounded text-xs font-mono text-white/80 focus:outline-none"
                />
                <button
                  onClick={copyRtmp}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-white/40 font-semibold">Stream Key</label>
              <input
                type="password"
                readOnly
                value="mjp-tv-live-key-9923847293847"
                className="w-full bg-black/60 border border-white/10 px-3 py-1.5 rounded text-xs font-mono text-white/80 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
