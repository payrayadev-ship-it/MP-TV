import React, { useState } from 'react';
import {
  Sliders,
  Wifi,
  WifiOff,
  Layers,
  Volume2,
  VolumeX,
  Play,
  Square,
  ArrowRightLeft,
  CheckCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';

export const ObsControllerView: React.FC = () => {
  const { obsSettings, connectObs, scenes, audioChannels, changeScene } = useBroadcast();

  const [host, setHost] = useState(obsSettings?.host || '127.0.0.1');
  const [port, setPort] = useState(obsSettings?.port || 4455);
  const [password, setPassword] = useState(obsSettings?.password || 'majalengkaposttv');
  const [transitionType, setTransitionType] = useState('Cut');
  const [transitionDuration, setTransitionDuration] = useState(300);

  const handleConnect = () => {
    connectObs(host, Number(port), password);
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5 text-white">
      {/* Header & Connection Bar */}
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#D50000]" />
              <span>OBS STUDIO WEBSOCKET CONTROLLER</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Koneksi Langsung & Kendali Siaran OBS Studio via Protocol WebSocket v5
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {obsSettings?.connected ? (
              <span className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-bold">
                <Wifi className="w-3.5 h-3.5" />
                <span>WebSocket Connected</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 px-3 py-1 bg-red-950 text-red-400 border border-red-500/40 rounded-full text-xs font-bold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Disconnected</span>
              </span>
            )}
          </div>
        </div>

        {/* WebSocket Parameters Form */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 text-xs">
          <div>
            <label className="text-zinc-400 font-bold block mb-1">Host IP Address</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded font-mono text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="text-zinc-400 font-bold block mb-1">WebSocket Port</label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded font-mono text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="text-zinc-400 font-bold block mb-1">Password Server</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded font-mono text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleConnect}
              className="flex-1 bg-[#D50000] hover:bg-red-700 text-white font-bold py-1.5 rounded text-xs transition active:scale-95"
            >
              CONNECT OBS
            </button>
            <button
              onClick={handleConnect}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs"
              title="Reconnect"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Scenes List */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-[#D50000]" />
              <span>Daftar Scene OBS ({scenes?.length || 0})</span>
            </h3>
            <span className="text-[10px] text-zinc-500">Klik untuk langsung Pindah</span>
          </div>

          <div className="space-y-2">
            {scenes?.map((sc) => {
              const isCurrent = sc.name === obsSettings?.currentScene;
              return (
                <button
                  key={sc.id}
                  onClick={() => changeScene(sc.name)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-bold transition text-left ${
                    isCurrent
                      ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/50'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={sc.thumbnail}
                      alt={sc.name}
                      className="w-12 h-8 rounded object-cover border border-zinc-700 shrink-0"
                    />
                    <div>
                      <p className="font-bold">{sc.name}</p>
                      <p className="text-[10px] font-mono text-zinc-400">
                        {sc.sources?.length || 0} Sources Connected
                      </p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded uppercase tracking-wider">
                      PROGRAM
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transition & Master Mixer Settings */}
        <div className="space-y-4 lg:col-span-2">
          {/* Transition Selector */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
              <ArrowRightLeft className="w-4 h-4 text-[#D50000]" />
              <span>Scene Transition Config</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">
                  Jenis Transisi (Transition Type)
                </label>
                <select
                  value={transitionType}
                  onChange={(e) => setTransitionType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-xs text-white font-semibold focus:outline-none"
                >
                  <option value="Cut">Cut (Instant)</option>
                  <option value="Fade">Fade (Cross Dissolve)</option>
                  <option value="Swipe">Wipe Slide</option>
                  <option value="Stinger">Stinger Motion Graphic</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <label className="text-zinc-400 font-semibold">Transition Duration</label>
                  <span className="font-mono text-red-400 font-bold">{transitionDuration} ms</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={transitionDuration}
                  onChange={(e) => setTransitionDuration(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded appearance-none cursor-pointer accent-[#D50000]"
                />
              </div>
            </div>
          </div>

          {/* Sources and Inputs Inspector */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Active Scene Sources Inspector</span>
            </h3>

            <div className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800 text-xs font-mono space-y-2">
              <div className="flex justify-between text-zinc-400 font-bold pb-1 border-b border-zinc-800">
                <span>Source Name</span>
                <span>Type</span>
                <span>Status</span>
              </div>
              {(scenes || [])
                .find((s) => s.name === obsSettings?.currentScene)
                ?.sources?.map((src) => (
                  <div key={src.id} className="flex justify-between items-center py-1 border-b border-zinc-900">
                    <span className="text-white font-bold">{src.name}</span>
                    <span className="text-zinc-400 uppercase">{src.type}</span>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
