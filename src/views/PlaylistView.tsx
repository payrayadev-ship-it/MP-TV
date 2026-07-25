import React, { useState } from 'react';
import {
  ListMusic,
  Plus,
  Repeat,
  Shuffle,
  Play,
  Trash2,
  GripVertical,
  ChevronRight,
  CheckCircle,
  Tag,
  Clock,
  Film,
} from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';
import { VideoCategory, Playlist } from '../types';

export const categories: VideoCategory[] = [
  'Berita',
  'Talkshow',
  'Podcast',
  'Wisata',
  'Kuliner',
  'Pemerintah',
  'DPRD',
  'Polres',
  'Kodim',
  'UMKM',
  'Iklan',
  'Video Lokal',
  'Video Nasional',
];

export const PlaylistView: React.FC = () => {
  const { playlists, videos, refreshData } = useBroadcast();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(playlists[0]?.id || 'pl-1');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistCategory, setNewPlaylistCategory] = useState<VideoCategory>('Berita');

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId) || playlists[0];

  const handleActivatePlaylist = async (id: string) => {
    await fetch('/api/playlist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: true }),
    });
    refreshData();
  };

  const handleToggleRepeat = async () => {
    if (!selectedPlaylist) return;
    await fetch('/api/playlist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedPlaylist.id, repeat: !selectedPlaylist.repeat }),
    });
    refreshData();
  };

  const handleToggleShuffle = async () => {
    if (!selectedPlaylist) return;
    await fetch('/api/playlist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedPlaylist.id, shuffle: !selectedPlaylist.shuffle }),
    });
    refreshData();
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName) return;
    await fetch('/api/playlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newPlaylistName,
        category: newPlaylistCategory,
        repeat: true,
        shuffle: false,
      }),
    });
    setNewPlaylistName('');
    setShowAddModal(false);
    refreshData();
  };

  const handleAddVideoToPlaylist = async (videoId: string) => {
    if (!selectedPlaylist) return;
    const newItems = [
      ...selectedPlaylist.items,
      {
        id: `pli-${Date.now()}`,
        playlistId: selectedPlaylist.id,
        videoId,
        order: selectedPlaylist.items.length + 1,
        autoNext: true,
      },
    ];
    await fetch('/api/playlist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedPlaylist.id, items: newItems }),
    });
    refreshData();
  };

  const handleRemoveItem = async (pliId: string) => {
    if (!selectedPlaylist) return;
    const newItems = selectedPlaylist.items.filter((item) => item.id !== pliId);
    await fetch('/api/playlist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedPlaylist.id, items: newItems }),
    });
    refreshData();
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
            <ListMusic className="w-5 h-5 text-[#D50000]" />
            <span>24H AUTOMATED PLAYLIST BUILDER</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Atur Susunan Pemutaran Video, Repeat, Shuffle, Auto Next & Kategori Siaran TV
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-[#D50000] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-lg shadow-red-950/60 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>BUAT PLAYLIST BARU</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setSelectedCategoryFilter('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            selectedCategoryFilter === 'All'
              ? 'bg-[#D50000] text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          Semua Kategori ({categories.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedCategoryFilter === cat
                ? 'bg-[#D50000] text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid: Playlists Sidebar + Selected Playlist Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Playlists List */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
          <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
            Daftar Playlist Tersedia
          </h3>

          <div className="space-y-2">
            {playlists.map((pl) => {
              const isSelected = pl.id === selectedPlaylistId;
              return (
                <div
                  key={pl.id}
                  onClick={() => setSelectedPlaylistId(pl.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-950/60 border-red-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-xs">{pl.name}</h4>
                      {pl.active && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-red-600 text-white font-extrabold uppercase rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      Kategori: {pl.category} • {pl.items.length} Video
                    </p>
                  </div>

                  {!pl.active && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivatePlaylist(pl.id);
                      }}
                      className="px-2 py-1 bg-zinc-800 hover:bg-red-600 text-[10px] text-white font-bold rounded"
                    >
                      Aktifkan
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Playlist Editor & Video Picker */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPlaylist && (
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-3 gap-3">
                <div>
                  <h2 className="text-base font-extrabold text-white">{selectedPlaylist.name}</h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    Kategori: {selectedPlaylist.category} • {selectedPlaylist.items.length} Item
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={handleToggleRepeat}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded font-bold border transition ${
                      selectedPlaylist.repeat
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-600'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Repeat {selectedPlaylist.repeat ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={handleToggleShuffle}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded font-bold border transition ${
                      selectedPlaylist.shuffle
                        ? 'bg-purple-950 text-purple-400 border-purple-600'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Shuffle {selectedPlaylist.shuffle ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Urutan Pemutaran Video ({selectedPlaylist.items.length})
                </h3>

                {selectedPlaylist.items.map((item, idx) => {
                  const videoData = videos.find((v) => v.id === item.videoId) || videos[0];
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />
                        <span className="font-mono text-zinc-400 font-bold w-5">{idx + 1}.</span>
                        <img
                          src={videoData?.thumbnailUrl}
                          alt={videoData?.title}
                          className="w-12 h-8 rounded object-cover border border-zinc-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{videoData?.title}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">
                            Durasi: {videoData?.durationSeconds} Detik • {videoData?.category}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Quick Add Video from Library */}
              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Tambahkan Video dari Media Library
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 p-2 rounded text-xs"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Film className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate font-semibold text-zinc-300">{vid.title}</span>
                      </div>
                      <button
                        onClick={() => handleAddVideoToPlaylist(vid.id)}
                        className="px-2 py-1 bg-[#D50000] hover:bg-red-700 text-white font-bold rounded text-[10px] shrink-0"
                      >
                        + Tambah
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Playlist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-xl p-5 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Buat Playlist Siaran Baru
            </h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Nama Playlist</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Playlist Berita Malam Kertajati"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Kategori Siaran</label>
                <select
                  value={newPlaylistCategory}
                  onChange={(e) => setNewPlaylistCategory(e.target.value as VideoCategory)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
                  Simpan Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
