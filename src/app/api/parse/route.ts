import { NextResponse } from 'next/server';
import { ParseRequestSchema } from '@/lib/schemas/parse';
import { fail } from '@/lib/utils/api';
import { ParsedEntry, ParsedEntrySchema } from '@/lib/schemas/session';
import { generateText, Output } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const SYSTEM_PROMPT = `You convert a musician's freeform practice notes into structured practice entries.

Split the note into one entry per distinct practice activity. A new activity begins when the instrument changes or when the focus of practice clearly shifts, for example moving from scales to repertoire. One sentence can hold several activities, and one activity can span several sentences. Do not merge unrelated work into a single entry, and do not split one continuous activity into several.

Rules for every field:
- instrument: the instrument used, or null if the note does not name one. Do not infer it from the style of music.
- focus: short lowercase tags for what was worked on, such as scales, voicings, transcription, sight-reading. Prefer the musician's own words when they map cleanly to a tag. One tag per distinct concept. Empty array if no focus is given.
- durationMin: whole minutes, only when the note states or directly implies a time. Null otherwise. Never estimate.
- selfRating: only when the musician says how it went. Map their sentiment to the rating scale. Null if they do not say.

Use only what is in the note. When something is not stated, use null, or an empty array for focus. Never fill a field to avoid leaving it empty. Return every activity in the order it appears.`;

const parse = async (rawText: string): Promise<ParsedEntry[]> => {
  const { output } = await generateText({
    model: anthropic('claude-haiku-4-5-20251001'),
    output: Output.array({ element: ParsedEntrySchema }),
    system: SYSTEM_PROMPT,
    prompt: rawText,
    temperature: 0,
  });
  console.log(output);
  if (!output) throw new Error('LLM parse produced no output');
  return output;
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
    return NextResponse.json({ entries });
  } catch (e) {
    console.error('[parse]', e);
    return fail('internal_error');
  }
}
