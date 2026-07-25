import { GoogleGenAI } from '@google/genai';
import { getState } from '../store';
import { AiPresenterTask } from '../../types';

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export const aiPresenterService = {
  getAll() {
    return getState().aiPresenterTasks;
  },

  async generate(data: {
    newsTitle?: string;
    newsContent?: string;
    voiceGender?: 'male' | 'female';
    autoAddToPlaylistId?: string;
  }) {
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

    let scriptResult = `Halo pemirsa Majalengka Post TV, saya presenter AI digital anda. Berita hari ini: ${title}. ${content.substring(
      0,
      180
    )}... Sekian berita Majalengka Terkini.`;

    const ai = getGenAI();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Anda adalah presenter TV berita profesional untuk "Majalengka Post TV".
Ubah teks berita berikut menjadi naskah siaran TV langsung yang menarik, padat, dan berbahasa Indonesia formal dengan sapaan hangat untuk warga Kabupaten Majalengka:

Judul: ${title}
Konten: ${content}`,
        });
        if (response.text) {
          scriptResult = response.text;
        }
      } catch (err) {
        console.warn('[AI Presenter Gemini Error] Menggunakan fallback template naskah:', err);
      }
    }

    newTask.scriptText = scriptResult;
    newTask.status = 'Completed';
    newTask.progress = 100;
    newTask.generatedVideoUrl =
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

    return newTask;
  },
};
