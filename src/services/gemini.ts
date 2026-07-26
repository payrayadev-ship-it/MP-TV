import { GoogleGenAI } from '@google/genai';

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export const geminiService = {
  async generateNewsScript(title: string, content: string): Promise<string> {
    const ai = getGenAI();
    if (!ai) {
      return `Halo pemirsa Majalengka Post TV, saya presenter AI digital anda. Berita hari ini: ${title}. ${content.substring(
        0,
        180
      )}... Sekian berita Majalengka Terkini.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Anda adalah presenter TV berita profesional untuk "Majalengka Post TV".
Ubah teks berita berikut menjadi naskah siaran TV langsung yang menarik, padat, dan berbahasa Indonesia formal dengan sapaan hangat untuk warga Kabupaten Majalengka:

Judul: ${title}
Konten: ${content}`,
      });
      return response.text || `Berita: ${title}. ${content}`;
    } catch (err) {
      console.warn('[Gemini Service Error]', err);
      return `Halo pemirsa Majalengka Post TV, saya presenter AI digital anda. Berita hari ini: ${title}. ${content.substring(
        0,
        180
      )}... Sekian berita Majalengka Terkini.`;
    }
  },

  async generateNewsDigest(newsItems: Array<{ title: string; content: string }>): Promise<string> {
    const ai = getGenAI();
    const promptText = newsItems.map((item, idx) => `${idx + 1}. ${item.title}: ${item.content}`).join('\n\n');

    if (!ai) {
      return `RANGKUMAN BERITA HARI INI MAJALENGKA POST TV:\n${newsItems.map((n) => `- ${n.title}`).join('\n')}`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Anda adalah redaktur berita Majalengka Post TV. Rangkum daftar berita berikut menjadi sebuah ringkasan eksekutif harian (News Digest) yang tajam dan informatif:\n\n${promptText}`,
      });
      return response.text || promptText;
    } catch (err) {
      console.warn('[Gemini Digest Error]', err);
      return `RANGKUMAN BERITA HARI INI MAJALENGKA POST TV:\n${newsItems.map((n) => `- ${n.title}`).join('\n')}`;
    }
  },

  async generateSeoMetadata(title: string, content: string) {
    const ai = getGenAI();
    if (!ai) {
      return {
        metaTitle: `${title} | Majalengka Post TV`,
        metaDescription: content.substring(0, 150),
        keywords: ['Majalengka', 'Berita', 'Post TV'],
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Buatkan metadata SEO untuk artikel berita ini dalam format JSON valid: {"metaTitle": "...", "metaDescription": "...", "keywords": ["..."]}.
Judul: ${title}
Isi: ${content}`,
      });
      const text = response.text || '';
      const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return JSON.parse(cleanJson);
    } catch {
      return {
        metaTitle: `${title} | Majalengka Post TV`,
        metaDescription: content.substring(0, 150),
        keywords: ['Majalengka', 'Berita', 'Post TV'],
      };
    }
  },
};
