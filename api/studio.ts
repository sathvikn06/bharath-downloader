import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';

// Setup FFmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const router = express.Router();
const upload = multer({ dest: '/tmp/uploads/' });

// Trim Media
router.post('/trim', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { startTime, endTime } = req.body;
  
  const inputPath = req.file.path;
  const ext = path.extname(req.file.originalname) || '.mp4';
  const outputPath = path.join('/tmp', `trimmed_${Date.now()}${ext}`);

  const command = ffmpeg(inputPath);
  if (startTime) command.setStartTime(startTime);
  if (endTime && startTime) {
    const startParts = startTime.split(':').map(Number);
    const endParts = endTime.split(':').map(Number);
    
    let startSeconds = 0;
    if (startParts.length === 3) startSeconds = startParts[0] * 3600 + startParts[1] * 60 + startParts[2];
    else if (startParts.length === 2) startSeconds = startParts[0] * 60 + startParts[1];
    else startSeconds = startParts[0];

    let endSeconds = 0;
    if (endParts.length === 3) endSeconds = endParts[0] * 3600 + endParts[1] * 60 + endParts[2];
    else if (endParts.length === 2) endSeconds = endParts[0] * 60 + endParts[1];
    else endSeconds = endParts[0];
    
    command.setDuration(endSeconds - startSeconds);
  } else if (endTime) {
    command.setDuration(endTime);
  }

  command.output(outputPath)
    .on('end', () => {
      res.download(outputPath, `trimmed${ext}`, () => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to trim media' });
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    })
    .run();
});

// Vocal Extraction (Mocked/Requires Replicate)
router.post('/extract-vocals', upload.single('file'), async (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const inputPath = req.file.path;

  if (!process.env.REPLICATE_API_TOKEN) {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    return res.status(400).json({ error: 'Vocal extraction requires REPLICATE_API_TOKEN environment variable.' });
  }
  
  // Implementation for Replicate would go here
  if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
  return res.status(501).json({ error: 'Not fully implemented yet.' });
});

// Voice Cloning (Mocked/Requires ElevenLabs or Custom Music API)
router.post('/clone-voice', upload.single('sample'), async (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: 'No voice sample uploaded' });
  const inputPath = req.file.path;
  
  if (!process.env.ELEVENLABS_API_KEY && !process.env.MUSIC_API_KEY) {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    return res.status(400).json({ error: 'Voice cloning requires ELEVENLABS_API_KEY or MUSIC_API_KEY environment variable.' });
  }

  const { text } = req.body;
  
  // Implementation for ElevenLabs or Custom Music API would go here
  if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
  return res.status(501).json({ error: 'Not fully implemented yet. API key detected, but endpoint logic needs custom integration.' });
});

// Music Generation (Mocked/Requires Custom Music API)
router.post('/generate-music', async (req: any, res: any) => {
  if (!process.env.MUSIC_API_KEY && !process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: 'Music generation requires MUSIC_API_KEY or GEMINI_API_KEY environment variable.' });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
  
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContentStream({
        model: 'lyria-3-clip-preview',
        contents: prompt,
      });

      let audioBase64 = '';
      let mimeType = 'audio/wav';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
        }
      }

      if (!audioBase64) throw new Error('No audio generated');
      
      const buffer = Buffer.from(audioBase64, 'base64');
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', 'attachment; filename=generated_music.wav');
      return res.send(buffer);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate music using Gemini Lyria.' });
    }
  }

  return res.status(501).json({ error: 'Not fully implemented yet. Custom Music API integration is required.' });
});

export default router;
