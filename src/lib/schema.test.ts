import { describe, it, expect } from 'vitest';
import type { z } from 'zod';
import { EntrySchema } from './schemas';
import { SelfRating } from './constants';

export function expectParseSuccess<T>(
  result: z.ZodSafeParseResult<T>
): asserts result is z.ZodSafeParseSuccess<T> {
  expect(result.success ? [] : result.error.issues).toEqual([]);
}

export function expectParseFailure(
  result: z.ZodSafeParseResult<unknown>,
  ...paths: string[]
) {
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues.map(i => i.path[0]).sort()).toEqual(
      paths.sort()
    );
  }
}

const entryBase = {
  id: '00000000-0000-0000-0000-000000000001',
  sessionId: '00000000-0000-0000-0000-000000000000',
  instrument: 'piano',
  focus: ['jazz', 'voicings'],
  durationMin: 40,
  selfRating: SelfRating.ABOVE,
};

describe('EntrySchema', () => {
  it('accepts a fully populated valid entry', () => {
    const result = EntrySchema.safeParse({
      ...entryBase,
    });
    expectParseSuccess(result);
  });

  it('accepts a null instrument', () => {
    const result = EntrySchema.safeParse({
      ...entryBase,
      instrument: null,
    });
    expectParseSuccess(result);
  });

  it('rejects a selfRating outside the enum', () => {
    const result = EntrySchema.safeParse({
      ...entryBase,
      selfRating: 'invalid_string',
    });
    expectParseFailure(result, 'selfRating');
  });
});
