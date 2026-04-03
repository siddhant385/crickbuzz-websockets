import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';

/**
 * ENUM: match_status
 */
export const matchStatusEnum = pgEnum('match_status', [
  'scheduled',
  'live',
  'finished',
]);

/**
 * TABLE: matches
 */
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  status: matchStatusEnum('status').notNull().default('scheduled'),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  homeScore: integer('home_score').notNull().default(0),
  awayScore: integer('away_score').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * TABLE: commentary
 */
export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  minute: integer('minute'), // e.g., 45, 90+2
  sequence: integer('sequence').notNull(), // ordering within same minute
  period: text('period'), // e.g., "1H", "2H", "ET", "PK"
  eventType: text('event_type'), // goal, foul, substitution, etc.
  actor: text('actor'), // player or entity
  team: text('team'), // home/away or team name
  message: text('message').notNull(),
  metadata: jsonb('metadata'), // structured extra info
  tags: text('tags').array(), // optional tagging system
  createdAt: timestamp('created_at').notNull().defaultNow(),
});