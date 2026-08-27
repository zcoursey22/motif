'use client';

import { Button } from '@/components/ui/Button';
import { CircleAlert } from 'lucide-react';

export default function DashboardError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <div
        className={`text-red-500 dark:text-red-400 inline-flex justify-center items-center gap-2`}
      >
        <CircleAlert />
        <span className="text-neutral-600 dark:text-neutral-300">
          Something went wrong loading your sessions.
        </span>
      </div>
      <Button color="brand" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
