import { z } from 'zod';
import { Instrument, Focus, SelfRating } from '../constants';

export const EntryFields = z.object({
  id: z.string(),
  sessionId: z.string(),
  instrument: z
    .enum(Instrument)
    .nullable()
    .describe(
      `The instrument practiced, or null. Use null when the note names no instrument or names one not in the list. Map alternate names to the closest value (fiddle => violin, acoustic/electric guitar => guitar, string bass/double bass => upright_bass). For an ambiguous "bass" with no further context, default to upright_bass. Use bass_guitar only when the note names it or gives a concrete guitar/electric cue (amp, pickups, picking, fx, pedals, "electric," "guitar," "P-bass," etc.) or a non-classical or jazz style is specified and it seems very likely a bass guitar would be used rather than an upright bass. Similar goes for any other instruments that can be ambiguous.`
    ),
  focus: z
    .array(z.enum(Focus))
    .default([])
    .describe(
      `Categories of what was practiced. Choose only from the allowed values; map specific work to the closest category (a classical piece or jazz tune or pop song => repertoire; Classical etude/exercises => technique or warmup or specifically the focus of the study (scales, arpeggios, etc.); long tones => tone; ii-V drills => harmony and likely jazz). Return multiple when a session covers several. Return an empty array when nothing fits rather than forcing a poor match. If you can cleanly and confidently infer the style/genre of music and the focus exists for it, you can add it as a focus.`
    ),
  durationMin: z
    .number()
    .int()
    .positive()
    .nullable()
    .describe(
      `Practice time in whole minutes, or null. Convert stated durations to minutes ("half an hour" => 30, "an hour and a half" => 90). Use null when no time is given; never estimate from the amount of activity described or phrases like "a while".`
    ),
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
  (e: { instrument: Instrument | null; focus: Focus[] }) =>
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
