import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BroadcastProvider } from './context/BroadcastContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ShortcutNotification } from './components/common/ShortcutNotification';

// Views
import { DashboardView } from './views/DashboardView';
import { LiveStreamingView } from './views/LiveStreamingView';
import { ObsControllerView } from './views/ObsControllerView';
import { SceneManagerView } from './views/SceneManagerView';
import { PlaylistView } from './views/PlaylistView';
import { VideoManagerView } from './views/VideoManagerView';
import { ScheduleView } from './views/ScheduleView';
import { EpgView } from './views/EpgView';
import { BreakingNewsView } from './views/BreakingNewsView';
import { RunningTextView } from './views/RunningTextView';
import { AdvertisementView } from './views/AdvertisementView';
import { YouTubeLiveView } from './views/YouTubeLiveView';
import { AiPresenterView } from './views/AiPresenterView';
import { WeatherView } from './views/WeatherView';
import { AnalyticsView } from './views/AnalyticsView';
import { UsersView } from './views/UsersView';
import { SettingsView } from './views/SettingsView';
import { SupabaseIntegrationView } from './views/SupabaseIntegrationView';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { toast, setToast, isHelpOpen, setIsHelpOpen, shortcuts } = useKeyboardShortcuts();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'livestreaming':
        return <LiveStreamingView />;
      case 'obscontroller':
        return <ObsControllerView />;
      case 'scenemanager':
        return <SceneManagerView />;
      case 'playlist':
        return <PlaylistView />;
      case 'videomanager':
        return <VideoManagerView />;
      case 'schedule':
        return <ScheduleView />;
      case 'epg':
        return <EpgView />;
      case 'breakingnews':
        return <BreakingNewsView />;
      case 'runningtext':
        return <RunningTextView />;
      case 'advertisement':
        return <AdvertisementView />;
      case 'youtubelive':
        return <YouTubeLiveView />;
      case 'aipresenter':
        return <AiPresenterView />;
      case 'weather':
        return <WeatherView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'users':
        return <UsersView />;
      case 'supabase':
        return <SupabaseIntegrationView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#D50000] selection:text-white">
      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Keyboard Shortcut Feedback Toast & Helper Modal */}
      <ShortcutNotification
        toast={toast}
        onCloseToast={() => setToast(null)}
        isHelpOpen={isHelpOpen}
        onCloseHelp={() => setIsHelpOpen(false)}
        shortcuts={shortcuts}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BroadcastProvider>
        <AppContent />
      </BroadcastProvider>
    </AuthProvider>
  );
}
