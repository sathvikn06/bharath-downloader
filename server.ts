import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRouter from './api/index.js'; // The Vercel endpoint
import analyzeRouter from './api/analyze.js';
import batchRouter from './api/batch.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mount the API router from api/index.ts
  app.use(apiRouter);
  app.use(express.json());
  app.use('/api/analyze', analyzeRouter);
  app.use('/api/batch', batchRouter);
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
