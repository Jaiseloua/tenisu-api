import express, { type Express } from 'express';
import { PlayerController } from './controllers/player.controller';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/not-found.middleware';
import { InMemoryPlayerRepository } from './repositories/in-memory-player.repository';
import { createPlayerRouter } from './routes/player.routes';
import { PlayerService } from './services/player.service';

// Pas de listen() ici pour pouvoir tester l'app avec supertest
export function createApp(
  playerService: PlayerService = new PlayerService(new InMemoryPlayerRepository()),
): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'Tenisu API',
      endpoints: [
        'GET /api/players',
        'GET /api/players/:id',
        'GET /api/players/stats',
        'POST /api/players',
        'GET /health',
      ],
    });
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  app.use('/api/players', createPlayerRouter(new PlayerController(playerService)));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
