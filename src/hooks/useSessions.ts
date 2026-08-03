'use client';

import { getSessions } from '@/lib/actions/sessions';
import { SESSIONS_QUERY_KEY } from '@/lib/constants';
import {
  CreateSessionPayload,
  UpdateSessionPayload,
} from '@/lib/schemas/session';
import { AppError } from '@/lib/utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

async function createSession(payload: CreateSessionPayload) {
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

async function updateSession({
  id,
  payload,
}: {
  id: string;
  payload: UpdateSessionPayload;
}) {
  const res = await fetch(`/api/sessions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new AppError(body?.error?.code ?? 'server_error');
  }
  return res.json();
}

async function deleteSession({ id }: { id: string }) {
  const res = await fetch(`/api/sessions/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new AppError(body?.error?.code ?? 'server_error');
  }
  return res.json();
}

export function useSessions() {
  return useQuery({
    queryKey: [SESSIONS_QUERY_KEY],
    queryFn: () => getSessions(),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
  });
}
