import express from 'express';
import { GoogleGenAI } from '@google/genai';
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
} from './data/initialData';
import {
  ObsSettings,
  BreakingNews,
  RunningText,
  NewsArticle,
  VideoItem,
  Playlist,
  ScheduleItem,
  Advertisement,
  AiPresenterTask,
  User,
  AppSettings,
} from './types';

// In-Memory Database Store
export const state = {
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
  activeBreakingTimer: null as any,
};

// Lazy initialization for Gemini AI
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Dashboard Data Generator
export function getDashboardData() {
  const activePl = state.playlists.find((p) => p.id === state.activePlaylistId) || state.playlists[0];
  const currentItem = activePl?.items[state.activeVideoIndex];
  const currentVid = state.videos.find((v) => v.id === currentItem?.videoId) || state.videos[0];
  const activeBreaking = state.breakingNews.find((bn) => bn.active) || null;
  const activeRunningText = state.runningTexts.find((rt) => rt.active) || state.runningTexts[0];

  return {
    obsStatus: state.obsSettings,
    youtubeStatus: state.youtubeStatus,
    systemMetrics: {
      cpuPct: state.obsSettings.cpuUsage,
      ramPct: state.obsSettings.memoryUsage,
      diskPct: 24.5,
      bandwidthMbps: 18.5,
      internetStatus: 'Connected' as const,
      liveViewersCount: state.youtubeStatus.viewers,
    },
    currentScene: state.obsSettings.currentScene,
    currentProgram: 'Majalengka Post 24 Jam Digital Bulletin',
    currentPlaylistName: activePl ? activePl.name : 'N/A',
    currentVideoTitle: currentVid ? currentVid.title : 'N/A',
    currentVideoDurationSec: currentVid ? currentVid.durationSeconds : 180,
    videoCountdownSec: state.activeVideoCountdownSec,
    advertisementStatus: state.ads.some((a) => a.active) ? 'Aktif (Bank BJB Sponsor Slot)' : 'Non-Aktif',
    runningTextStatus: activeRunningText ? `Aktif: "${activeRunningText.text.substring(0, 45)}..."` : 'Non-Aktif',
    breakingNewsStatus: activeBreaking ? `ALERT: ${activeBreaking.title}` : 'Normal Broadcast State',
    activeBreakingNews: activeBreaking,
  };
}

export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to safely emit Socket.IO events if available
let socketIoEmitter: ((event: string, data?: any) => void) | null = null;
export function setSocketEmitter(emitter: (event: string, data?: any) => void) {
  socketIoEmitter = emitter;
}
function emitEvent(event: string, data?: any) {
  if (socketIoEmitter) socketIoEmitter(event, data);
}

// ==================== REST API ROUTES ====================

// GET /api/dashboard
app.get('/api/dashboard', (req, res) => {
  res.json({ success: true, data: getDashboardData() });
});

// GET /api/obs/status
app.get('/api/obs/status', (req, res) => {
  res.json({
    success: true,
    obs: state.obsSettings,
    scenes: state.scenes,
    audio: state.audioChannels,
  });
});

// POST /api/obs/connect
app.post('/api/obs/connect', (req, res) => {
  const { host, port, password } = req.body;
  if (host) state.obsSettings.host = host;
  if (port) state.obsSettings.port = Number(port);
  if (password !== undefined) state.obsSettings.password = password;
  state.obsSettings.connected = true;

  emitEvent('obs_connected', state.obsSettings);
  res.json({ success: true, message: 'OBS WebSocket terhubung sukses', obs: state.obsSettings });
});

// POST /api/obs/start-stream
app.post('/api/obs/start-stream', (req, res) => {
  state.obsSettings.isStreaming = true;
  emitEvent('obs_updated', state.obsSettings);
  res.json({ success: true, message: 'Siaran Live Streaming OBS Dimulai' });
});

// POST /api/obs/stop-stream
app.post('/api/obs/stop-stream', (req, res) => {
  state.obsSettings.isStreaming = false;
  emitEvent('obs_updated', state.obsSettings);
  res.json({ success: true, message: 'Siaran Live Streaming OBS Dihentikan' });
});

