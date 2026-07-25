import type { VercelRequest, VercelResponse } from '@vercel/node';

export type HandlerFn = (req: VercelRequest, res: VercelResponse) => Promise<any> | any;

export function createApiHandler(handler: HandlerFn) {
  return async (req: VercelRequest, res: VercelResponse) => {
    // Enable CORS for all incoming requests
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    try {
      return await handler(req, res);
    } catch (err: any) {
      console.error('[Vercel Serverless Function Error]', req.method, req.url, err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Error internal serverless function',
      });
    }
  };
}
