import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { url, title, text } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `Analyze this media content. \nTitle: ${title}\nURL: ${url}\nAdditional context: ${text}\n\nProvide a concise 3-bullet summary of what this media likely contains and its main themes. Format as markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze' });
  }
});

export default router;
