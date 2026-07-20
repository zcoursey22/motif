import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { SelfRating } from '../constants';

export const selfRatingPgEnum = pgEnum(
  'self_rating',
  Object.values(SelfRating) as [SelfRating, ...SelfRating[]]
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    rawText: text('raw_text').notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => [index('sessions_occurred_at_idx').on(table.occurredAt)]
);

export const entries = pgTable(
  'entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'cascade' }),
    instrument: text('instrument'),
    focus: text('focus').array().notNull().default([]),
    durationMin: integer('duration_min'),
    selfRating: selfRatingPgEnum('self_rating'),
  },
  table => [index('entries_session_id_idx').on(table.sessionId)]
);

export const sessionsRelations = relations(sessions, ({ many }) => ({
  entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  session: one(sessions, {
    fields: [entries.sessionId],
    references: [sessions.id],
  }),
}));
