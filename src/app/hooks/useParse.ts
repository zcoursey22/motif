import { ParseError, ParseErrorCode } from '@/lib/schemas/parse';
import { useMutation } from '@tanstack/react-query';

async function requestParse(rawText: string) {
  const res = await fetch('/api/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText }),
  });
  if (!res.ok)
    throw new ParseError(
      (await res.json())?.error?.code ?? ParseErrorCode.INTERNAL_ERROR
    );
  return (await res.json()).entries;
}

export function useParse() {
  return useMutation({ mutationFn: requestParse, retry: false });
}
