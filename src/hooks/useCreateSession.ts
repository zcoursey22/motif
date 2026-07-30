import { CreateSession } from '@/lib/schemas/session';
import { AppError } from '@/lib/utils/api';
import { useMutation } from '@tanstack/react-query';

async function createSession(payload: CreateSession) {
  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new AppError(body?.error?.code ?? 'server_error');
  }
  return res.json();
}

export function useCreateSession() {
  return useMutation({ mutationFn: createSession, retry: false });
}