// POST /api/obs/emergency-stop
app.post('/api/obs/emergency-stop', (req, res) => {
  state.obsSettings.isStreaming = false;
  state.obsSettings.isRecording = false;
  state.obsSettings.currentScene = 'Commercial & Ad Block';
  state.breakingNews.forEach((bn) => (bn.active = false));

  emitEvent('obs_updated', state.obsSettings);
  emitEvent('emergency_stop_triggered', {
    timestamp: new Date().toISOString(),
    message: 'EMERGENCY STOP EXECUTED BY OPERATOR',
  });
  res.json({ success: true, message: 'EMERGENCY STOP: Siaran dihentikan secara darurat!' });
});

// POST /api/obs/change-scene
app.post('/api/obs/change-scene', (req, res) => {
  const { sceneName } = req.body;
  if (!sceneName) {
    return res.status(400).json({ success: false, error: 'sceneName diperlukan' });
  }
  state.obsSettings.currentScene = sceneName;
  state.scenes.forEach((sc) => {
    sc.isProgram = sc.name === sceneName;
  });

  emitEvent('scene_changed', { currentScene: sceneName, scenes: state.scenes });
  res.json({ success: true, message: `Scene OBS berpindah ke: ${sceneName}`, currentScene: sceneName });
});

// PLAYLIST ENDPOINTS
app.get('/api/playlist', (req, res) => {
  res.json({ success: true, data: state.playlists });
});

app.post('/api/playlist', (req, res) => {
  const newPl: Playlist = {
    id: `pl-${Date.now()}`,
    name: req.body.name || 'Playlist Baru Majalengka',
    category: req.body.category || 'Berita',
    repeat: req.body.repeat ?? true,
    shuffle: req.body.shuffle ?? false,
    totalDurationSeconds: 0,
    active: req.body.active ?? false,
    items: req.body.items || [],
  };
  state.playlists.push(newPl);
  res.json({ success: true, data: newPl });
});

app.put('/api/playlist', (req, res) => {
  const { id, name, repeat, shuffle, items, active } = req.body;
  const index = state.playlists.findIndex((p) => p.id === id);
  if (index !== -1) {
    if (name !== undefined) state.playlists[index].name = name;
    if (repeat !== undefined) state.playlists[index].repeat = repeat;
    if (shuffle !== undefined) state.playlists[index].shuffle = shuffle;
    if (items !== undefined) state.playlists[index].items = items;
    if (active !== undefined) {
      state.playlists[index].active = active;
      if (active) state.activePlaylistId = id;
    }
    return res.json({ success: true, data: state.playlists[index] });
  }
  res.status(404).json({ success: false, error: 'Playlist tidak ditemukan' });
});

app.delete('/api/playlist', (req, res) => {
  const id = (req.query.id as string) || req.body.id;
  state.playlists = state.playlists.filter((p) => p.id !== id);
  res.json({ success: true, message: 'Playlist berhasil dihapus' });
});

// RUNNING TEXT ENDPOINTS
app.get('/api/running-text', (req, res) => {
  res.json({ success: true, data: state.runningTexts });
});

app.post('/api/running-text', (req, res) => {
  const newRt: RunningText = {
    id: `rt-${Date.now()}`,
    text: req.body.text || 'Running text baru Majalengka Post TV',
    category: req.body.category || 'Berita',
    speed: req.body.speed || 'medium',
    fontSize: req.body.fontSize || 22,
    color: req.body.color || '#FFFFFF',
    backgroundColor: req.body.backgroundColor || '#D50000',
    position: req.body.position || 'bottom',
    active: req.body.active ?? true,
    autoSyncFromNews: req.body.autoSyncFromNews ?? true,
    createdAt: new Date().toISOString(),
  };
  state.runningTexts.unshift(newRt);
  emitEvent('running_text_updated', state.runningTexts);
  res.json({ success: true, data: newRt });
});

// BREAKING NEWS ENDPOINTS
app.get('/api/breaking-news', (req, res) => {
  res.json({ success: true, data: state.breakingNews });
});

