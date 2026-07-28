import { NextResponse } from 'next/server';
import { ParseRequestSchema } from '@/lib/schemas/parse';
import { SelfRating } from '@/lib/constants';
import { fail } from '@/lib/utils/api';
import { ParsedEntry } from '@/lib/schemas/session';

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

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail('bad_request');
  }

  const input = ParseRequestSchema.safeParse(body);
  if (!input.success) return fail('bad_request');

  try {
    const entries = await parse(input.data.rawText);
    const responses = [
      NextResponse.json({ entries }),
      NextResponse.json({ entries: [] }),
      fail('internal_error'),
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  } catch (e) {
    console.error('[parse]', e);
    return fail('internal_error');
  }
}
