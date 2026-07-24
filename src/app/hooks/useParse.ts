import { useMutation } from '@tanstack/react-query';
import { parse } from '../api/parse/route';

export function useParse() {
  return useMutation({ mutationFn: parse, retry: false });
}
