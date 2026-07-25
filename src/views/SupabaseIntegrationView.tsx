import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  Key,
  Globe,
  UploadCloud,
  FileCode,
  ShieldCheck,
  Server,
  AlertTriangle,
} from 'lucide-react';
import {
  testSupabaseConnection,
  saveSupabaseCredentials,
  isSupabaseConfigured,
  SUPABASE_SQL_SCHEMA,
  syncNewsToSupabase,
  fetchNewsFromSupabase,
} from '../lib/supabase';
import { useBroadcast } from '../context/BroadcastContext';

export const SupabaseIntegrationView: React.FC = () => {
  const { newsList } = useBroadcast();
  const news = newsList || [];
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [connStatus, setConnStatus] = useState<{ connected: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [fetchedNewsCount, setFetchedNewsCount] = useState<number | null>(null);

  useEffect(() => {
    const env = (import.meta as any).env || {};
    const url = env.VITE_SUPABASE_URL || localStorage.getItem('MPTV_SUPABASE_URL') || '';
    const key = env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('MPTV_SUPABASE_ANON_KEY') || '';
    setSupabaseUrl(url);
    setSupabaseKey(key);

    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    const result = await testSupabaseConnection();
    setConnStatus(result);
    setIsTesting(false);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    await handleTestConnection();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    const res = await syncNewsToSupabase(news);
    if (res.success) {
      setSyncResult(`Berhasil melakukan sinkronisasi ${res.count} item berita MPTV ke tabel 'mptv_news' di Supabase!`);
    } else {
      setSyncResult(`Gagal sinkronisasi: ${res.error}`);
    }
    setIsSyncing(false);
  };

  const handleFetchData = async () => {
    const data = await fetchNewsFromSupabase();
    if (data) {
      setFetchedNewsCount(data.length);
    } else {
      setFetchedNewsCount(0);
    }
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-4 text-white">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#141414] border border-white/10 p-4 rounded-lg gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600/20 border border-emerald-500/40 rounded-lg text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-extrabold uppercase tracking-widest text-white">
                INTEGRASI SUPABASE DATABASE
              </h1>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                  connStatus?.connected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {connStatus?.connected ? 'CONNECTED & ACTIVE' : 'CONFIG REQUIRED'}
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-0.5">
              Penyimpanan cloud terpusat untuk berita MPTV, playlist siaran 24 jam, video library, & audit log operator.
            </p>
          </div>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-1.5 rounded text-xs transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
          <span>{isTesting ? 'Testing...' : 'Tes Ulang Koneksi'}</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Credentials Form & Connection Status */}
        <div className="space-y-4">
          {/* Status Alert Card */}
          <div
            className={`p-4 rounded-lg border text-xs space-y-2 ${
              connStatus?.connected
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold uppercase text-xs">
              {connStatus?.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{connStatus?.connected ? 'Status Koneksi Supabase: Aktif' : 'Status Koneksi: Perlu Konfigurasi'}</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              {connStatus?.message || 'Memeriksa status koneksi ke Supabase...'}
            </p>
          </div>

          {/* Configuration Form */}
          <div className="bg-[#141414] border border-white/10 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Key className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Pengaturan Kredensial Supabase
              </h2>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                  SUPABASE PROJECT URL
                </label>
                <div className="relative flex items-center">
                  <Globe className="w-3.5 h-3.5 text-white/40 absolute left-3" />
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full bg-black/60 border border-white/10 pl-9 pr-3 py-1.5 rounded text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                  SUPABASE ANON API KEY
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-black/60 border border-white/10 px-3 py-1.5 rounded text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 rounded text-xs transition active:scale-95"
                >
                  Simpan Kredensial
                </button>
              </div>
            </form>

            <p className="text-[10px] text-white/40 leading-snug">
              * Kredensial ini disimpan secara aman di environment browser Anda. Anda juga dapat menyimpannya di file <code className="text-emerald-400">.env</code> sebagai <code className="text-emerald-400">VITE_SUPABASE_URL</code> dan <code className="text-emerald-400">VITE_SUPABASE_ANON_KEY</code>.
            </p>
          </div>

          {/* Sync Controls */}
          <div className="bg-[#141414] border border-white/10 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Sinkronisasi Data MPTV
              </h2>
            </div>

            <p className="text-[11px] text-white/60">
              Upload data siaran lokal (Berita, Video, Playlist) langsung ke database Supabase Cloud.
            </p>

            <div className="space-y-2">
              <button
                onClick={handleSyncData}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-2 bg-[#D50000] hover:bg-red-700 text-white font-extrabold py-2 rounded text-xs transition active:scale-95 disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isSyncing ? 'Mengunggah Data...' : 'Sync Data Berita ke Supabase'}</span>
              </button>

              <button
                onClick={handleFetchData}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded text-xs transition active:scale-95"
              >
                <Server className="w-4 h-4" />
                <span>Tes Query Cloud Table ('mptv_news')</span>
              </button>
            </div>

            {syncResult && (
              <div className="p-2.5 bg-black/60 border border-white/10 rounded text-[11px] font-mono text-emerald-400">
                {syncResult}
              </div>
            )}

            {fetchedNewsCount !== null && (
              <div className="p-2.5 bg-black/60 border border-white/10 rounded text-[11px] font-mono text-white/90">
                Data ditemukan di Supabase: <span className="font-bold text-emerald-400">{fetchedNewsCount} artikel berita</span>.
              </div>
            )}
          </div>
        </div>

        {/* Right: SQL Schema & Quick Guide */}
        <div className="lg:col-span-2 space-y-4">
          {/* SQL Migration Script Box */}
          <div className="bg-[#141414] border border-white/10 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Skema SQL Database Supabase (Majalengka Post TV)
                </h2>
              </div>

              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-bold transition"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-white/60">
              Salin skema SQL di bawah lalu jalankan di **Supabase Dashboard &gt; SQL Editor** untuk membuat tabel otomatis.
            </p>

            <div className="relative bg-black border border-white/10 rounded-lg p-3 overflow-x-auto custom-scrollbar max-h-[380px]">
              <pre className="text-[11px] font-mono text-emerald-300 leading-relaxed selection:bg-emerald-900">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>

          {/* Supabase Architecture Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#141414] border border-white/5 p-3 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Row Level Security</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                RLS dikonfigurasi untuk mengamankan data studio MPTV dan memberikan akses terkontrol bagi operator.
              </p>
            </div>

            <div className="bg-[#141414] border border-white/5 p-3 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
                <Server className="w-4 h-4" />
                <span>PostgreSQL Engine</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                Memanfaatkan PostgreSQL berperforma tinggi dari Supabase dengan dukungan query JSONB & timestamp real-time.
              </p>
            </div>

            <div className="bg-[#141414] border border-white/5 p-3 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                <RefreshCw className="w-4 h-4" />
                <span>Realtime Broadcast Sync</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                Mendukung sinkronisasi state siaran OBS Studio & playlist otomatis dari client ke cloud Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
