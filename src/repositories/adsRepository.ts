import { getState } from '../lib/store';
import { Advertisement } from '../types';

export const adsRepository = {
  getAll(): Advertisement[] {
    return getState().ads;
  },

  create(ad: Advertisement): Advertisement {
    getState().ads.unshift(ad);
    return ad;
  },
};
