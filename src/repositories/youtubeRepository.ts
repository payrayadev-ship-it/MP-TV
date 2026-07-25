import { getState } from '../lib/store';
import { YouTubeStreamStatus } from '../types';

export const youtubeRepository = {
  getStatus(): YouTubeStreamStatus {
    return getState().youtubeStatus;
  },
};
