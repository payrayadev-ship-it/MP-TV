import React, { useState } from 'react';
import { Zap, AlertTriangle, Play, Check, Clock, Radio, ShieldAlert } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';

export const BreakingNewsView: React.FC = () => {
  const { breakingNewsList, publishBreakingNews, obsSettings } = useBroadcast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'Emergency' | 'High' | 'Normal'>('Emergency');
  const [durationSeconds, setDurationSeconds] = useState(20);
  const [autoTriggerObs, setAutoTriggerObs] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsPublishing(true);
    await publishBreakingNews({
      title,
      content,
      priority,
      durationSeconds: Number(durationSeconds),
      autoTriggerObs,
    });

    setTimeout(() => {
      setIsPublishing(false);
      setTitle('');
      setContent('');
    }, 1000);
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2 text-red-500">
            <Zap className="w-5 h-5 fill-current animate-bounce" />
            <span>BREAKING NEWS OVERLAY PUBLISHER</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Terbitkan Berita Darurat / Selaan Langsung Mengganti Scene OBS Studio Secara Otomatis
          </p>
        </div>

        {obsSettings?.currentScene === 'Breaking News Overlay' && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white font-extrabold text-xs rounded-lg animate-pulse">
            <Radio className="w-4 h-4 animate-spin" />
            <span>BREAKING NEWS SEDANG TAYANG ON AIR</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Publisher Form */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-4">
          <h2 className="text-sm font-bold uppercase text-white tracking-wider flex items-center space-x-2 border-b border-zinc-800 pb-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>Form Penerbitan Breaking News</span>
          </h2>

          <form onSubmit={handlePublish} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Judul Utama Breaking News</label>
              <input
                type="text"
                required
                placeholder="misal: BREAKING NEWS: Kunjungan Kerja Gubernur di BIJB Kertajati"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-white font-bold focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Isi / Detail Informasi Singkat</label>
              <textarea
                rows={3}
                required
                placeholder="Tuliskan poin penting berita yang akan tampil pada banner darurat..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Tingkat Prioritas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-white font-bold focus:outline-none"
                >
                  <option value="Emergency">Emergency (Merah Terang)</option>
                  <option value="High">High Priority (Kuning / Merah)</option>
                  <option value="Normal">Normal Announcement</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Durasi Tayang Overlay (Detik)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
              <input
                type="checkbox"
                id="autoObs"
                checked={autoTriggerObs}
                onChange={(e) => setAutoTriggerObs(e.target.checked)}
                className="w-4 h-4 accent-[#D50000] cursor-pointer"
              />
              <label htmlFor="autoObs" className="text-xs text-zinc-300 font-bold cursor-pointer">
                Otomatis Pindah Scene OBS ke "Breaking News Overlay" Saat Publish
              </label>
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-extrabold py-3 rounded-lg text-sm shadow-xl shadow-red-950/80 transition active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isPublishing ? 'PUBLISHING & TRIGGERING OBS...' : 'PUBLISH BREAKING NEWS SEKARANG'}</span>
            </button>
          </form>
        </div>

        {/* Live Visual Banner Preview Frame */}
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h2 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              Pratinjau Tampilan Visual On-Air Overlay
            </h2>

            {/* Simulated TV Screen Frame */}
            <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden relative border border-zinc-800 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800"
                alt="Studio Feed"
                className="w-full h-full object-cover filter contrast-105 opacity-80"
              />

              {/* Red Overlay Flash Banner */}
              <div className="absolute inset-x-0 bottom-6 bg-gradient-to-r from-[#D50000] via-red-700 to-red-900 text-white p-3 shadow-2xl border-y-2 border-yellow-400 animate-pulse">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-yellow-400 text-black px-2 py-0.5 rounded font-black text-[10px] tracking-widest uppercase">
                    BREAKING NEWS
                  </span>
                  <span className="text-[10px] text-zinc-200 font-mono">MAJALENGKA POST TV</span>
                </div>
                <h3 className="font-extrabold text-xs tracking-wide uppercase line-clamp-1">
                  {title || 'JUDUL BREAKING NEWS MAJALENGKA POST'}
                </h3>
                <p className="text-[11px] text-zinc-100 line-clamp-2 mt-0.5">
                  {content || 'Isi detail breaking news akan tampil di sini secara bergerak dan jelas.'}
                </p>
              </div>
            </div>
          </div>

          {/* Historic Published Breaking News */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              Riwayat Terbit Breaking News
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {(breakingNewsList || []).map((bn) => (
                <div key={bn.id} className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-red-400">{bn.title}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{bn.publishedAt}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">{bn.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
