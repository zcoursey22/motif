import { AppError } from '@/lib/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

async function streamAnalyze(onChunk: (full: string) => void): Promise<string> {
  const res = await fetch('/api/analyze', { method: 'POST' });
  if (!res.ok || !res.body)
    throw new AppError((await res.json())?.error?.code ?? 'internal_error');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onChunk(full);
  }

  return full;
}

export function useAnalyze() {
  const [text, setText] = useState('');

  const mutation = useMutation({
    mutationFn: () => {
      setText('');
      return streamAnalyze(setText);
    },
    retry: false,
  });

  return { ...mutation, text };
}
