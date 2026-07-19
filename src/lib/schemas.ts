import { z } from 'zod';

export const SelfRatingSchema = z.enum(['poor', 'below', 'above', 'strong']);

export const EntrySchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  instrument: z.string().min(1).nullable(),
  focus: z.array(z.string().min(1)).default([]),
  durationMin: z.number().int().positive().nullable(),
  selfRating: SelfRatingSchema.nullable(),
});

export const SessionSchema = z.object({
  id: z.string(),
  rawText: z.string().min(1),
  occurredAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export type Entry = z.infer<typeof EntrySchema>;
export type Session = z.infer<typeof SessionSchema>;
