import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { app, state, getDashboardData, setSocketEmitter } from './src/serverApp';

async function startServer() {
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: '*' },
  });

  // Connect socket emitter to Express app handlers
  setSocketEmitter((event, data) => io.emit(event, data));

  // Socket.IO connection
  io.on('connection', (socket) => {
    console.log('[Socket.IO] Client connected:', socket.id);
    socket.emit('dashboard_update', getDashboardData());

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Client disconnected:', socket.id);
    });
  });

  // Background ticker (Simulates 24-hour TV Control Room execution)
  setInterval(() => {
    // 1. CPU / RAM Fluctuation
    state.obsSettings.cpuUsage = +(15 + Math.random() * 8).toFixed(1);
    state.obsSettings.memoryUsage = +(40 + Math.random() * 5).toFixed(1);

    // 2. Viewer Count Fluctuation
    const viewerDelta = Math.floor(Math.random() * 11) - 5;
    state.youtubeStatus.viewers = Math.max(100, state.youtubeStatus.viewers + viewerDelta);

    // 3. Video Playback Countdown
    if (state.obsSettings.isStreaming && state.activeVideoCountdownSec > 0) {
      state.activeVideoCountdownSec -= 1;
      if (state.activeVideoCountdownSec <= 0) {
        const currentPl = state.playlists.find((p) => p.id === state.activePlaylistId) || state.playlists[0];
        if (currentPl && currentPl.items.length > 0) {
          state.activeVideoIndex = (state.activeVideoIndex + 1) % currentPl.items.length;
          const nextItem = currentPl.items[state.activeVideoIndex];
          const nextVid = state.videos.find((v) => v.id === nextItem.videoId);
          state.activeVideoCountdownSec = nextVid ? nextVid.durationSeconds : 180;
        } else {
          state.activeVideoCountdownSec = 180;
        }
      }
    }

    // Broadcast Realtime Tick
    io.emit('dashboard_update', getDashboardData());
  }, 1000);

  // Vite middleware for dev or Static serve for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(expressStaticMiddleware(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Majalengka Post TV Automation Server] Running on http://0.0.0.0:${PORT}`);
  });
}

function expressStaticMiddleware(distPath: string) {
  const expressModule = require('express');
  return expressModule.static(distPath);
}

startServer();
