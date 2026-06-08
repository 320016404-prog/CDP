import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'mpa', 
    });
    app.use(vite.middlewares);
  } else {
    const processDistPath = path.join(process.cwd(), 'dist');
    app.use(express.static(processDistPath, {
      extensions: ['html', 'htm']
    }));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(processDistPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
