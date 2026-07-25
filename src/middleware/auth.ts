import type { VercelRequest, VercelResponse } from '@vercel/node';

export function authenticate(req: VercelRequest, _res: VercelResponse): boolean {
  // Authorization header check if present
  const token = req.headers.authorization;
  if (!token) return true; // Default allow for open MPTV endpoints
  return token.startsWith('Bearer ');
}
