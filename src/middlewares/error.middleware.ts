import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // Express a besoin des 4 paramètres pour reconnaître un error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
    return;
  }

  // erreurs levées par express.json() : JSON invalide, body trop gros...
  if (isClientError(err)) {
    res.status(err.status).json({ error: { code: 'INVALID_REQUEST_BODY', message: err.message } });
    return;
  }

  console.error('Unexpected error:', err);
  res
    .status(500)
    .json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' } });
}

function isClientError(err: unknown): err is { status: number; message: string } {
  if (typeof err !== 'object' || err === null || !('status' in err)) return false;
  const { status } = err as { status: unknown };
  return typeof status === 'number' && status >= 400 && status < 500;
}
