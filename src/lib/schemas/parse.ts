import { z } from 'zod';
import { ParsedEntrySchema } from './session';

export const ParseRequestSchema = z.object({
  rawText: z.string().trim().min(1).max(500),
  currentDateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const ParseResponseSchema = z.object({
  entries: z.array(ParsedEntrySchema),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type ParseRequest = z.infer<typeof ParseRequestSchema>;
export type ParseResponse = z.infer<typeof ParseResponseSchema>;
