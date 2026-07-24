import { z } from 'zod';
import { EntryFields } from './session';

export const ParseRequestSchema = z.object({
  rawText: z.string().trim().min(1).max(2000),
});

export const ParsedEntrySchema = EntryFields.omit({
  id: true,
  sessionId: true,
});

export const ParseResponseSchema = z.object({
  entries: z.array(ParsedEntrySchema),
});

export const ParseErrorCode = {
  VALIDATION_FAILED: 'validation_failed',
  TIMEOUT: 'timeout',
  RATE_LIMIT: 'rate_limit',
  INTERNAL_ERROR: 'internal_error',
} as const;
export type ParseErrorCode =
  (typeof ParseErrorCode)[keyof typeof ParseErrorCode];

export type ParseRequest = z.infer<typeof ParseRequestSchema>;
export type ParseResponse = z.infer<typeof ParseResponseSchema>;
export type ParsedEntry = z.infer<typeof ParsedEntrySchema>;