app.post('/api/breaking-news', (req, res) => {
  const { title, content, priority, durationSeconds, autoTriggerObs } = req.body;
  const newBn: BreakingNews = {
    id: `bn-${Date.now()}`,
    title: title || 'BREAKING NEWS MAJALENGKA POST',
    content: content || 'Informasi penting terkini dari wilayah Kabupaten Majalengka.',
    priority: priority || 'Emergency',
    durationSeconds: durationSeconds || 20,
    active: true,
    publishedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    autoTriggerObs: autoTriggerObs ?? true,
  };

  state.breakingNews.forEach((bn) => (bn.active = false));
  state.breakingNews.unshift(newBn);

  if (newBn.autoTriggerObs) {
    state.previousSceneBeforeBreaking = state.obsSettings.currentScene;
    state.obsSettings.currentScene = 'Breaking News Overlay';
    state.scenes.forEach((sc) => (sc.isProgram = sc.name === 'Breaking News Overlay'));

    emitEvent('breaking_news_triggered', {
      breakingNews: newBn,
      currentScene: 'Breaking News Overlay',
    });

    if (state.activeBreakingTimer) clearTimeout(state.activeBreakingTimer);
    state.activeBreakingTimer = setTimeout(() => {
      newBn.active = false;
      state.obsSettings.currentScene = state.previousSceneBeforeBreaking;
      state.scenes.forEach((sc) => (sc.isProgram = sc.name === state.previousSceneBeforeBreaking));
      emitEvent('breaking_news_ended', {
        currentScene: state.previousSceneBeforeBreaking,
      });
    }, newBn.durationSeconds * 1000);
  }

  res.json({ success: true, data: newBn, message: 'Breaking News Diterbitkan & OBS Switched' });
});

// VIDEOS ENDPOINTS
app.get('/api/videos', (req, res) => {
  res.json({ success: true, data: state.videos });
});

app.post('/api/upload-video', (req, res) => {
  const { title, description, category, tags, durationSeconds, videoUrl, thumbnailUrl } = req.body;
  const newVid: VideoItem = {
    id: `vid-${Date.now()}`,
    title: title || 'Video Baru Majalengka Post TV',
    description: description || 'Deskripsi video siaran TV digital.',
    category: category || 'Berita',
    tags: tags || ['Majalengka', 'TV'],
    durationSeconds: Number(durationSeconds) || 180,
    resolution: '1920x1080 (FHD)',
    fileSizeMb: 120,
    videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600',
    createdById: 'u-1',
    createdByName: 'Ahmad Faisal',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    playCount: 0,
  };
  state.videos.unshift(newVid);

  const activePl = state.playlists.find((p) => p.active) || state.playlists[0];
  if (activePl) {
    activePl.items.push({
      id: `pli-${Date.now()}`,
      playlistId: activePl.id,
      videoId: newVid.id,
      order: activePl.items.length + 1,
      autoNext: true,
    });
  }

  res.json({ success: true, data: newVid, message: 'Video berhasil diupload & ditambahkan ke Playlist' });
});

// NEWS ENDPOINT
app.get('/api/news', (req, res) => {
  res.json({ success: true, data: state.news });
});

