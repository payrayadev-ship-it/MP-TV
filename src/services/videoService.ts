import { videoRepository } from '../repositories/videoRepository';
import { VideoItem } from '../types';

export const videoService = {
  getAll(): VideoItem[] {
    return videoRepository.getAll();
  },

  create(data: Partial<VideoItem>): VideoItem {
    const newVid: VideoItem = {
      id: `vid-${Date.now()}`,
      title: data.title || 'Video Baru Majalengka Post TV',
      description: data.description || 'Deskripsi liputan berita Majalengka Post TV.',
      category: data.category || 'Berita',
      tags: data.tags || ['Majalengka', 'Liputan'],
      durationSeconds: Number(data.durationSeconds) || 180,
      resolution: data.resolution || '1080p (FHD)',
      fileSizeMb: data.fileSizeMb || 125,
      videoUrl: data.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500',
      createdById: 'u-1',
      createdByName: 'Ahmad Faisal (Super Admin)',
      createdAt: new Date().toISOString(),
      playCount: 0,
    };
    return videoRepository.create(newVid);
  },
};
