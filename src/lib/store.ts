import {
  initialUsers,
  initialObsSettings,
  initialScenes,
  initialAudioChannels,
  initialVideos,
  initialPlaylists,
  initialSchedules,
  initialBreakingNews,
  initialRunningTexts,
  initialNews,
  initialAds,
  initialYouTubeStatus,
  initialAiPresenterTasks,
  initialWeatherData,
  initialAppSettings,
} from '../data/initialData';
import {
  User,
  ObsSettings,
  ObsScene,
  ObsAudioChannel,
  VideoItem,
  Playlist,
  ScheduleItem,
  BreakingNews,
  RunningText,
  NewsArticle,
  Advertisement,
  YouTubeStreamStatus,
  AiPresenterTask,
  WeatherData,
  AppSettings,
} from '../types';

export interface StateStore {
  users: User[];
  obsSettings: ObsSettings;
  scenes: ObsScene[];
  audioChannels: ObsAudioChannel[];
  videos: VideoItem[];
  playlists: Playlist[];
  schedules: ScheduleItem[];
  breakingNews: BreakingNews[];
  runningTexts: RunningText[];
  news: NewsArticle[];
  ads: Advertisement[];
  youtubeStatus: YouTubeStreamStatus;
  aiPresenterTasks: AiPresenterTask[];
  weather: WeatherData[];
  settings: AppSettings;
  activeVideoIndex: number;
  activeVideoCountdownSec: number;
  activePlaylistId: string;
  previousSceneBeforeBreaking: string;
}

// Global store singleton for warm serverless invocations & local dev runtime
const globalStore: StateStore = {
  users: [...initialUsers],
  obsSettings: { ...initialObsSettings },
  scenes: [...initialScenes],
  audioChannels: [...initialAudioChannels],
  videos: [...initialVideos],
  playlists: [...initialPlaylists],
  schedules: [...initialSchedules],
  breakingNews: [...initialBreakingNews],
  runningTexts: [...initialRunningTexts],
  news: [...initialNews],
  ads: [...initialAds],
  youtubeStatus: { ...initialYouTubeStatus },
  aiPresenterTasks: [...initialAiPresenterTasks],
  weather: [...initialWeatherData],
  settings: { ...initialAppSettings },
  activeVideoIndex: 0,
  activeVideoCountdownSec: 320,
  activePlaylistId: 'pl-1',
  previousSceneBeforeBreaking: 'Studio Utama - Newscast',
};

export const getState = (): StateStore => globalStore;

export const getDashboardData = () => {
  const store = getState();
  const activePl = store.playlists?.find((p) => p.id === store.activePlaylistId) || store.playlists?.[0];
  const currentItem = activePl?.items?.[store.activeVideoIndex];
  const currentVid = store.videos?.find((v) => v.id === currentItem?.videoId) || store.videos?.[0];
  const activeBreaking = store.breakingNews?.find((bn) => bn.active) || null;
  const activeRunningText = store.runningTexts?.find((rt) => rt.active) || store.runningTexts?.[0];

  return {
    obsStatus: store.obsSettings,
    youtubeStatus: store.youtubeStatus,
    systemMetrics: {
      cpuPct: store.obsSettings.cpuUsage,
      ramPct: store.obsSettings.memoryUsage,
      diskPct: 24.5,
      bandwidthMbps: 18.5,
      internetStatus: 'Connected' as const,
      liveViewersCount: store.youtubeStatus.viewers,
    },
    currentScene: store.obsSettings.currentScene,
    currentProgram: 'Majalengka Post 24 Jam Digital Bulletin',
    currentPlaylistName: activePl ? activePl.name : 'N/A',
    currentVideoTitle: currentVid ? currentVid.title : 'N/A',
    currentVideoDurationSec: currentVid ? currentVid.durationSeconds : 180,
    videoCountdownSec: store.activeVideoCountdownSec,
    advertisementStatus: store.ads.some((a) => a.active) ? 'Aktif (Bank BJB Sponsor Slot)' : 'Non-Aktif',
    runningTextStatus: activeRunningText ? `Aktif: "${activeRunningText.text.substring(0, 45)}..."` : 'Non-Aktif',
    breakingNewsStatus: activeBreaking ? `ALERT: ${activeBreaking.title}` : 'Normal Broadcast State',
    activeBreakingNews: activeBreaking,
  };
};
