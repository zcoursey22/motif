import { z } from 'zod';
import { SelfRating } from '../constants';

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
  occurredOn: z.string(),
  createdAt: z.coerce.date(),
});

export const ParsedEntrySchema = EntryFields.omit({
  id: true,
  sessionId: true,
});

export const EditableEntrySchema = EntryFields.omit({
  sessionId: true,
});

export const isEntryValid = ({ instrument, focus }: ParsedEntry) =>
  instrument !== null || focus.length > 0;

export const CreateSessionSchema = z.object({
  rawText: z.string().trim().min(1).max(500),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  entries: z.array(ParsedEntrySchema).min(1),
});
export type CreateSession = z.infer<typeof CreateSessionSchema>;

export type Entry = z.infer<typeof EntrySchema>;
export type ParsedEntry = z.infer<typeof ParsedEntrySchema>;
export type EditableEntry = z.infer<typeof EditableEntrySchema>;
export type Session = z.infer<typeof SessionSchema>;
