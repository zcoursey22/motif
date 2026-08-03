import { db } from '@/lib/db/client';
import { entries, sessions } from '@/lib/db/schema';
import { CreateSessionPayloadSchema } from '@/lib/schemas/session';
import { fail } from '@/lib/utils/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail('bad_request');
  }

  const input = CreateSessionPayloadSchema.safeParse(body);
  if (!input.success) return fail('bad_request');

  await new Promise(r => setTimeout(r, 1500));
  try {
    const session = await db.transaction(async tx => {
      const [created] = await tx
        .insert(sessions)
        .values({
          rawText: input.data.rawText,
          occurredOn: input.data.occurredOn,
        })
        .returning();
      await tx
        .insert(entries)
        .values(input.data.entries.map(e => ({ ...e, sessionId: created.id })));
      return created;
    });
    const responses = [
      NextResponse.json({ session }, { status: 201 }),
      fail('internal_error'),
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  } catch (e) {
    console.error('[sessions CREATE]', e);
    return fail('internal_error');
  }
}
