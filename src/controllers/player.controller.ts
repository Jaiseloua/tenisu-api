import type { Request, Response } from 'express';
import { BadRequestError } from '../errors/app-error';
import type { PlayerService } from '../services/player.service';
import { parsePagination } from '../validators/pagination.validator';
import { parseNewPlayer } from '../validators/player.validator';

export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const result = await this.playerService.getPlayersSortedByRank(parsePagination(req.query));
    res.status(200).json(result);
  };

  getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const id = parsePlayerId(req.params.id);
    const player = await this.playerService.getPlayerById(id);
    res.status(200).json(player);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const player = await this.playerService.createPlayer(parseNewPlayer(req.body));
    res.status(201).location(`${req.baseUrl}/${player.id}`).json(player);
  };

  getStatistics = async (_req: Request, res: Response): Promise<void> => {
    const statistics = await this.playerService.getStatistics();
    res.status(200).json(statistics);
  };
}

function parsePlayerId(rawId: string): number {
  const id = Number(rawId);
  if (!/^\d+$/.test(rawId) || !Number.isSafeInteger(id) || id <= 0) {
    throw new BadRequestError(`Invalid player id "${rawId}": must be a positive integer`);
  }
  return id;
}
