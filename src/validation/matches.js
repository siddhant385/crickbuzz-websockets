import { z } from 'zod';

/**
 * CONSTANT: MATCH_STATUS
 */
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

/**
 * QUERY: list matches
 */
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

/**
 * PARAM: match id
 */
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Helper: ISO date validation
 */
const isValidISODate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === date.toISOString();
};

/**
 * SCHEMA: create match
 */
export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),

    startTime: z.string(),
    endTime: z.string(),

    homeScore: z.coerce.number().int().min(0).optional(),
    awayScore: z.coerce.number().int().min(0).optional(),
  })
  .refine((data) => isValidISODate(data.startTime), {
    message: 'startTime must be a valid ISO date string',
    path: ['startTime'],
  })
  .refine((data) => isValidISODate(data.endTime), {
    message: 'endTime must be a valid ISO date string',
    path: ['endTime'],
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'endTime must be after startTime',
        path: ['endTime'],
      });
    }
  });

/**
 * SCHEMA: update score
 */
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0),
});