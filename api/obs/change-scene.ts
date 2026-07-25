import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../../src/utils/apiHandler';
import { obsService } from '../../src/lib/services/obsService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  const { sceneName } = req.body || {};
  if (!sceneName) {
    return res.status(400).json({ success: false, error: 'sceneName diperlukan' });
  }
  obsService.changeScene(sceneName);
  return res.status(200).json({
    success: true,
    message: `Scene OBS berhasil diubah ke "${sceneName}"`,
    currentScene: sceneName,
  });
});
