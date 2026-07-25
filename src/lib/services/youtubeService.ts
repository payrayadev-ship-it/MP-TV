import { getState } from '../store';

export const youtubeService = {
  getStatus() {
    return getState().youtubeStatus;
  },
};
