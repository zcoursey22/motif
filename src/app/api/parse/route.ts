import { NextResponse } from 'next/server';
import {
  ParseRequestSchema,
  ParseResponse,
  ParseResponseSchema,
} from '@/lib/schemas/parse';
import { fail, getClientIp } from '@/lib/utils/api';
import { generateText, Output } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { getLocalWeekday, parseLocalDate } from '@/lib/utils/date';
import { isEntryValid } from '@/lib/schemas/session';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { HAIKU } from '@/lib/constants';

const SYSTEM_PROMPT = `You convert a musician's freeform practice note into structured data.

Input format:
"
Current local date: [YYYY-MM-DD] ([WEEKDAY])
Raw text:
[RAW_TEXT]
"

You return two things: occurredOn (when the practice happened) and entries (the activities).

occurredOn — a single date as YYYY-MM-DD:
- Resolve all date and day references against the current local date and weekday given above.
- "Yesterday" is the day before the current date. "Today", "tonight", "this morning" is the current date.
- A bare weekday ("on Tuesday") is the most recent past occurrence of that weekday.
- "Last [weekday]" is that weekday in the previous calendar week. Weeks start Monday.
- If the note gives no time cue, use the current local date.
- Never return a date after the current local date.

occurredOn must always be a concrete date. When the note is vague, resolve to a single reasonable day rather than leaving it unset: "last week" is last week's Monday (from the table), "last month" is the first of the previous month, and anything with no usable time cue is the current local date. This differs from the entry fields: never invent an entry value to avoid an empty one, but always resolve occurredOn to a real date.

If multiple dates can be inferred, just use the more recent one.

entries — one entry per distinct practice activity. A new activity begins when the instrument changes or the focus clearly shifts, for example moving from scales to repertoire. One sentence can hold several activities, and one activity can span several sentences. Do not merge unrelated work into one entry, and do not split one continuous activity into several.

Each entry field:
- instrument: the instrument used, or null if the note does not name one. Generally try not infer it from the style of music unless its required to try to resolve ambiuguity.
- focus: short lowercase tags for what was worked on, such as scales, voicings, transcription. Prefer the musician's own words when they map cleanly to a tag. One tag per distinct concept. Empty array if none is given.
- durationMin: whole minutes, only when stated or directly implied. Null otherwise. Never estimate.
- selfRating: only when the musician says how it went. Map their sentiment to the rating scale. Null if they do not say.

If the note contains no practice activity, return entries as an empty array. Do not create an entry for input with no musical content.

Use only what is in the note. When something is not stated, use null, or an empty array for focus. Never fill a field to avoid leaving it empty. Return every activity in the order it appears.`;

const parseRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(
    process.env.VERCEL_ENV === 'production' ? 3 : 10,
    '1 m'
  ),
  prefix: 'parse',
  analytics: true,
});

const parse = async (
  rawText: string,
  currentDateString: string
): Promise<ParseResponse> => {
  const { output } = await generateText({
    model: anthropic(HAIKU),
    output: Output.object({ schema: ParseResponseSchema }),
    system: SYSTEM_PROMPT,
    prompt: `Current local date: ${currentDateString} (${getLocalWeekday(parseLocalDate(currentDateString))})
              \nRaw text:
              \n${rawText}`,
    temperature: 0,
  });
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

  const { success } = await parseRateLimit.limit(getClientIp(req));
  if (!success) return fail('rate_limit');

  try {
    const { entries, occurredOn } = await parse(
      input.data.rawText,
      input.data.currentDateString
    );
    const validEntries = entries.filter(isEntryValid);
    return NextResponse.json({
      entries: validEntries,
      occurredOn:
        occurredOn > input.data.currentDateString
          ? input.data.currentDateString
          : occurredOn,
    });
  } catch (e) {
    console.error('[parse]', e);
    return fail('internal_error');
  }
}
