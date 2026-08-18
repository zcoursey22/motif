import { NextResponse } from 'next/server';

export function fail(code: AppErrorCode) {
  return NextResponse.json({ error: { code } }, { status: ERROR_STATUS[code] });
}

export class AppError extends Error {
  constructor(public code: AppErrorCode) {
    super(getErrorMessage(code));
    this.name = 'AppError';
  }
}

export const AppErrorCode = {
  BAD_REQUEST: 'bad_request',
  NOT_FOUND: 'not_found',
  INTERNAL_ERROR: 'internal_error',
  TIMEOUT: 'timeout',
  RATE_LIMIT: 'rate_limit',
} as const;
export type AppErrorCode = (typeof AppErrorCode)[keyof typeof AppErrorCode];

const ERROR_MESSAGE: Record<AppErrorCode, string> = {
  bad_request: 'Invalid request.',
  not_found: 'Resource not found.',
  internal_error: 'Something went wrong.',
  timeout: 'Request timed out.',
  rate_limit: 'Too many attempts. Try again later.',
};

const ERROR_STATUS: Record<AppErrorCode, number> = {
  bad_request: 400,
  not_found: 404,
  internal_error: 500,
  timeout: 504,
  rate_limit: 429,
};

export const getErrorMessage = (code: string) =>
  ERROR_MESSAGE[code as AppErrorCode] ?? 'Something went wrong.';

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
  );
}
