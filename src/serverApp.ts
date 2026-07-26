import express from 'express';
import cors from 'cors';

import articlesRouter from './routes/articles';
import authRouter from './routes/auth';
import categoryRouter from './routes/category';
import uploadRouter from './routes/upload';
import dashboardRouter from './routes/dashboard';
import seoRouter from './routes/seo';
import newsDigestRouter from './routes/newsDigest';
import usersRouter from './routes/users';
import adsRouter from './routes/ads';
import analyticsRouter from './routes/analytics';
import breakingNewsRouter from './routes/breakingNews';
import obsRouter from './routes/obs';
import playlistRouter from './routes/playlist';
import runningTextRouter from './routes/runningText';
import schedulesRouter from './routes/schedules';
import settingsRouter from './routes/settings';
import videosRouter from './routes/videos';
import weatherRouter from './routes/weather';
import youtubeRouter from './routes/youtube';

import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'MPTV Automation Server API is running on single serverless function',
    timestamp: new Date().toISOString(),
  });
});

// Register Routes
app.use('/api/articles', articlesRouter);
app.use('/api/news', articlesRouter);
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/upload-video', uploadRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/seo', seoRouter);
app.use('/api/news-digest', newsDigestRouter);
app.use('/api/ai-presenter', newsDigestRouter);
app.use('/api/users', usersRouter);
app.use('/api/ads', adsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/breaking-news', breakingNewsRouter);
app.use('/api/obs', obsRouter);
app.use('/api/playlist', playlistRouter);
app.use('/api/running-text', runningTextRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/videos', videosRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/youtube', youtubeRouter);

// Centralized Error Handler
app.use(errorHandler);

export default app;
