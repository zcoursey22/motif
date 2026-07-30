import { ParsedEntry } from '@/lib/schemas/session';
import { AppError } from '@/lib/utils/api';
import { useMutation } from '@tanstack/react-query';

async function requestParse(rawText: string): Promise<ParsedEntry[]> {
  const res = await fetch('/api/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText }),
  });
  if (!res.ok)
    throw new AppError((await res.json())?.error?.code ?? 'internal_error');
  return (await res.json()).entries;
}

export function useParse() {
  return useMutation({ mutationFn: requestParse, retry: false });
}
