import { streamText, createTextStreamResponse } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { fail, getClientIp } from '@/lib/utils/api';
import { getSessions } from '@/lib/actions/sessions';
import { assemblePracticeSummary, PracticeSummary } from '@/lib/summary';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { HAIKU } from '@/lib/constants';

const SYSTEM_PROMPT = `You are analyzing a musician's practice data. Address them directly as "you."

Surface only the 2-3 MOST notable patterns or gaps — not an exhaustive rundown. Be concise: a sentence or two each.

- Describe what the data shows. Do not speculate about their intentions, motivations, or whether something is "working."
- Do not prescribe what to practice.
- Cite specific numbers, but when a number rests on few data points, say so plainly rather than drawing a conclusion.
- Ratings are on a four-level scale: poor, below, above, strong. Refer to them by name, never as a numeric score.
- Plain prose, no headings or lists. Keep it short. Short, separate paragraphs are good if they make points more easily scannable by users.
- Do not infer WHY the patterns exist — no guessing at confidence, motivation, mood, or intent. State only what the data shows. For example, say "your violin entries rated poor," not "suggesting lower confidence in violin."`;

const analyzeRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(
    process.env.VERCEL_ENV === 'production' ? 3 : 10,
    '1 m'
  ),
  prefix: 'analyze',
  analytics: true,
});

const analyze = (summary: PracticeSummary) =>
  streamText({
    model: anthropic(HAIKU),
    system: SYSTEM_PROMPT,
    prompt: `Here is the practice summary:
      ${JSON.stringify(summary, null, 2)}

      Surface the most notable patterns, trends, or gaps.`,
    temperature: 0.7,
    maxOutputTokens: 500,
  });

export async function POST(req: Request) {
  const { success } = await analyzeRateLimit.limit(getClientIp(req));
  if (!success) return fail('rate_limit');

  const sessions = await getSessions();
  const summary = assemblePracticeSummary(sessions);
  const result = analyze(summary);

  return createTextStreamResponse({ stream: result.textStream });
}
