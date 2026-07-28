import { NextResponse } from 'next/server';

export function fail(code: AppErrorCode) {
  return NextResponse.json({ error: { code } }, { status: ERROR_STATUS[code] });
}

export class AppError extends Error {
  constructor(public code: AppErrorCode) {
    super(code);
  }
}

export const AppErrorCode = {
  BAD_REQUEST: 'bad_request',
  INTERNAL_ERROR: 'internal_error',
  TIMEOUT: 'timeout',
  RATE_LIMIT: 'rate_limit',
} as const;
export type AppErrorCode = (typeof AppErrorCode)[keyof typeof AppErrorCode];

const ERROR_MESSAGE: Record<AppErrorCode, string> = {
  bad_request: 'Invalid request.',
  internal_error: 'Something went wrong.',
  timeout: 'Request timed out.',
  rate_limit: 'Too many attempts. Try again later.',
};

const ERROR_STATUS: Record<AppErrorCode, number> = {
  bad_request: 400,
  internal_error: 500,
  timeout: 504,
  rate_limit: 429,
};

export const getErrorMessage = (code: string) =>
  ERROR_MESSAGE[code as AppErrorCode] ?? 'Something went wrong.';
