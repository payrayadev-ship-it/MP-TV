import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendError } from '../lib/response';
import { logger } from '../lib/logger';

export type HandlerFn = (req: VercelRequest, res: VercelResponse) => Promise<any> | any;

export function createApiHandler(handler: HandlerFn) {
  return async (req: VercelRequest, res: VercelResponse) => {
    // Set CORS headers
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
      logger.error(`API Error on ${req.method} ${req.url}:`, err);
      return sendError(res, err.message || 'Internal Server Error', 500);
    }
  };
}