app.post('/api/news', (req, res) => {
  const { title, content, category, author, isBreaking, status } = req.body;
  const newArticle: NewsArticle = {
    id: `news-${Date.now()}`,
    title,
    content,
    category: category || 'Berita',
    author: author || 'Reporter TV',
    isBreaking: !!isBreaking,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: status || 'Published',
  };
  state.news.unshift(newArticle);

  if (newArticle.status === 'Published') {
    const autoRtText = `BERITA TERBARU: ${newArticle.title} — ${newArticle.content.substring(0, 80)}...`;
    state.runningTexts.unshift({
      id: `rt-${Date.now()}`,
      text: autoRtText,
      category: newArticle.category,
      speed: 'medium',
      fontSize: 22,
      color: '#FFFFFF',
      backgroundColor: '#D50000',
      position: 'bottom',
      active: true,
      autoSyncFromNews: true,
      createdAt: new Date().toISOString(),
    });
  }

  if (newArticle.isBreaking) {
    const autoBn: BreakingNews = {
      id: `bn-${Date.now()}`,
      title: `BREAKING NEWS: ${newArticle.title}`,
      content: newArticle.content,
      priority: 'Emergency',
      durationSeconds: 15,
      active: true,
      publishedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      autoTriggerObs: true,
    };
    state.breakingNews.unshift(autoBn);

    state.previousSceneBeforeBreaking = state.obsSettings.currentScene;
    state.obsSettings.currentScene = 'Breaking News Overlay';
    state.scenes.forEach((sc) => (sc.isProgram = sc.name === 'Breaking News Overlay'));

    emitEvent('breaking_news_triggered', {
      breakingNews: autoBn,
      currentScene: 'Breaking News Overlay',
    });

    if (state.activeBreakingTimer) clearTimeout(state.activeBreakingTimer);
    state.activeBreakingTimer = setTimeout(() => {
      autoBn.active = false;
      state.obsSettings.currentScene = state.previousSceneBeforeBreaking;
      state.scenes.forEach((sc) => (sc.isProgram = sc.name === state.previousSceneBeforeBreaking));
      emitEvent('breaking_news_ended', { currentScene: state.previousSceneBeforeBreaking });
    }, 15000);
  }

  res.json({ success: true, data: newArticle });
});

// AI PRESENTER ENDPOINT WITH GEMINI INTEGRATION
app.get('/api/ai-presenter', (req, res) => {
  res.json({ success: true, data: state.aiPresenterTasks });
});

