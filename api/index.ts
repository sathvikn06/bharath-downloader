import express from 'express';
import youtubedl from 'youtube-dl-exec';
import abdl from 'ab-downloader';

const app = express();
app.use(express.json());

app.post('/api/info', async (req, res) => {
  try {
    const { url } = req.body;
    let isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    if (isYoutube) {
      const info = await abdl.youtube(url);
      return res.json({ title: info.title || 'YouTube Media', thumbnail: info.thumbnail });
    }
    // @ts-ignore
    const info = await youtubedl(url, { // @ts-ignore
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0']
    });
    res.json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});

app.get('/api/download', async (req, res) => {
  try {
    const { url, format, quality } = req.query;
    if (!url || typeof url !== 'string') return res.status(400).send('URL is required');
    
    let isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    if (isYoutube) {
      const info = await abdl.youtube(url);
      if (!info || (!info.mp4 && !info.mp3)) {
        throw new Error("ab-downloader failed to find media");
      }
      const mediaUrl = format === 'audio/mp3' ? (info.mp3 || info.mp4) : (info.mp4 || info.mp3);
      const fileName = format === 'audio/mp3' ? 'audio.mp3' : 'download.mp4';
      res.header('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.redirect(mediaUrl);
    }

    let ytdlFormat = 'best';
    if (format === 'audio/mp3') {
      ytdlFormat = 'bestaudio/best';
    } else {
      if (quality === 'highest') ytdlFormat = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
      else if (quality === 'high') ytdlFormat = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
      else if (quality === 'medium') ytdlFormat = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
      else if (quality === 'low') ytdlFormat = 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    }
    const safeFormat = format === 'audio/mp3' ? 'bestaudio/best' : 'best';
    if (format === 'audio/mp3') {
       res.header('Content-Disposition', `attachment; filename="audio.mp3"`);
    } else {
       res.header('Content-Disposition', `attachment; filename="download.mp4"`);
    }

    // @ts-ignore
    const subprocess = youtubedl.exec(url, { // @ts-ignore
      output: '-',
      format: safeFormat,
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0']
    });

    subprocess.catch(err => {
      console.error('yt-dlp execution error:', err.message);
      if (!res.headersSent) res.status(500).send('Download failed');
    });

    if (subprocess.stdout) {
      subprocess.stdout.pipe(res);
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ error: 'Failed to download' });
  }
});

export default app;
