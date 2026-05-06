import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import downloadRouter from './routes/download';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.MAX_DOWNLOADS_PER_MINUTE) || 10,
  message: { error: 'Too many requests. Please slow down.' },
});
app.use('/api/', limiter);
app.use('/api', downloadRouter);

app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'IGETAM API', version: '1.0.0' });
});

app.get('/check', (_, res) => {
  const { execSync } = require('child_process');
  try {
    const path = execSync('which yt-dlp').toString().trim();
    const version = execSync('yt-dlp --version').toString().trim();
    res.json({ path, version, env: process.env.YTDLP_PATH });
  } catch (e) {
    res.json({ error: String(e), env: process.env.YTDLP_PATH });
  }
});

app.listen(PORT, () => {
  console.log(`IGETAM API running on port ${PORT}`);
});