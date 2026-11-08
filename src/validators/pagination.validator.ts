import { z } from 'zod';
import { BadRequestError } from '../errors/app-error';
import type { Pagination } from '../types/pagination';

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(MAX_LIMIT).default(DEFAULT_LIMIT),
});

export function parsePagination(query: unknown): Pagination {
  const result = paginationSchema.safeParse(query);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new BadRequestError(`Invalid pagination: ${details}`);
  }
  return result.data;
}
