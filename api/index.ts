import express from 'express';
import dl from 'btch-downloader';
import youtubedl from 'youtube-dl-exec';

const app = express();
app.use(express.json());

app.post('/api/info', async (req, res) => {
  try {
    const { url } = req.body;
    let title = 'Media';
    let thumbnail = '';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
       const info = await dl.youtube(url);
       title = info?.title || title;
       thumbnail = info?.thumbnail || thumbnail;
    } else if (url.includes('instagram.com')) {
       const info = await dl.igdl(url);
       thumbnail = (info?.result && info.result[0]?.thumbnail) || thumbnail;
       title = 'Instagram Video';
    } else if (url.includes('tiktok.com')) {
       const info = await dl.ttdl(url);
       // Check if ttdl is empty
       if (info?.video && info.video.length > 0) {
          title = info?.title || 'TikTok Video';
          thumbnail = info?.thumbnail || thumbnail;
       }
    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
       const info = await dl.fbdown(url);
       if (info?.Normal_video || info?.HD) {
           title = 'Facebook Video';
       }
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
       const info = await dl.twitter(url);
       if (info?.url) {
           title = 'Twitter/X Video';
       }
    } else if (url.includes('pinterest.com') || url.includes('pin.it')) {
       try {
         const info = await dl.pinterest(url);
         title = 'Pinterest Media';
       } catch (e) {}
    }

    // fallback to yt-dlp if thumbnail is missing and it's not IG (since IG blocks yt-dlp)
    if (!thumbnail && !url.includes('instagram.com')) {
       try {
           const info = await youtubedl(url, {
              dumpSingleJson: true,
              noCheckCertificates: true,
              noWarnings: true,
           });
           title = info.title || title;
           thumbnail = info.thumbnail || thumbnail;
       } catch (e) {
           console.log("yt-dlp fallback failed:", e.message);
       }
    }

    res.json({ title, thumbnail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});

app.get('/api/download', async (req, res) => {
  try {
    const { url, format, quality } = req.query;
    if (!url || typeof url !== 'string') return res.status(400).send('URL is required');

    let mediaUrl = null;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
       const info = await dl.youtube(url);
       if (format === 'image/jpeg') {
           mediaUrl = info?.thumbnail;
       } else if (info?.mp4 || info?.mp3) {
           mediaUrl = format === 'audio/mp3' ? (info.mp3 || info.mp4) : (info.mp4 || info.mp3);
       }
    } else if (url.includes('instagram.com')) {
       const info = await dl.igdl(url);
       if (info?.result && info.result.length > 0) {
           if (format === 'image/jpeg') {
               mediaUrl = info.result[0].thumbnail || info.result[0].url;
           } else {
               mediaUrl = info.result[0].url;
           }
       }
    } else if (url.includes('tiktok.com')) {
       const info = await dl.ttdl(url);
       if (format === 'image/jpeg') {
           mediaUrl = info?.thumbnail;
       } else {
           if (info?.video && info.video.length > 0) {
               mediaUrl = info.video[0]; // TODO: select audio if format=audio/mp3
           }
           if (format === 'audio/mp3' && info?.audio && info.audio.length > 0) {
               mediaUrl = info.audio[0];
           }
       }
    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
       if (format !== 'image/jpeg') {
           const info = await dl.fbdown(url);
           mediaUrl = info?.HD || info?.Normal_video;
       }
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
       if (format !== 'image/jpeg') {
           const info = await dl.twitter(url);
           if (info && info.length > 0) {
               mediaUrl = info[0].url;
           }
       }
    } else if (url.includes('pinterest.com') || url.includes('pin.it')) {
       try {
           const info = await dl.pinterest(url);
           if (info?.result && info.result.url) {
               mediaUrl = info.result.url;
           }
       } catch (e) {}
    }

    if (mediaUrl) {
       // redirect to actual URL
       return res.redirect(mediaUrl);
    }

    // fallback to yt-dlp
    let ytdlFormat = format === 'audio/mp3' ? 'bestaudio/best' : format === 'image/jpeg' ? 'best[ext=jpg]/best' : 'best';
    
    // send attachment headers before piping
    const fileName = format === 'audio/mp3' ? 'audio.mp3' : format === 'image/jpeg' ? 'image.jpg' : 'download.mp4';
    res.header('Content-Disposition', `attachment; filename="${fileName}"`);

    const subprocess = youtubedl.exec(url, {
      output: '-',
      format: ytdlFormat,
      noCheckCertificates: true,
      noWarnings: true,
    });

    subprocess.catch(err => {
      console.error('yt-dlp execution error:', err.message);
      if (!res.headersSent) res.status(500).send('Download failed: ' + err.message);
    });

    if (subprocess.stdout) {
      subprocess.stdout.pipe(res);
    }

  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).send('Failed to download: ' + error.message);
  }
});

export default app;
