import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit3, Eye, CheckCircle2, Play } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';
import { ObsScene } from '../types';

export const SceneManagerView: React.FC = () => {
  const { scenes, obsSettings, changeScene } = useBroadcast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');
  const [newSceneThumb, setNewSceneThumb] = useState('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400');

  const handleCreateScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSceneName) return;
    const newSc: ObsScene = {
      id: `sc-${Date.now()}`,
      name: newSceneName,
      thumbnail: newSceneThumb,
      isProgram: false,
      isPreview: false,
      sources: [],
    };
    scenes.push(newSc);
    setNewSceneName('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#D50000]" />
            <span>OBS SCENE MANAGER</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Kelola Daftar Studio Scene, Thumbnail Preview & Pindah Siaran 1-Klik
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-[#D50000] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-lg shadow-red-950/60 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH SCENE BARU</span>
        </button>
      </div>

      {/* Scenes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(scenes || []).map((scene) => {
          const isProgram = scene.name === obsSettings?.currentScene;
          return (
            <div
              key={scene.id}
              className={`bg-zinc-950 rounded-xl overflow-hidden border transition-all hover:border-zinc-700 group flex flex-col justify-between ${
                isProgram ? 'border-red-600 shadow-xl shadow-red-950/40 ring-2 ring-red-600/30' : 'border-zinc-800'
              }`}
            >
              <div>
                {/* Thumbnail Preview Frame */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={scene.thumbnail}
                    alt={scene.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isProgram && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded tracking-widest uppercase shadow">
                      PROGRAM ON AIR
                    </div>
                  )}

                  {/* Hover Quick Trigger */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => changeScene(scene.name)}
                      className="flex items-center space-x-1.5 bg-[#D50000] hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded text-xs shadow-lg"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PINDAH SCENE</span>
                    </button>
                  </div>
                </div>

                {/* Scene Details */}
                <div className="p-3 space-y-1">
                  <h3 className="font-bold text-sm text-white truncate">{scene.name}</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {scene.sources?.length || 0} Total Sources Connected
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 pt-0 flex justify-between items-center text-xs border-t border-zinc-900 mt-2">
                <button
                  onClick={() => changeScene(scene.name)}
                  className={`font-bold transition ${
                    isProgram ? 'text-red-400 font-extrabold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isProgram ? '✔ ON AIR' : 'Klik Switch Scene'}
                </button>
                <div className="flex space-x-2">
                  <button className="p-1 text-zinc-400 hover:text-white">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Scene Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-xl p-5 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Tambah Scene OBS Baru
            </h2>
            <form onSubmit={handleCreateScene} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Nama Scene OBS</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Studio B - Talkshow"
                  value={newSceneName}
                  onChange={(e) => setNewSceneName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Thumbnail Preview URL</label>
                <input
                  type="url"
                  value={newSceneThumb}
                  onChange={(e) => setNewSceneThumb(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D50000] hover:bg-red-700 text-white rounded font-bold"
                >
                  Simpan Scene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
