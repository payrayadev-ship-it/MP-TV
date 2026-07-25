import { youtubeRepository } from '../repositories/youtubeRepository';

export const youtubeService = {
  getStatus() {
    return youtubeRepository.getStatus();
  },
};
