import { getState } from '../store';

export const obsService = {
  getStatus() {
    const store = getState();
    return store.obsSettings;
  },

  connect(params: { host?: string; port?: number; password?: string }) {
    const store = getState();
    if (params.host) store.obsSettings.host = params.host;
    if (params.port) store.obsSettings.port = Number(params.port);
    if (params.password) store.obsSettings.password = params.password;
    store.obsSettings.connected = true;
    return store.obsSettings;
  },

  startStream() {
    const store = getState();
    store.obsSettings.isStreaming = true;
    return { isStreaming: true };
  },

  stopStream() {
    const store = getState();
    store.obsSettings.isStreaming = false;
    return { isStreaming: false };
  },

  emergencyStop() {
    const store = getState();
    store.obsSettings.isStreaming = false;
    store.obsSettings.isRecording = false;
    store.obsSettings.currentScene = 'Commercial & Ad Block';
    store.breakingNews.forEach((bn) => (bn.active = false));
    return {
      message: 'EMERGENCY STOP: Siaran dihentikan secara darurat!',
      obsStatus: store.obsSettings,
    };
  },

  changeScene(sceneName: string) {
    const store = getState();
    store.obsSettings.currentScene = sceneName;
    store.scenes.forEach((sc) => {
      sc.isProgram = sc.name === sceneName;
    });
    return { currentScene: sceneName };
  },
};
