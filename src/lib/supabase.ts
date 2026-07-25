import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from import.meta.env or window/localStorage overrides
const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('MPTV_SUPABASE_URL') || '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('MPTV_SUPABASE_ANON_KEY') || '';
  return { url, anonKey };
};

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey);
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && url.startsWith('http') && anonKey);
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (url) localStorage.setItem('MPTV_SUPABASE_URL', url.trim());
  else localStorage.removeItem('MPTV_SUPABASE_URL');

  if (anonKey) localStorage.setItem('MPTV_SUPABASE_ANON_KEY', anonKey.trim());
  else localStorage.removeItem('MPTV_SUPABASE_ANON_KEY');

  supabaseInstance = null; // Reset instance
}

// SQL Schema Definition helper for MPTV Broadcast tables
export const SUPABASE_SQL_SCHEMA = `-- MPTV (Majalengka Post TV) Supabase Database Schema

-- 1. News Articles Table
CREATE TABLE IF NOT EXISTS public.mptv_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Published',
  views_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Videos Library Table
CREATE TABLE IF NOT EXISTS public.mptv_videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_sec INTEGER NOT NULL,
  video_url TEXT NOT NULL,
  resolution TEXT DEFAULT '1080p',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Broadcast Playlists Table
CREATE TABLE IF NOT EXISTS public.mptv_playlists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  items_count INTEGER DEFAULT 0,
  total_duration_sec INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OBS Settings & Status Table
CREATE TABLE IF NOT EXISTS public.mptv_obs_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  is_streaming BOOLEAN DEFAULT FALSE,
  is_recording BOOLEAN DEFAULT FALSE,
  current_scene TEXT DEFAULT 'Studio Utama',
  fps INTEGER DEFAULT 60,
  cpu_usage NUMERIC DEFAULT 12.4,
  memory_usage NUMERIC DEFAULT 38.2,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Broadcast Activity Logs
CREATE TABLE IF NOT EXISTS public.mptv_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_name TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'SUCCESS'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mptv_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_obs_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_logs ENABLE ROW LEVEL SECURITY;

-- Public Read & Write Policies for Studio Operators
CREATE POLICY "Allow public read mptv_news" ON public.mptv_news FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_news" ON public.mptv_news FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_videos" ON public.mptv_videos FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_videos" ON public.mptv_videos FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_playlists" ON public.mptv_playlists FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_playlists" ON public.mptv_playlists FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_obs_settings" ON public.mptv_obs_settings FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_obs_settings" ON public.mptv_obs_settings FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_logs" ON public.mptv_logs FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_logs" ON public.mptv_logs FOR ALL USING (true);
`;

// Sync Data Helpers
export async function syncNewsToSupabase(newsList: any[]) {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not initialized' };

  try {
    const formatted = newsList.map((n) => ({
      id: String(n.id),
      title: n.title,
      category: n.category,
      content: n.content,
      author: n.author,
      published_at: n.publishedAt || new Date().toISOString(),
      status: n.status || 'Published',
      views_count: n.viewsCount || 0,
      featured: Boolean(n.featured),
    }));

    const { data, error } = await client.from('mptv_news').upsert(formatted, { onConflict: 'id' });
    if (error) throw error;
    return { success: true, count: newsList.length, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to sync news to Supabase' };
  }
}

export async function fetchNewsFromSupabase() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('mptv_news')
      .select('*')
      .order('published_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      message: 'Supabase URL & Anon Key belum dikonfigurasi. Silakan masukkan kredensial Supabase.',
    };
  }

  try {
    const { error } = await client.from('mptv_news').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // Table missing or policy issue, but connection reached Supabase
      if (error.message.includes('does not exist')) {
        return {
          connected: true,
          message: 'Terkoneksi ke Supabase! (Tabel mptv_news belum dibuat. Silakan jalankan script SQL di bawah).',
        };
      }
      return { connected: false, message: `Error Supabase: ${error.message}` };
    }

    return { connected: true, message: 'Koneksi ke database Supabase BERHASIL & aktif!' };
  } catch (err: any) {
    return { connected: false, message: `Gagal menghubungkan ke Supabase: ${err.message}` };
  }
}
