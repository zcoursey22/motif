import { z } from 'zod';
import { SelfRating } from './constants';

export const EntryFields = z.object({
  id: z.string(),
  sessionId: z.string(),
  instrument: z.string().min(1).nullable(),
  focus: z.array(z.string().min(1)).default([]),
  durationMin: z.number().int().positive().nullable(),
  selfRating: z.enum(SelfRating).nullable(),
});

export const EntrySchema = EntryFields.refine(
  (e: { instrument: string | null; focus: string[] }) =>
    e.instrument !== null || e.focus.length > 0,
  {
    message: 'Entry needs an instrument or at least one focus area',
  }
);

export const SessionSchema = z.object({
  id: z.string(),
  rawText: z.string().min(1),
  occurredAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export type Entry = z.infer<typeof EntrySchema>;
export type Session = z.infer<typeof SessionSchema>;
