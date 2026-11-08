import { z } from 'zod';
import { BadRequestError } from '../errors/app-error';
import type { NewPlayer } from '../types/player';

const positiveInt = z.number().int().positive();

const newPlayerSchema = z.object({
  firstname: z.string().trim().min(1),
  lastname: z.string().trim().min(1),
  shortname: z.string().trim().min(1),
  sex: z.enum(['M', 'F']),
  country: z.object({
    pictureUrl: z.string().url(),
    code: z.string().regex(/^[A-Z]{3}$/, 'must be a 3-letter uppercase code'),
  }),
  pictureUrl: z.string().url(),
  data: z.object({
    rank: positiveInt,
    points: z.number().int().nonnegative(),
    weight: positiveInt, // en grammes
    height: positiveInt, // en cm
    age: positiveInt,
    last: z.array(z.union([z.literal(0), z.literal(1)])),
  }),
});

export function parseNewPlayer(body: unknown): NewPlayer {
  const result = newPlayerSchema.safeParse(body);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
      .join(', ');
    throw new BadRequestError(`Invalid player: ${details}`);
  }
  return result.data;
}
