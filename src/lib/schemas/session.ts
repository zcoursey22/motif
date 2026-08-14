import { z } from 'zod';
import { Instrument, SelfRating } from '../constants';

export const EntryFields = z.object({
  id: z.string(),
  sessionId: z.string(),
  instrument: z.enum(Instrument).nullable(),
  focus: z.array(z.string().min(1)).default([]),
  durationMin: z.number().int().positive().nullable(),
  selfRating: z
    .enum(SelfRating)
    .nullable()
    .describe(
      `How the musician judged the entry, or null if they do not say.
      poor = went badly or frustrated;
      below = rough, more misses than hits;
      above = pretty good but not great, more hits than misses;
      strong = went well;`
    ),
});

export const EntrySchema = EntryFields.refine(
  (e: { instrument: Instrument | null; focus: string[] }) =>
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

export const CreateSessionPayloadSchema = z.object({
  rawText: z.string().trim().min(1).max(500),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  entries: z.array(ParsedEntrySchema).min(1),
});
export type CreateSessionPayload = z.infer<typeof CreateSessionPayloadSchema>;

export const UpdateSessionPayloadSchema = CreateSessionPayloadSchema.omit({
  rawText: true,
}).partial({ occurredOn: true });
export type UpdateSessionPayload = z.infer<typeof UpdateSessionPayloadSchema>;

export type Entry = z.infer<typeof EntrySchema>;
export type ParsedEntry = z.infer<typeof ParsedEntrySchema>;
export type EditableEntry = z.infer<typeof EditableEntrySchema>;
export type Session = z.infer<typeof SessionSchema>;
