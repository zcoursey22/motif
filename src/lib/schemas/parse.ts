import { z } from 'zod';
import { EntryFields } from './session';

export const ParseRequestSchema = z.object({
  rawText: z.string().trim().min(1).max(500),
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

export class ParseError extends Error {
  constructor(public code: ParseErrorCode) {
    super(code);
  }
}

export type ParseRequest = z.infer<typeof ParseRequestSchema>;
export type ParseResponse = z.infer<typeof ParseResponseSchema>;
export type ParsedEntry = z.infer<typeof ParsedEntrySchema>;

const parseErrorCodeMessageMap = {
  [ParseErrorCode.VALIDATION_FAILED]: 'Invalid summary text.',
  [ParseErrorCode.TIMEOUT]: 'Parsing timed out.',
  [ParseErrorCode.RATE_LIMIT]: 'Too many attempts. Try again later.',
  [ParseErrorCode.INTERNAL_ERROR]: 'Something went wrong.',
};

export const getParseErrorCodeMessage = (code: string) => {
  return parseErrorCodeMessageMap[code as ParseErrorCode];
};
