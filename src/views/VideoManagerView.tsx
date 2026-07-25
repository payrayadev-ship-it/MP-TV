import React, { useState } from 'react';
import { Film, Upload, Search, Filter, Trash2, Edit3, Eye, Tag, Clock, HardDrive, CheckCircle } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';
import { VideoCategory, VideoItem } from '../types';
import { categories } from './PlaylistView';

export const VideoManagerView: React.FC = () => {
  const { videos, uploadVideo, refreshData } = useBroadcast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>('Berita');
  const [tags, setTags] = useState('Majalengka, BIJB, Kertajati');
  const [durationSeconds, setDurationSeconds] = useState(180);
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await uploadVideo({
      title,
      description,
      category,
      tags: tags.split(',').map((t) => t.trim()),
      durationSeconds: Number(durationSeconds),
      videoUrl,
      thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600',
    });
    setTitle('');
    setDescription('');
    setShowUploadModal(false);
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
            <Film className="w-5 h-5 text-[#D50000]" />
            <span>SUPABASE STORAGE VIDEO MANAGER</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Penyimpanan Aset Video Siaran, Auto Generasi Thumbnail, Resolusi & Metadata
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 bg-[#D50000] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-lg shadow-red-950/60 transition active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>UPLOAD VIDEO BARU</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800 gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari Judul / Tag Video..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 pl-9 pr-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none"
          >
            <option value="All">Semua Kategori Video</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredVideos.map((vid) => (
          <div
            key={vid.id}
            className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded border border-white/10 font-bold">
                  {vid.durationSeconds}s
                </div>
                <div className="absolute top-2 left-2 bg-red-600/90 text-white font-extrabold text-[9px] px-2 py-0.5 rounded tracking-wider uppercase">
                  {vid.category}
                </div>

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setPreviewVideo(vid)}
                    className="p-2 bg-[#D50000] hover:bg-red-700 text-white rounded-full shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-1.5">
                <h3 className="font-bold text-xs text-white line-clamp-2 leading-snug">{vid.title}</h3>
                <p className="text-[10px] text-zinc-400 line-clamp-2">{vid.description}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {vid.tags.map((t, idx) => (
                    <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded text-[9px] text-zinc-400 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="p-3 pt-0 text-[10px] font-mono text-zinc-500 border-t border-zinc-900 mt-2 flex justify-between items-center">
              <span>{vid.resolution}</span>
              <span>{vid.fileSizeMb} MB</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-xl p-5 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Upload className="w-4 h-4 text-[#D50000]" />
              <span>Upload Video ke Supabase Storage</span>
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Judul Video Siaran</label>
                <input
                  type="text"
                  required
                  placeholder="Judul Berita / Wisata / Sponsor"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Kategori Video</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VideoCategory)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Durasi (Detik)</label>
                  <input
                    type="number"
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Tags (Pisahkan Koma)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D50000] hover:bg-red-700 text-white rounded font-bold"
                >
                  Proses Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-3xl rounded-xl p-4 space-y-3 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="font-bold text-sm text-white">{previewVideo.title}</h3>
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video src={previewVideo.videoUrl} controls autoPlay className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-zinc-300">{previewVideo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};
