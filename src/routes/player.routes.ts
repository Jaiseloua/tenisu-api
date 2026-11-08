import { Router } from 'express';
import type { PlayerController } from '../controllers/player.controller';

export function createPlayerRouter(controller: PlayerController): Router {
  const router = Router();

  router.get('/', controller.getAll);
  router.post('/', controller.create);
  // avant /:id sinon "stats" est pris pour un id
  router.get('/stats', controller.getStatistics);
  router.get('/:id', controller.getById);

  return router;
}