app.post('/api/ai-presenter/generate', async (req, res) => {
  const { newsTitle, newsContent, voiceGender, autoAddToPlaylistId } = req.body;

  const newTask: AiPresenterTask = {
    id: `ai-${Date.now()}`,
    newsTitle: newsTitle || 'Berita Terkini Majalengka',
    scriptText: 'Sedang memproses naskah berita...',
    voiceGender: voiceGender || 'female',
    status: 'Generating Script',
    progress: 25,
    autoAddToPlaylistId: autoAddToPlaylistId || 'pl-1',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  state.aiPresenterTasks.unshift(newTask);

  try {
    const genAI = getGenAI();
    let generatedScript = '';

    if (genAI) {
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Anda adalah Anchor TV Profesional dari Majalengka Post TV.
Tuliskan naskah pembacaan berita siaran TV digital yang formal, energik, dan jelas dalam Bahasa Indonesia berdasarkan berita berikut:
Judul: ${newsTitle}
Isi: ${newsContent}

Format output: Berikan naskah lengkap siap baca dengan sapaan khas Majalengka Post TV (0.5 - 1 menit durasi baca).`,
      });
      generatedScript = response.text || '';
    } else {
      generatedScript = `Selamat pagi pemirsa Majalengka Post TV. Saya Anchor AI membawa informasi terbaru untuk Anda. ${newsTitle}. ${newsContent}. Terima kasih telah menyaksikan Majalengka Post TV 24 Jam.`;
    }

    newTask.scriptText = generatedScript;
    newTask.status = 'Synthesizing Voice';
    newTask.progress = 60;

    setTimeout(() => {
      newTask.status = 'Completed';
      newTask.progress = 100;
      newTask.generatedVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

      const newVid: VideoItem = {
        id: `vid-ai-${Date.now()}`,
        title: `[AI PRESENTER] ${newsTitle}`,
        description: generatedScript,
        category: 'Berita',
        tags: ['AI Presenter', 'Majalengka', 'Autogenerated'],
        durationSeconds: 120,
        resolution: '1920x1080 (FHD)',
        fileSizeMb: 95,
        videoUrl: newTask.generatedVideoUrl,
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
        createdById: 'u-1',
        createdByName: 'AI Presenter Engine',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        playCount: 1,
      };
      state.videos.unshift(newVid);

      const targetPl = state.playlists.find((p) => p.id === newTask.autoAddToPlaylistId) || state.playlists[0];
      if (targetPl) {
        targetPl.items.unshift({
          id: `pli-${Date.now()}`,
          playlistId: targetPl.id,
          videoId: newVid.id,
          order: 1,
          autoNext: true,
        });
      }

      emitEvent('ai_presenter_completed', newTask);
    }, 3000);

    res.json({ success: true, data: newTask, message: 'AI Presenter berhasil memproses berita' });
  } catch (err: any) {
    console.error('Gemini AI Presenter Error:', err);
    newTask.status = 'Error';
    res.status(500).json({ success: false, error: err.message || 'Gagal generate AI Presenter' });
  }
});

// SCHEDULES ENDPOINTS
app.get('/api/schedules', (req, res) => {
  res.json({ success: true, data: state.schedules });
});

app.post('/api/schedules', (req, res) => {
  const newSch: ScheduleItem = {
    id: `sch-${Date.now()}`,
    programTitle: req.body.programTitle || 'Program Siaran Majalengka TV',
    playlistId: req.body.playlistId,
    obsSceneId: req.body.obsSceneId || 'sc-1',
    date: req.body.date || '2026-07-25',
    startTime: req.body.startTime || '12:00',
    endTime: req.body.endTime || '13:00',
    recurring: req.body.recurring || 'Daily',
    active: true,
    category: req.body.category || 'Berita',
  };
  state.schedules.push(newSch);
  res.json({ success: true, data: newSch });
});

// ADVERTISEMENT ENDPOINTS
app.get('/api/ads', (req, res) => {
  res.json({ success: true, data: state.ads });
});

app.post('/api/ads', (req, res) => {
  const newAd: Advertisement = {
    id: `ad-${Date.now()}`,
    title: req.body.title || 'Iklan Sponsor Baru',
    sponsorName: req.body.sponsorName || 'Sponsor Majalengka',
    type: req.body.type || 'video',
    mediaUrl: req.body.mediaUrl || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=600',
    durationSeconds: Number(req.body.durationSeconds) || 30,
    scheduleTime: req.body.scheduleTime || '12:00',
    impressionsCount: 0,
    targetImpressions: Number(req.body.targetImpressions) || 10000,
    active: true,
  };
  state.ads.unshift(newAd);
  res.json({ success: true, data: newAd });
});

// WEATHER ENDPOINT
app.get('/api/weather', (req, res) => {
  res.json({ success: true, data: state.weather, lastSync: new Date().toISOString() });
});

// YOUTUBE LIVE ENDPOINT
app.get('/api/youtube', (req, res) => {
  res.json({ success: true, data: state.youtubeStatus });
});

// USERS & ROLES ENDPOINTS
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: state.users });
});

app.post('/api/users', (req, res) => {
  const newUser: User = {
    id: `u-${Date.now()}`,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || 'Operator',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    active: true,
    lastActive: 'Baru ditambahkan',
  };
  state.users.push(newUser);
  res.json({ success: true, data: newUser });
});

// SETTINGS ENDPOINTS
app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: state.settings });
});

app.post('/api/settings', (req, res) => {
  state.settings = { ...state.settings, ...req.body };
  res.json({ success: true, data: state.settings, message: 'Pengaturan berhasil disimpan' });
});

// ANALYTICS ENDPOINT
app.get('/api/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      viewerHistory: [
        { time: '00:00', viewers: 420 },
        { time: '03:00', viewers: 280 },
        { time: '06:00', viewers: 1150 },
        { time: '09:00', viewers: 1845 },
        { time: '12:00', viewers: 2410 },
        { time: '15:00', viewers: 1980 },
        { time: '18:00', viewers: 2950 },
        { time: '21:00', viewers: 1620 },
      ],
      categoryShare: [
        { name: 'Berita', percentage: 40 },
        { name: 'Wisata', percentage: 20 },
        { name: 'Kuliner', percentage: 15 },
        { name: 'Pemerintah', percentage: 15 },
        { name: 'Iklan/Sponsor', percentage: 10 },
      ],
      systemPerformance: [
        { time: '08:00', cpu: 14, ram: 38, bandwidth: 15 },
        { time: '08:30', cpu: 18, ram: 42, bandwidth: 18 },
        { time: '09:00', cpu: 22, ram: 45, bandwidth: 22 },
        { time: '09:30', cpu: 18, ram: 42, bandwidth: 18 },
      ],
    },
  });
});
