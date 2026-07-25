import { getState } from '../store';

export const analyticsService = {
  getAnalytics() {
    const store = getState();
    return {
      totalBroadcastHoursThisMonth: 642,
      averageViewers: store.youtubeStatus.viewers,
      peakViewersToday: store.youtubeStatus.viewers + 185,
      totalVideosInLibrary: store.videos.length,
      activePlaylistsCount: store.playlists.filter((p) => p.active).length,
      breakingNewsTriggeredToday: store.breakingNews.length,
      systemUptimePct: 99.98,
      viewerLocations: [
        { city: 'Majalengka Kota', pct: 42 },
        { city: 'Jatiwangi', pct: 18 },
        { city: 'Kadipaten', pct: 15 },
        { city: 'Kertajati (BIJB)', pct: 12 },
        { city: 'Cikijing & Talaga', pct: 13 },
      ],
    };
  },
};
