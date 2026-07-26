import React, { useState } from 'react';
import { Bot, Sparkles, Play, CheckCircle2, Clock, Film, ListMusic, RefreshCw } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';

export const AiPresenterView: React.FC = () => {
  const { newsList, aiTasks, generateAiPresenter, playlists } = useBroadcast();

  const [selectedNewsId, setSelectedNewsId] = useState<string>(newsList?.[0]?.id || '');
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(playlists?.[0]?.id || 'pl-1');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedNews = newsList?.find((n) => n.id === selectedNewsId) || newsList?.[0];

  const handleStartGenerate = async () => {
    if (!selectedNews) return;
    setIsGenerating(true);

    await generateAiPresenter(selectedNews.title, selectedNews.content, voiceGender);

    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2 text-purple-400">
            <Bot className="w-5 h-5 text-purple-400" />
            <span>GEMINI AI PRESENTER VIRTUAL ANCHOR GENERATOR</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sintesis Otomatis Naskah Berita, Pengisi Suara & Video Anchor AI Masuk Playlist Siaran
          </p>
        </div>

        <span className="px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 font-extrabold text-xs rounded-lg flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          <span>Gemini 2.5 Flash Engine</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: News Selection & Generation Form */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-4">
          <h2 className="text-xs font-bold uppercase text-zinc-300 tracking-wider">
            1. Pilih Berita Terkini dari Database Supabase
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 font-bold block mb-1">Berita Pilihan</label>
              <select
                value={selectedNewsId}
                onChange={(e) => setSelectedNewsId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white font-bold focus:outline-none focus:border-purple-500"
              >
                {(newsList || []).map((n) => (
                  <option key={n.id} value={n.id}>
                    [{n.category}] {n.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedNews && (
              <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase">
                  Preview Naskah Mentah:
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">{selectedNews.content}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Suara Anchor AI</label>
                <select
                  value={voiceGender}
                  onChange={(e) => setVoiceGender(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                >
                  <option value="female">Wanita (Female TV Anchor)</option>
                  <option value="male">Pria (Male TV Anchor)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Target Auto Playlist</label>
                <select
                  value={selectedPlaylistId}
                  onChange={(e) => setSelectedPlaylistId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                >
                  {(playlists || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleStartGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold py-3 rounded-lg text-xs shadow-lg shadow-purple-950/80 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isGenerating
                  ? 'GEMINI AI SEDANG SYNTHESIZING VOICE & RENDERING VIDEO...'
                  : 'GENERATE VIDEO ANCHOR AI SEKARANG'}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Tasks & AI Video Output History */}
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              Daftar Tugas AI Presenter Terakhir
            </h3>

            <div className="space-y-3">
              {(aiTasks || []).map((task) => (
                <div key={task.id} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white line-clamp-1">{task.newsTitle}</h4>
                    <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800/40 text-[10px] font-bold rounded">
                      {task.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 bg-black/40 p-2 rounded font-mono">
                    "{task.scriptText}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                    <span>Otomatis Ditambahkan ke Playlist Utama</span>
                    <span className="text-emerald-400 font-bold">100% Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
