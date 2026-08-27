'use server';

import { db } from '../db/client';

export async function getSessions() {
  try {
    return await db.query.sessions.findMany({
      with: {
        entries: {
          orderBy: (entries, { asc }) => [asc(entries.id)],
        },
      },
      orderBy: (sessions, { desc }) => [
        desc(sessions.occurredOn),
        desc(sessions.createdAt),
      ],
    });
  } catch (e) {
    console.error('getSessions DB query failure:', e);
    throw e;
  }
}
