import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DashboardStatus,
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

interface BroadcastContextType {
  dashboard: DashboardStatus | null;
  obsSettings: ObsSettings | null;
  scenes: ObsScene[];
  audioChannels: ObsAudioChannel[];
  videos: VideoItem[];
  playlists: Playlist[];
  schedules: ScheduleItem[];
  breakingNewsList: BreakingNews[];
  runningTexts: RunningText[];
  newsList: NewsArticle[];
  ads: Advertisement[];
  youtubeStatus: YouTubeStreamStatus | null;
  aiTasks: AiPresenterTask[];
  weatherList: WeatherData[];
  settings: AppSettings | null;
  isConnected: boolean;
  // Actions
  connectObs: (host: string, port: number, password?: string) => Promise<void>;
  toggleStream: (start: boolean) => Promise<void>;
  changeScene: (sceneName: string) => Promise<void>;
  publishBreakingNews: (data: Partial<BreakingNews>) => Promise<void>;
  addRunningText: (data: Partial<RunningText>) => Promise<void>;
  uploadVideo: (data: Partial<VideoItem>) => Promise<void>;
  publishNews: (data: Partial<NewsArticle>) => Promise<void>;
  generateAiPresenter: (newsTitle: string, newsContent: string, voiceGender: 'male' | 'female') => Promise<void>;
  emergencyStop: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const BroadcastContext = createContext<BroadcastContextType | undefined>(undefined);

export const BroadcastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  const [dashboard, setDashboard] = useState<DashboardStatus | null>(null);
  const [obsSettings, setObsSettings] = useState<ObsSettings | null>(null);
  const [scenes, setScenes] = useState<ObsScene[]>([]);
  const [audioChannels, setAudioChannels] = useState<ObsAudioChannel[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [breakingNewsList, setBreakingNewsList] = useState<BreakingNews[]>([]);
  const [runningTexts, setRunningTexts] = useState<RunningText[]>([]);
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [youtubeStatus, setYoutubeStatus] = useState<YouTubeStreamStatus | null>(null);
  const [aiTasks, setAiTasks] = useState<AiPresenterTask[]>([]);
  const [weatherList, setWeatherList] = useState<WeatherData[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const safeFetchJson = async (url: string) => {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        console.warn(`[BroadcastContext] API ${url} returned status ${res.status}`);
        return { success: false };
      }
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (jsonErr) {
        console.warn(`[BroadcastContext] API ${url} did not return valid JSON:`, text.substring(0, 100));
        return { success: false };
      }
    } catch (err) {
      console.warn(`[BroadcastContext] Network error fetching ${url}:`, err);
      return { success: false };
    }
  };

  const refreshData = async () => {
    try {
      const [dashRes, obsRes, vidRes, plRes, schRes, bnRes, rtRes, newsRes, adRes, ytRes, aiRes, wRes, setRes] =
        await Promise.all([
          safeFetchJson('/api/dashboard'),
          safeFetchJson('/api/obs/status'),
          safeFetchJson('/api/videos'),
          safeFetchJson('/api/playlist'),
          safeFetchJson('/api/schedules'),
          safeFetchJson('/api/breaking-news'),
          safeFetchJson('/api/running-text'),
          safeFetchJson('/api/news'),
          safeFetchJson('/api/ads'),
          safeFetchJson('/api/youtube'),
          safeFetchJson('/api/ai-presenter'),
          safeFetchJson('/api/weather'),
          safeFetchJson('/api/settings'),
        ]);

      if (dashRes.success) setDashboard(dashRes.data);
      if (obsRes.success) {
        setObsSettings(obsRes.obs);
        setScenes(obsRes.scenes);
        setAudioChannels(obsRes.audio);
      }
      if (vidRes.success) setVideos(vidRes.data);
      if (plRes.success) setPlaylists(plRes.data);
      if (schRes.success) setSchedules(schRes.data);
      if (bnRes.success) setBreakingNewsList(bnRes.data);
      if (rtRes.success) setRunningTexts(rtRes.data);
      if (newsRes.success) setNewsList(newsRes.data);
      if (adRes.success) setAds(adRes.data);
      if (ytRes.success) setYoutubeStatus(ytRes.data);
      if (aiRes.success) setAiTasks(aiRes.data);
      if (wRes.success) setWeatherList(wRes.data);
      if (setRes.success) setSettings(setRes.data);
    } catch (e) {
      console.error('Failed to refresh broadcast context data:', e);
    }
  };

  useEffect(() => {
    refreshData().then(() => setIsConnected(true)).catch(() => setIsConnected(false));

    // Auto-refresh interval for Vercel Serverless environment
    const interval = setInterval(() => {
      refreshData().then(() => setIsConnected(true)).catch(() => setIsConnected(false));
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const connectObs = async (host: string, port: number, password?: string) => {
    await fetch('/api/obs/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, port, password }),
    });
    refreshData();
  };

  const toggleStream = async (start: boolean) => {
    const endpoint = start ? '/api/obs/start-stream' : '/api/obs/stop-stream';
    await fetch(endpoint, { method: 'POST' });
    refreshData();
  };

  const changeScene = async (sceneName: string) => {
    await fetch('/api/obs/change-scene', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sceneName }),
    });
    refreshData();
  };

  const publishBreakingNews = async (data: Partial<BreakingNews>) => {
    await fetch('/api/breaking-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    refreshData();
  };

  const addRunningText = async (data: Partial<RunningText>) => {
    await fetch('/api/running-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    refreshData();
  };

  const uploadVideo = async (data: Partial<VideoItem>) => {
    await fetch('/api/upload-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    refreshData();
  };

  const publishNews = async (data: Partial<NewsArticle>) => {
    await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    refreshData();
  };

  const generateAiPresenter = async (newsTitle: string, newsContent: string, voiceGender: 'male' | 'female') => {
    await fetch('/api/ai-presenter/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsTitle, newsContent, voiceGender }),
    });
    refreshData();
  };

  const emergencyStop = async () => {
    try {
      await fetch('/api/obs/emergency-stop', { method: 'POST' });
    } catch {
      await toggleStream(false);
    }
    refreshData();
  };

  return (
    <BroadcastContext.Provider
      value={{
        dashboard,
        obsSettings,
        scenes,
        audioChannels,
        videos,
        playlists,
        schedules,
        breakingNewsList,
        runningTexts,
        newsList,
        ads,
        youtubeStatus,
        aiTasks,
        weatherList,
        settings,
        isConnected,
        connectObs,
        toggleStream,
        changeScene,
        publishBreakingNews,
        addRunningText,
        uploadVideo,
        publishNews,
        generateAiPresenter,
        emergencyStop,
        refreshData,
      }}
    >
      {children}
    </BroadcastContext.Provider>
  );
};

export const useBroadcast = () => {
  const context = useContext(BroadcastContext);
  if (!context) {
    throw new Error('useBroadcast must be used within a BroadcastProvider');
  }
  return context;
};
