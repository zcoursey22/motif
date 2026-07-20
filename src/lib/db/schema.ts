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

// Mirrors SelfRatingSchema — one source of truth per layer, values must match.
export const selfRatingEnum = pgEnum('self_rating', [
  'poor',
  'below',
  'above',
  'strong',
]);

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
  table => [
    // Dashboard and summary queries filter/sort by when practice happened.
    index('sessions_occurred_at_idx').on(table.occurredAt),
  ]
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
    selfRating: selfRatingEnum('self_rating'),
  },
  table => [
    // Every "load a session's entries" query hits this.
    index('entries_session_id_idx').on(table.sessionId),
  ]
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
