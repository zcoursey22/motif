import { db } from '@/lib/db/client';
import { entries, sessions } from '@/lib/db/schema';
import { DEMO_MODE } from '@/lib/demo';
import { CreateSessionPayloadSchema } from '@/lib/schemas/session';
import { fail } from '@/lib/utils/api';
import { NextResponse } from 'next/server';
import { uuidv7 } from 'uuidv7';

export async function POST(req: Request) {
  if (DEMO_MODE) return fail('demo_readonly');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail('bad_request');
  }

  const input = CreateSessionPayloadSchema.safeParse(body);
  if (!input.success) {
    console.error('[sessions CREATE]', input.error);
    return fail('bad_request');
  }

  try {
    const session = await db.transaction(async tx => {
      const [created] = await tx
        .insert(sessions)
        .values({
          rawText: input.data.rawText,
          occurredOn: input.data.occurredOn,
        })
        .returning();
      await tx.insert(entries).values(
        input.data.entries.map(e => ({
          ...e,
          sessionId: created.id,
          id: uuidv7(),
        }))
      );
      return created;
    });
    return NextResponse.json({ session }, { status: 201 });
  } catch (e) {
    console.error('[sessions CREATE]', e);
    return fail('internal_error');
  }
}
