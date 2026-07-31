import 'server-only';
import { db } from '../db/client';

export async function getSessions() {
  return db.query.sessions.findMany({
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
}
