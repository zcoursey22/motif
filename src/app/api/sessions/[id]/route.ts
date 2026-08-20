import { DEMO_MODE } from '@/lib/demo';
import { db } from '@/lib/db/client';
import { entries, sessions } from '@/lib/db/schema';
import { UpdateSessionPayloadSchema } from '@/lib/schemas/session';
import { fail } from '@/lib/utils/api';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (DEMO_MODE) return fail('demo_readonly');

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail('bad_request');
  }

  const input = UpdateSessionPayloadSchema.safeParse(body);
  if (!input.success) return fail('bad_request');

  try {
    const session = await db.transaction(async tx => {
      const [updated] = await tx
        .update(sessions)
        .set({ occurredOn: input.data.occurredOn })
        .where(eq(sessions.id, id))
        .returning();

      if (!updated) return null;

      await tx.delete(entries).where(eq(entries.sessionId, id));
      if (input.data.entries.length) {
        await tx
          .insert(entries)
          .values(input.data.entries.map(e => ({ ...e, sessionId: id })));
      }
      return updated;
    });

    if (!session) return fail('not_found');
    return NextResponse.json({ session });
  } catch (e) {
    console.error('[sessions PATCH]', e);
    return fail('internal_error');
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (DEMO_MODE) return fail('demo_readonly');

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(sessions)
      .where(eq(sessions.id, id))
      .returning();

    if (!deleted) return fail('not_found');
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[sessions DELETE]', e);
    return fail('internal_error');
  }
}
