-- ====================================================================
-- MAJALENGKA POST TV (MPTV) BROADCAST AUTOMATION - COMPLETE SUPABASE MIGRATION SCRIPT
-- PostgreSQL / Supabase Schema with Foreign Keys, Indexes, Audit Triggers & RLS
-- ====================================================================

-- Enable UUID extension if required
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & OPERATORS TABLE
CREATE TABLE IF NOT EXISTS public.mptv_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Operator', -- 'Admin', 'Producer', 'Operator', 'Viewer'
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
  speed TEXT DEFAULT 'medium', -- 'slow', 'medium', 'fast'
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
  priority TEXT DEFAULT 'Emergency', -- 'Emergency', 'Urgent', 'Standard'
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
  status TEXT DEFAULT 'Published', -- 'Draft', 'Published', 'Archived'
  views_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ADVERTISEMENTS & SPONSOR SLOTS TABLE
CREATE TABLE IF NOT EXISTS public.mptv_advertisements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sponsor_name TEXT NOT NULL,
  ad_type TEXT DEFAULT 'video', -- 'video', 'banner', 'overlay'
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

-- ====================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_mptv_news_published_at ON public.mptv_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_mptv_news_category ON public.mptv_news(category);
CREATE INDEX IF NOT EXISTS idx_mptv_videos_category ON public.mptv_videos(category);
CREATE INDEX IF NOT EXISTS idx_mptv_playlist_items_playlist ON public.mptv_playlist_items(playlist_id, item_order);
CREATE INDEX IF NOT EXISTS idx_mptv_schedules_date_time ON public.mptv_schedules(schedule_date, start_time);
CREATE INDEX IF NOT EXISTS idx_mptv_logs_timestamp ON public.mptv_logs(timestamp DESC);

-- ====================================================================
-- AUTOMATIC AUDIT LOGGING TRIGGERS
-- ====================================================================

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

-- Apply Triggers
DROP TRIGGER IF EXISTS trg_log_news_changes ON public.mptv_news;
CREATE TRIGGER trg_log_news_changes
AFTER INSERT OR UPDATE OR DELETE ON public.mptv_news
FOR EACH ROW EXECUTE FUNCTION public.fn_log_mptv_activity();

DROP TRIGGER IF EXISTS trg_log_obs_changes ON public.mptv_obs_settings;
CREATE TRIGGER trg_log_obs_changes
AFTER INSERT OR UPDATE ON public.mptv_obs_settings
FOR EACH ROW EXECUTE FUNCTION public.fn_log_mptv_activity();

DROP TRIGGER IF EXISTS trg_log_breaking_news_changes ON public.mptv_breaking_news;
CREATE TRIGGER trg_log_breaking_news_changes
AFTER INSERT OR UPDATE ON public.mptv_breaking_news
FOR EACH ROW EXECUTE FUNCTION public.fn_log_mptv_activity();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ====================================================================

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

-- Allow Public Read & Write Policies for Studio Control Room Operators
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

-- ====================================================================
-- INITIAL SEED DATA (MAJALENGKA POST TV INITIAL STATE)
-- ====================================================================

INSERT INTO public.mptv_users (id, name, email, role, avatar_url)
VALUES
('u-1', 'Ahmad Faisal', 'ahmad.faisal@majalengkapost.tv', 'Producer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('u-2', 'Siti Rahmawati', 'siti.rahmawati@majalengkapost.tv', 'Operator', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.mptv_news (id, title, category, content, author, views_count, featured)
VALUES
('news-1', 'Pemkab Majalengka Resmikan Pusat Kebudayaan Sunda', 'Pemerintah', 'Pemerintah Kabupaten Majalengka resmi membuka gedung pusat kebudayaan Sunda baru untuk mendorong pariwisata daerah.', 'Ahmad Faisal', 1240, true),
('news-2', 'Festival Kuliner Khas Majalengka Sedot Ribuan Pengunjung', 'Kuliner', 'Ribuan warga memadati alun-alun Majalengka dalam gelaran festival kuliner khas daerah seperti Jalakotek dan Lengko.', 'Siti Rahmawati', 890, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.mptv_obs_settings (id, is_streaming, is_recording, current_scene, fps, cpu_usage, memory_usage)
VALUES ('current', true, true, 'Studio Utama', 60, 14.2, 38.5)
ON CONFLICT (id) DO NOTHING;
