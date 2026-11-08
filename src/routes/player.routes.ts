import type { PlayerController } from '../controllers/player.controller';
import { Router } from 'express';

export function createPlayerRouter(controller: PlayerController): Router {
  const router = Router();

  router.get('/', controller.getAll);
  router.post('/', controller.create);
  router.get('/stats', controller.getStatistics);
  router.get('/:id', controller.getById);

  return router;
}
