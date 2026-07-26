import { Request, Response, NextFunction } from 'express';
import { newsService } from '../services/newsService';
import { geminiService } from '../services/gemini';

export const seoController = {
  async getRobots(req: Request, res: Response, next: NextFunction) {
    try {
      const content = `User-agent: *\nAllow: /\nSitemap: https://majalengkapost.tv/api/seo/sitemap.xml\nSitemap: https://majalengkapost.tv/api/seo/news-sitemap.xml\n`;
      res.header('Content-Type', 'text/plain');
      res.send(content);
    } catch (err) {
      next(err);
    }
  },

  async getSitemap(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.getAll();
      const urlsXml = news
        .map(
          (n) =>
            `  <url>\n    <loc>https://majalengkapost.tv/news/${n.id}</loc>\n    <lastmod>${new Date(
              n.createdAt
            ).toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
        )
        .join('\n');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://majalengkapost.tv/</loc>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n${urlsXml}\n</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      next(err);
    }
  },

  async getNewsSitemap(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.getAll();
      const newsXml = news
        .map(
          (n) =>
            `  <url>\n    <loc>https://majalengkapost.tv/news/${n.id}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>Majalengka Post TV</news:name>\n        <news:language>id</news:language>\n      </news:publication>\n      <news:publication_date>${new Date(
              n.createdAt
            ).toISOString()}</news:publication_date>\n      <news:title>${n.title.replace(
              /&/g,
              '&amp;'
            )}</news:title>\n    </news:news>\n  </url>`
        )
        .join('\n');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${newsXml}\n</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      next(err);
    }
  },

  async getRss(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.getAll();
      const itemsXml = news
        .map(
          (n) =>
            `    <item>\n      <title>${n.title.replace(/&/g, '&amp;')}</title>\n      <link>https://majalengkapost.tv/news/${n.id}</link>\n      <description>${n.content.substring(0, 200).replace(/&/g, '&amp;')}</description>\n      <pubDate>${new Date(n.createdAt).toUTCString()}</pubDate>\n    </item>`
        )
        .join('\n');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Majalengka Post TV (MPTV)</title>\n    <link>https://majalengkapost.tv</link>\n    <description>Berita &amp; Siaran TV Otomatis Majalengka</description>\n${itemsXml}\n  </channel>\n</rss>`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      next(err);
    }
  },

  async getMeta(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.query as { title?: string; content?: string };
      const metadata = await geminiService.generateSeoMetadata(
        title || 'Majalengka Post TV 24 Jam',
        content || 'Portal siaran TV digital dan otomatisasi berita Kabupaten Majalengka.'
      );
      res.json({
        success: true,
        message: 'Dynamic SEO Metadata & Structured Data',
        data: {
          ...metadata,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'NewsMediaOrganization',
            name: 'Majalengka Post TV',
            url: 'https://majalengkapost.tv',
            logo: 'https://majalengkapost.tv/logo.png',
            sameAs: ['https://youtube.com/c/majalengkaposttv'],
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
