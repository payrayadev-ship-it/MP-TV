import { adsRepository } from '../repositories/adsRepository';
import { Advertisement } from '../types';

export const adsService = {
  getAll(): Advertisement[] {
    return adsRepository.getAll();
  },

  create(data: Partial<Advertisement>): Advertisement {
    const newAd: Advertisement = {
      id: `ad-${Date.now()}`,
      title: data.title || 'Iklan Sponsor Baru',
      sponsorName: data.sponsorName || 'Sponsor Pemkab Majalengka',
      type: data.type || 'video',
      mediaUrl: data.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      durationSeconds: Number(data.durationSeconds) || 30,
      scheduleTime: data.scheduleTime || '12:00',
      impressionsCount: 0,
      targetImpressions: Number(data.targetImpressions) || 10000,
      active: true,
    };
    return adsRepository.create(newAd);
  },
};
