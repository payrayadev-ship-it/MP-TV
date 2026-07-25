import React, { useState } from 'react';
import { AlignLeft, Plus, Play, Trash2, Edit3, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';
import { RunningText } from '../types';

export const RunningTextView: React.FC = () => {
  const { runningTexts, addRunningText, refreshData, newsList } = useBroadcast();

  const [text, setText] = useState('');
  const [category, setCategory] = useState('Berita Utama');
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [fontSize, setFontSize] = useState(22);
  const [color, setColor] = useState('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState('#D50000');
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;

    await addRunningText({
      text,
      category,
      speed,
      fontSize: Number(fontSize),
      color,
      backgroundColor,
      position,
      active: true,
      autoSyncFromNews: true,
    });

    setText('');
  };

  const handleSyncFromLatestNews = async () => {
    if (newsList.length === 0) return;
    const latest = newsList[0];
    const newTickerText = `BERITA TERBARU: ${latest.title} — ${latest.content.substring(0, 100)}...`;

    await addRunningText({
      text: newTickerText,
      category: latest.category,
      speed: 'medium',
      fontSize: 22,
      color: '#FFFFFF',
      backgroundColor: '#D50000',
      position: 'bottom',
      active: true,
      autoSyncFromNews: true,
    });
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
            <AlignLeft className="w-5 h-5 text-[#D50000]" />
            <span>RUNNING TEXT / NEWS TICKER MANAGER</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Pengaturan Teks Berjalan Bottom Overlay, Kecepatan, Warna & Auto Sync Berita Supabase
          </p>
        </div>

        <button
          onClick={handleSyncFromLatestNews}
          className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3.5 py-2 rounded-lg text-xs border border-zinc-700 transition"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>SYNC BERITA DARI SUPABASE</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form Create */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-4">
          <h2 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
            Tambah Teks Ticker Baru
          </h2>

          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Isi Teks Berjalan</label>
              <textarea
                rows={3}
                required
                placeholder="Tuliskan teks informasi siaran TV..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Kategori Ticker</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Kecepatan Scroll</label>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white focus:outline-none"
                >
                  <option value="slow">Lambat (Slow)</option>
                  <option value="medium">Sedang (Medium)</option>
                  <option value="fast">Cepat (Fast)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Ukuran Font (px)</label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Warna Teks</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-9 bg-zinc-900 border border-zinc-800 p-1 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Warna Banner BG</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-9 bg-zinc-900 border border-zinc-800 p-1 rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D50000] hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-xs transition active:scale-95"
            >
              SIMPAN RUNNING TEXT
            </button>
          </form>
        </div>

        {/* Live Scroll Ticker Preview */}
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              Pratinjau Live Scroll Horizontal
            </h3>

            <div className="aspect-video bg-black rounded-lg overflow-hidden relative border border-zinc-800 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800"
                alt="Broadcast Preview"
                className="w-full h-full object-cover"
              />

              {/* Ticker Bottom */}
              <div
                className="absolute inset-x-0 bottom-0 py-2 px-3 border-t-2 border-yellow-400 flex items-center shadow-2xl font-bold"
                style={{ backgroundColor, color }}
              >
                <span className="bg-black text-yellow-400 text-[9px] uppercase font-black px-2 py-0.5 rounded mr-3 shrink-0">
                  {category}
                </span>
                <div className="overflow-hidden whitespace-nowrap w-full">
                  <div className="inline-block animate-marquee tracking-wide" style={{ fontSize: `${fontSize * 0.7}px` }}>
                    {text || 'MAJALENGKA POST TV 24 JAM: Teks berita berjalan akan meluncur lancar di bagian bawah layar.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List Running Text Items */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              Daftar Ticker Aktif
            </h3>

            <div className="space-y-2">
              {runningTexts.map((rt) => (
                <div key={rt.id} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white">{rt.category}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Kecepatan: {rt.speed}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-mono">{rt.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
