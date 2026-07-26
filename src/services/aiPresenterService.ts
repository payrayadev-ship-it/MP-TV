import { getState } from '../lib/store';
import { AiPresenterTask } from '../types';
import { geminiService } from './gemini';

export const aiPresenterService = {
  getAll(): AiPresenterTask[] {
    return getState().aiPresenterTasks;
  },

  async generate(data: {
    newsTitle?: string;
    newsContent?: string;
    voiceGender?: 'male' | 'female';
    autoAddToPlaylistId?: string;
  }): Promise<AiPresenterTask> {
    const store = getState();
    const title = data.newsTitle || 'Berita Utama Majalengka';
    const content = data.newsContent || 'Pemberitaan seputar perkembangan ekonomi dan infrastruktur Kabupaten Majalengka.';

    const newTask: AiPresenterTask = {
      id: `ai-task-${Date.now()}`,
      newsTitle: title,
      scriptText: 'Memproses naskah penyiar digital AI...',
      voiceGender: data.voiceGender || 'female',
      status: 'Generating Script',
      progress: 25,
      createdAt: new Date().toISOString(),
      autoAddToPlaylistId: data.autoAddToPlaylistId,
    };

    store.aiPresenterTasks.unshift(newTask);

    const scriptResult = await geminiService.generateNewsScript(title, content);

    newTask.scriptText = scriptResult;
    newTask.status = 'Completed';
    newTask.progress = 100;
    newTask.generatedVideoUrl =
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

    return newTask;
  },
};
