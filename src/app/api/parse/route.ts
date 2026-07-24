import { NextResponse } from 'next/server';
import {
  ParseErrorCode,
  ParseRequestSchema,
  type ParsedEntry,
} from '@/lib/schemas/parse';
import { SelfRating } from '@/lib/constants';

export const parse = async (rawText: string): Promise<ParsedEntry[]> => {
  await new Promise(r => setTimeout(r, 1500));
  return [
    {
      instrument: 'guitar',
      focus: ['jazz', 'repertoire'],
      durationMin: null,
      selfRating: SelfRating.BELOW,
    },
    {
      instrument: null,
      focus: ['scales'],
      durationMin: 10,
      selfRating: null,
    },
    {
      instrument: 'piano',
      focus: [],
      durationMin: 15,
      selfRating: SelfRating.STRONG,
    },
    {
      instrument: null,
      focus: ['theory', 'reading', 'aural'],
      durationMin: null,
      selfRating: null,
    },
  ];
};

const ERROR_STATUS: Record<ParseErrorCode, number> = {
  [ParseErrorCode.VALIDATION_FAILED]: 400,
  [ParseErrorCode.TIMEOUT]: 504,
  [ParseErrorCode.RATE_LIMIT]: 429,
  [ParseErrorCode.INTERNAL_ERROR]: 502,
};

const fail = (code: ParseErrorCode) =>
  NextResponse.json({ error: { code } }, { status: ERROR_STATUS[code] });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(ParseErrorCode.VALIDATION_FAILED);
  }

  const input = ParseRequestSchema.safeParse(body);
  if (!input.success) return fail(ParseErrorCode.VALIDATION_FAILED);

  try {
    const entries = await parse(input.data.rawText);
    const responses = [
      NextResponse.json({ entries }),
      NextResponse.json({ entries: [] }),
      fail(ParseErrorCode.INTERNAL_ERROR),
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  } catch (e) {
    console.error(e);
    return fail(ParseErrorCode.INTERNAL_ERROR);
  }
}
