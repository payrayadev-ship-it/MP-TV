import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle, Tv, Youtube, Database, Mail, Image as ImageIcon, Sliders } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';

export const SettingsView: React.FC = () => {
  const { settings, refreshData } = useBroadcast();

  const [obsHost, setObsHost] = useState(settings?.obsHost || '127.0.0.1');
  const [obsPort, setObsPort] = useState(settings?.obsPort || 4455);
  const [obsPassword, setObsPassword] = useState(settings?.obsPassword || 'majalengkaposttv');
  const [youtubeStreamKey, setYoutubeStreamKey] = useState(settings?.youtubeStreamKey || 'mjp-live-24h-stream-key');
  const [youtubeApiKey, setYoutubeApiKey] = useState(settings?.youtubeApiKey || 'AIzaSyA1234567890MjTvApiKeySecret');
  const [supabaseUrl, setSupabaseUrl] = useState(settings?.supabaseUrl || 'https://mjp-tv-supabase.supabase.co');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(settings?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  const [storageBucket, setStorageBucket] = useState(settings?.storageBucket || 'tv-broadcast-assets');
  const [smtpServer, setSmtpServer] = useState(settings?.smtpServer || 'smtp.majalengkapost.tv');
  const [smtpPort, setSmtpPort] = useState(settings?.smtpPort || 587);
  const [tvLogoUrl, setTvLogoUrl] = useState(settings?.tvLogoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200');
  const [theme, setTheme] = useState(settings?.theme || 'Dark Broadcast');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        obsHost,
        obsPort: Number(obsPort),
        obsPassword,
        youtubeStreamKey,
        youtubeApiKey,
        supabaseUrl,
        supabaseAnonKey,
        storageBucket,
        smtpServer,
        smtpPort: Number(smtpPort),
        tvLogoUrl,
        theme,
      }),
    });

    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
    refreshData();
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-[#D50000]" />
            <span>PENGATURAN SISTEM SIARAN TV (GLOBAL CONFIGURATION)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Konfigurasi Kunci API OBS WebSocket, YouTube Live RTMP, Supabase, Storage & Logo Overlays
          </p>
        </div>

        {savedMessage && (
          <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Pengaturan Berhasil Disimpan</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* OBS Studio Settings */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
          <h2 className="text-xs font-bold uppercase text-red-500 tracking-wider flex items-center space-x-2">
            <Tv className="w-4 h-4" />
            <span>1. OBS Studio WebSocket v5 Server</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 font-bold block mb-1">OBS Host / IP</label>
              <input
                type="text"
                value={obsHost}
                onChange={(e) => setObsHost(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded font-mono text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-bold block mb-1">WebSocket Port</label>
              <input
                type="number"
                value={obsPort}
                onChange={(e) => setObsPort(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded font-mono text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-bold block mb-1">Password Server</label>
              <input
                type="password"
                value={obsPassword}
                onChange={(e) => setObsPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded font-mono text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* YouTube & Supabase Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* YouTube Settings */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h2 className="text-xs font-bold uppercase text-red-500 tracking-wider flex items-center space-x-2">
              <Youtube className="w-4 h-4" />
              <span>2. YouTube Data API v3 & Stream Key</span>
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">YouTube Stream Key</label>
                <input
                  type="password"
                  value={youtubeStreamKey}
                  onChange={(e) => setYoutubeStreamKey(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded font-mono text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Google API Key (YouTube V3)</label>
                <input
                  type="password"
                  value={youtubeApiKey}
                  onChange={(e) => setYoutubeApiKey(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Supabase Settings */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h2 className="text-xs font-bold uppercase text-[#D50000] tracking-wider flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>3. Supabase PostgreSQL & Storage</span>
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Supabase Project URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded font-mono text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Supabase Anon Key</label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme & Watermark Logos */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
          <h2 className="text-xs font-bold uppercase text-zinc-300 tracking-wider flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>4. Tampilan Visual Theme & Watermark Overlay</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 font-bold block mb-1">Logo Utama TV URL</label>
              <input
                type="text"
                value={tvLogoUrl}
                onChange={(e) => setTvLogoUrl(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded font-mono text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-bold block mb-1">Tema Warna Dashboard</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white font-bold focus:outline-none"
              >
                <option value="Dark Broadcast">Dark Broadcast Modern (#111111 + #D50000)</option>
                <option value="Glass Red">Glassmorphism Studio Red</option>
                <option value="Obsidian Matrix">Obsidian Dark Command Center</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vercel Deployment & Serverless Integration Card */}
        <div className="bg-[#141414] border border-white/10 p-4 rounded-xl space-y-3">
          <h2 className="text-xs font-bold uppercase text-white tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>5. Vercel Cloud Serverless Deployment Ready</span>
          </h2>
          <div className="text-xs space-y-2 text-white/80">
            <p className="leading-relaxed">
              Aplikasi MPTV ini sudah dikonfigurasi penuh agar kompatibel dengan <strong>Vercel Serverless Functions</strong> &amp; <strong>Vite Static Hosting</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] pt-1">
              <div className="p-2.5 bg-black/60 border border-white/10 rounded">
                <span className="text-emerald-400 font-bold block mb-0.5">vercel.json</span>
                <span className="text-white/60">Routing &amp; rewrites API /api/* disiapkan secara otomatis.</span>
              </div>
              <div className="p-2.5 bg-black/60 border border-white/10 rounded">
                <span className="text-emerald-400 font-bold block mb-0.5">/api/index.ts</span>
                <span className="text-white/60">Serverless Express handler siap jalan di Vercel Functions.</span>
              </div>
              <div className="p-2.5 bg-black/60 border border-white/10 rounded">
                <span className="text-emerald-400 font-bold block mb-0.5">Environment Vars</span>
                <span className="text-white/60">Atur VITE_SUPABASE_URL &amp; GEMINI_API_KEY di Vercel Dashboard.</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-[#D50000] hover:bg-red-700 text-white font-extrabold py-3 rounded-lg text-sm shadow-xl shadow-red-950/80 transition active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>SIMPAN SEMUA PENGATURAN STUDIO</span>
        </button>
      </form>
    </div>
  );
};
