import { spawnSync } from 'node:child_process';

if (!process.env.__TSX_BOOTSTRAPPED__ && !process.execArgv.some((arg) => arg.includes('tsx'))) {
  const result = spawnSync(process.execPath, ['--import', 'tsx', ...process.argv.slice(1)], {
    stdio: 'inherit',
    env: { ...process.env, __TSX_BOOTSTRAPPED__: '1' },
  });
  process.exit(result.status ?? 0);
}

async function main() {
  const path = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const express = (await import('express')).default;
  const { config } = await import('./server/config');
  const { initializeDatabase } = await import('./server/db');
  const { app } = await import('./server/index');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const PORT = 3000;
  const HOST = '0.0.0.0';

  try {
    await initializeDatabase();
  } catch (error) {
    console.error('[db] initialization failed', error);
  }

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: HOST },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any, next: any) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`NexTake server listening on http://${HOST}:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
