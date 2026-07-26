import React, { useState } from 'react';
import { Megaphone, Plus, Upload, BarChart, CheckCircle, Clock, Film, Image as ImageIcon } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';

export const AdvertisementView: React.FC = () => {
  const { ads, refreshData } = useBroadcast();
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [type, setType] = useState<'video' | 'banner'>('video');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1542744094-3a31b272c490?w=600');
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [targetImpressions, setTargetImpressions] = useState(50000);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sponsorName) return;

    await fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        sponsorName,
        type,
        mediaUrl,
        durationSeconds: Number(durationSeconds),
        scheduleTime,
        targetImpressions: Number(targetImpressions),
      }),
    });

    setTitle('');
    setSponsorName('');
    setShowAddModal(false);
    refreshData();
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-[#D50000]" />
            <span>ADVERTISEMENT & SPONSOR MANAGER</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manajemen Iklan Komersial Video / Banner, Jam Tayang & Statistik Impresi
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-[#D50000] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-lg shadow-red-950/60 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH IKLAN SPONSOR</span>
        </button>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(ads || []).map((ad) => {
          const progressPct = Math.min(100, Math.round((ad.impressionsCount / ad.targetImpressions) * 100));

          return (
            <div key={ad.id} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800/40 text-[10px] font-bold rounded uppercase">
                    {ad.sponsorName}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-1.5 line-clamp-1">{ad.title}</h3>
                </div>
                <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-300">
                  {ad.type === 'video' ? 'VIDEO AD' : 'BANNER AD'}
                </span>
              </div>

              {/* Media Preview Box */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800">
                {ad.type === 'video' ? (
                  <video src={ad.mediaUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover" />
                )}
              </div>

              {/* Airing Schedule & Impressions Stat */}
              <div className="space-y-2 pt-1 border-t border-zinc-900 text-xs">
                <div className="flex justify-between text-zinc-400 font-mono">
                  <span>Jam Tayang Slot: <strong className="text-white">{ad.scheduleTime} WIB</strong></span>
                  <span>Durasi: <strong className="text-white">{ad.durationSeconds}s</strong></span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">Total Impresi Tayang</span>
                    <span className="font-bold text-amber-400 font-mono">
                      {ad.impressionsCount.toLocaleString()} / {ad.targetImpressions.toLocaleString()} ({progressPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Ad Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-xl p-5 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Tambah Kampanye Iklan Sponsor
            </h2>

            <form onSubmit={handleCreateAd} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Judul Iklan / Kampanye</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Bank BJB Kredit Mesra Majalengka"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Nama Sponsor / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="Bank BJB / Telkomsel"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Jenis Media Iklan</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                  >
                    <option value="video">Video Commercial (MP4)</option>
                    <option value="banner">Banner Watermark (PNG/JPG)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Durasi (Detik)</label>
                  <input
                    type="number"
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Jam Slot Tayang</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Target Impresi</label>
                  <input
                    type="number"
                    value={targetImpressions}
                    onChange={(e) => setTargetImpressions(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white font-mono focus:outline-none"
                  />
                </div>
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
                  Simpan Iklan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
