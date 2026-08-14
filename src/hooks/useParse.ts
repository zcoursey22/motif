import { ParseResponse } from '@/lib/schemas/parse';
import { AppError } from '@/lib/utils/api';
import { toLocalDateString } from '@/lib/utils/date';
import { useMutation } from '@tanstack/react-query';

async function requestParse(rawText: string): Promise<ParseResponse> {
  const res = await fetch('/api/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rawText,
      currentDateString: toLocalDateString(new Date()),
    }),
  });
  if (!res.ok)
    throw new AppError((await res.json())?.error?.code ?? 'internal_error');
  return await res.json();
}

export function useParse() {
  return useMutation({ mutationFn: requestParse, retry: false });
}
