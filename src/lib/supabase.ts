import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Helper to get configuration from environment variables or localStorage
export const getSupabaseConfig = () => {
  const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : {};
  const nodeEnv = (typeof process !== 'undefined' && process.env) ? process.env : {};

  const envUrl = nodeEnv.SUPABASE_URL || nodeEnv.VITE_SUPABASE_URL || metaEnv.VITE_SUPABASE_URL || '';
  const envKey = nodeEnv.SUPABASE_ANON_KEY || nodeEnv.SUPABASE_SERVICE_ROLE_KEY || nodeEnv.VITE_SUPABASE_ANON_KEY || metaEnv.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = (typeof window !== 'undefined' ? localStorage.getItem('MPTV_SUPABASE_URL') || '' : '').trim();
  const localKey = (typeof window !== 'undefined' ? localStorage.getItem('MPTV_SUPABASE_ANON_KEY') || '' : '').trim();

  const url = (localUrl || envUrl || '').trim();
  const anonKey = (localKey || envKey || '').trim();

  return { url, anonKey };
};

let supabaseInstance: SupabaseClient | null = null;

export function isValidSupabaseUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.includes('your-supabase-project.supabase.co') || trimmed.includes('example.com')) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidSupabaseKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (trimmed.includes('your-supabase-anon-key') || trimmed.length < 10) {
    return false;
  }
  return true;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return isValidSupabaseUrl(url) && isValidSupabaseKey(anonKey);
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  
  if (!isValidSupabaseUrl(url) || !isValidSupabaseKey(anonKey)) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.error('[Supabase Init Error]', err);
      supabaseInstance = null;
    }
  }

  return supabaseInstance;
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window === 'undefined') return;

  if (url && isValidSupabaseUrl(url)) {
    localStorage.setItem('MPTV_SUPABASE_URL', url.trim());
  } else if (!url) {
    localStorage.removeItem('MPTV_SUPABASE_URL');
  }

  if (anonKey && isValidSupabaseKey(anonKey)) {
    localStorage.setItem('MPTV_SUPABASE_ANON_KEY', anonKey.trim());
  } else if (!anonKey) {
    localStorage.removeItem('MPTV_SUPABASE_ANON_KEY');
  }

  supabaseInstance = null; // Reset instance
}

