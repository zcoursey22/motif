import { z } from 'zod';
import { ParsedEntrySchema } from './session';

export const ParseRequestSchema = z.object({
  rawText: z.string().trim().min(1).max(500),
});

export const ParseResponseSchema = z.object({
  entries: z.array(ParsedEntrySchema),
});

export type ParseRequest = z.infer<typeof ParseRequestSchema>;
export type ParseResponse = z.infer<typeof ParseResponseSchema>;
