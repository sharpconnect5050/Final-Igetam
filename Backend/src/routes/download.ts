import { Router, Request, Response } from 'express';
import { getVideoInfo, streamDownload } from '../services/ytdlp';

const router = Router();

// GET /api/info?url=
router.get('/info', async (req: Request, res: Response) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }
  try {
    const info = await getVideoInfo(url);
    res.json({ success: true, data: info });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ success: false, error: msg });
  }
});

// GET /api/download?url=&format=mp4&quality=1080
router.get('/download', async (req: Request, res: Response) => {
  const { url, format = 'mp4', quality = '1080' } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }
  try {
    await streamDownload(url, format as string, quality as string, res);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Download failed';
    if (!res.headersSent) res.status(400).json({ success: false, error: msg });
  }
});

export default router;