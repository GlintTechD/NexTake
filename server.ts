import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import { app } from './server/index';
import { initializeDatabase } from './server/db';

const PORT = 3000;
const HOST = '0.0.0.0';

async function startServer() {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('[db] initialization failed', error);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(process.cwd(), 'dist');

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`NexTake Full-Stack Server running at http://${HOST}:${PORT}`);
  });
}

void startServer();
