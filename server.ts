import express from 'express';
import youtubedl from 'youtube-dl-exec';
import abdl from 'ab-downloader';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

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
        // Fallback using ab-downloader for youtube
        const info = await abdl.youtube(url);
        if (!info || (!info.mp4 && !info.mp3)) {
          throw new Error("ab-downloader failed to find media");
        }
        
        const mediaUrl = format === 'audio/mp3' ? (info.mp3 || info.mp4) : (info.mp4 || info.mp3);
        const fileName = format === 'audio/mp3' ? 'audio.mp3' : 'download.mp4';
        res.header('Content-Disposition', `attachment; filename="${fileName}"`);
        
        const response = await fetch(mediaUrl);
        if (!response.ok) throw new Error(`Failed to fetch media from proxy: ${response.statusText}`);
        
        const stream = response.body;
        
        // Pipe the web stream to express response
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
        return;
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

      res.header('Content-Disposition', `attachment; filename="download.mp4"`);
      // Since downloading straight to stream might cause issues with merged formats (video+audio),
      // yt-dlp might fail if ffmpeg is needed to merge on the fly. 
      // If we use 'best' it usually gets a pre-merged format if available.
      // Let's use 'best' for now if it's video to avoid ffmpeg merging issues on stdout.
      const safeFormat = format === 'audio/mp3' ? 'bestaudio/best' : 'best';
      if (format === 'audio/mp3') {
         res.header('Content-Disposition', `attachment; filename="audio.mp3"`);
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