// SQL Schema Definition helper for MPTV Broadcast tables
export const SUPABASE_SQL_SCHEMA = `-- MAJALENGKA POST TV (MPTV) BROADCAST AUTOMATION - COMPLETE SUPABASE MIGRATION SCRIPT

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & OPERATORS TABLE
CREATE TABLE IF NOT EXISTS public.mptv_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Operator',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VIDEO LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.mptv_videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Berita',
  tags TEXT[] DEFAULT ARRAY['Majalengka'],
  duration_sec INTEGER NOT NULL DEFAULT 180,
  resolution TEXT DEFAULT '1080p (FHD)',
  file_size_mb NUMERIC(8,2) DEFAULT 120.00,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_by_id TEXT REFERENCES public.mptv_users(id) ON DELETE SET NULL,
  created_by_name TEXT DEFAULT 'Operator TV',
  play_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BROADCAST PLAYLISTS TABLE
CREATE TABLE IF NOT EXISTS public.mptv_playlists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Berita',
  repeat_loop BOOLEAN DEFAULT TRUE,
  shuffle_mode BOOLEAN DEFAULT FALSE,
  items_count INTEGER DEFAULT 0,
  total_duration_sec INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PLAYLIST ITEMS TABLE (M2M / ORDERED RELATIONSHIP)
CREATE TABLE IF NOT EXISTS public.mptv_playlist_items (
  id TEXT PRIMARY KEY,
  playlist_id TEXT NOT NULL REFERENCES public.mptv_playlists(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES public.mptv_videos(id) ON DELETE CASCADE,
  item_order INTEGER NOT NULL DEFAULT 1,
  auto_next BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. OBS CONTROL & STATUS TABLE
CREATE TABLE IF NOT EXISTS public.mptv_obs_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  is_streaming BOOLEAN DEFAULT FALSE,
  is_recording BOOLEAN DEFAULT FALSE,
  current_scene TEXT DEFAULT 'Studio Utama',
  host TEXT DEFAULT '127.0.0.1',
  port INTEGER DEFAULT 4455,
  connected BOOLEAN DEFAULT TRUE,
  fps INTEGER DEFAULT 60,
  cpu_usage NUMERIC(5,2) DEFAULT 14.2,
  memory_usage NUMERIC(5,2) DEFAULT 38.5,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RUNNING TEXT OVERLAYS TABLE
CREATE TABLE IF NOT EXISTS public.mptv_running_text (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT DEFAULT 'Berita',
  speed TEXT DEFAULT 'medium',
  font_size INTEGER DEFAULT 22,
  color TEXT DEFAULT '#FFFFFF',
  background_color TEXT DEFAULT '#D50000',
  position TEXT DEFAULT 'bottom',
  is_active BOOLEAN DEFAULT TRUE,
  auto_sync_news BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BREAKING NEWS ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.mptv_breaking_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'Emergency',
  duration_sec INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT TRUE,
  auto_trigger_obs BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BERITA / NEWS ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.mptv_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Berita',
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Reporter MPTV',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Published',
  views_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ADVERTISEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.mptv_advertisements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sponsor_name TEXT NOT NULL,
  ad_type TEXT DEFAULT 'video',
  media_url TEXT NOT NULL,
  duration_sec INTEGER DEFAULT 30,
  schedule_time TEXT DEFAULT '12:00',
  impressions_count INTEGER DEFAULT 0,
  target_impressions INTEGER DEFAULT 10000,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BROADCAST SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.mptv_schedules (
  id TEXT PRIMARY KEY,
  program_title TEXT NOT NULL,
  playlist_id TEXT REFERENCES public.mptv_playlists(id) ON DELETE SET NULL,
  obs_scene_id TEXT DEFAULT 'sc-1',
  schedule_date DATE DEFAULT CURRENT_DATE,
  start_time TIME NOT NULL DEFAULT '12:00:00',
  end_time TIME NOT NULL DEFAULT '13:00:00',
  recurring TEXT DEFAULT 'Daily',
  category TEXT DEFAULT 'Berita',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.mptv_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_name TEXT NOT NULL DEFAULT 'System Operator',
  role TEXT NOT NULL DEFAULT 'Operator',
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'SUCCESS',
  details JSONB
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_mptv_news_published_at ON public.mptv_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_mptv_news_category ON public.mptv_news(category);
CREATE INDEX IF NOT EXISTS idx_mptv_videos_category ON public.mptv_videos(category);
CREATE INDEX IF NOT EXISTS idx_mptv_playlist_items_playlist ON public.mptv_playlist_items(playlist_id, item_order);
CREATE INDEX IF NOT EXISTS idx_mptv_schedules_date_time ON public.mptv_schedules(schedule_date, start_time);
CREATE INDEX IF NOT EXISTS idx_mptv_logs_timestamp ON public.mptv_logs(timestamp DESC);

-- AUTOMATIC AUDIT LOGGING TRIGGER
CREATE OR REPLACE FUNCTION public.fn_log_mptv_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.mptv_logs(user_name, role, action, category, status, details)
    VALUES ('Operator', 'System Trigger', 'INSERT_RECORD', TG_TABLE_NAME::text, 'SUCCESS', row_to_json(NEW)::jsonb);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.mptv_logs(user_name, role, action, category, status, details)
    VALUES ('Operator', 'System Trigger', 'UPDATE_RECORD', TG_TABLE_NAME::text, 'SUCCESS', row_to_json(NEW)::jsonb);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.mptv_logs(user_name, role, action, category, status, details)
    VALUES ('Operator', 'System Trigger', 'DELETE_RECORD', TG_TABLE_NAME::text, 'SUCCESS', row_to_json(OLD)::jsonb);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_news_changes ON public.mptv_news;
CREATE TRIGGER trg_log_news_changes
AFTER INSERT OR UPDATE OR DELETE ON public.mptv_news
FOR EACH ROW EXECUTE FUNCTION public.fn_log_mptv_activity();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.mptv_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_obs_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_running_text ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_breaking_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mptv_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read mptv_users" ON public.mptv_users FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_users" ON public.mptv_users FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_videos" ON public.mptv_videos FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_videos" ON public.mptv_videos FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_playlists" ON public.mptv_playlists FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_playlists" ON public.mptv_playlists FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_playlist_items" ON public.mptv_playlist_items FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_playlist_items" ON public.mptv_playlist_items FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_obs_settings" ON public.mptv_obs_settings FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_obs_settings" ON public.mptv_obs_settings FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_running_text" ON public.mptv_running_text FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_running_text" ON public.mptv_running_text FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_breaking_news" ON public.mptv_breaking_news FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_breaking_news" ON public.mptv_breaking_news FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_news" ON public.mptv_news FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_news" ON public.mptv_news FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_advertisements" ON public.mptv_advertisements FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_advertisements" ON public.mptv_advertisements FOR ALL USING (true);

CREATE POLICY "Allow public read mptv_schedules" ON public.mptv_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public write mptv_schedules" ON public.mptv_schedules FOR ALL USING (true);

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
