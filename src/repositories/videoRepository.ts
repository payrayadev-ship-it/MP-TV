import { getState } from '../lib/store';
import { VideoItem } from '../types';

export const videoRepository = {
  getAll(): VideoItem[] {
    return getState().videos;
  },

  create(video: VideoItem): VideoItem {
    getState().videos.unshift(video);
    return video;
  },
};
