export type UserRole = 'Super Admin' | 'Admin TV' | 'Editor' | 'Reporter' | 'Operator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  active: boolean;
  lastActive?: string;
}

export interface ObsSettings {
  host: string;
  port: number;
  password?: string;
  autoConnect: boolean;
  connected: boolean;
  isStreaming: boolean;
  isRecording: boolean;
  isPausedRecording: boolean;
  virtualCamActive: boolean;
  currentScene: string;
  previewScene: string;
  transition: string;
  transitionDuration: number;
  fps: number;
  cpuUsage: number;
  memoryUsage: number;
  diskSpaceFreeGb: number;
}

export interface ObsScene {
  id: string;
  name: string;
  thumbnail: string;
  sources: ObsSource[];
  isProgram: boolean;
  isPreview: boolean;
}

export interface ObsSource {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'image' | 'browser' | 'camera';
  enabled: boolean;
  muted?: boolean;
  volume?: number; // 0 - 100
}

export interface ObsAudioChannel {
  id: string;
  name: string;
  volume: number; // 0 to 100
  muted: boolean;
  dbPeak: number; // -60 to 0
}

export type VideoCategory =
  | 'Berita'
  | 'Talkshow'
  | 'Podcast'
  | 'Wisata'
  | 'Kuliner'
  | 'Pemerintah'
  | 'DPRD'
  | 'Polres'
  | 'Kodim'
  | 'UMKM'
  | 'Iklan'
  | 'Video Lokal'
  | 'Video Nasional';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  tags: string[];
  durationSeconds: number;
  resolution: string;
  fileSizeMb: number;
  videoUrl: string;
  thumbnailUrl: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  playCount: number;
}

export interface PlaylistItem {
  id: string;
  playlistId: string;
  videoId: string;
  video?: VideoItem;
  order: number;
  autoNext: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  category: VideoCategory;
  items: PlaylistItem[];
  repeat: boolean;
  shuffle: boolean;
  totalDurationSeconds: number;
  active: boolean;
}

export interface ScheduleItem {
  id: string;
  programTitle: string;
  playlistId?: string;
  obsSceneId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  recurring: 'None' | 'Daily' | 'Weekly' | 'Monthly';
  active: boolean;
  category: VideoCategory;
}

export interface BreakingNews {
  id: string;
  title: string;
  content: string;
  priority: 'High' | 'Emergency' | 'Normal';
  durationSeconds: number;
  active: boolean;
  publishedAt: string;
  autoTriggerObs: boolean;
}

export interface RunningText {
  id: string;
  text: string;
  category: string;
  speed: 'slow' | 'medium' | 'fast';
  fontSize: number; // in px
  color: string;
  backgroundColor: string;
  position: 'bottom' | 'top';
  active: boolean;
  autoSyncFromNews: boolean;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: VideoCategory;
  author: string;
  isBreaking: boolean;
  createdAt: string;
  status: 'Draft' | 'Published' | 'Archived';
}

export interface Advertisement {
  id: string;
  title: string;
  sponsorName: string;
  type: 'video' | 'banner';
  mediaUrl: string;
  durationSeconds: number;
  scheduleTime: string; // HH:mm
  impressionsCount: number;
  targetImpressions: number;
  active: boolean;
}

export interface YouTubeStreamStatus {
  isLive: boolean;
  title: string;
  viewers: number;
  likes: number;
  thumbnailUrl: string;
  chatMessages: YouTubeChatMessage[];
}

export interface YouTubeChatMessage {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  isModerator?: boolean;
}

export interface AiPresenterTask {
  id: string;
  newsId?: string;
  newsTitle: string;
  scriptText: string;
  voiceGender: 'male' | 'female';
  status: 'Idle' | 'Generating Script' | 'Synthesizing Voice' | 'Rendering Video' | 'Completed' | 'Error';
  progress: number; // 0 - 100
  generatedVideoUrl?: string;
  autoAddToPlaylistId?: string;
  createdAt: string;
}

export interface WeatherData {
  region: 'Majalengka' | 'Jatiwangi' | 'Kadipaten' | 'Kertajati' | 'Cikijing' | 'Rajagaluh';
  tempCelsius: number;
  condition: string;
  humidityPct: number;
  windSpeedKmh: number;
  lastUpdated: string;
  icon: string;
}

export interface SystemMetrics {
  cpuPct: number;
  ramPct: number;
  diskPct: number;
  bandwidthMbps: number;
  internetStatus: 'Connected' | 'Degraded' | 'Offline';
  liveViewersCount: number;
}

export interface DashboardStatus {
  obsStatus: ObsSettings;
  youtubeStatus: YouTubeStreamStatus;
  systemMetrics: SystemMetrics;
  currentScene: string;
  currentProgram: string;
  currentPlaylistName: string;
  currentVideoTitle: string;
  currentVideoDurationSec: number;
  videoCountdownSec: number;
  advertisementStatus: string;
  runningTextStatus: string;
  breakingNewsStatus: string;
  activeBreakingNews?: BreakingNews | null;
}

export interface AppSettings {
  obsHost: string;
  obsPort: number;
  obsPassword?: string;
  youtubeStreamKey: string;
  youtubeApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  storageBucket: string;
  smtpServer: string;
  smtpPort: number;
  smtpUser: string;
  tvLogoUrl: string;
  sponsorWatermarkUrl: string;
  theme: 'Dark Broadcast' | 'Glass Red' | 'Obsidian Matrix';
  tickerDefaultSpeed: string;
}
