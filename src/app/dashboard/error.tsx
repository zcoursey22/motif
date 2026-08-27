'use client';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';

export default function DashboardError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <Notice>Something went wrong loading your sessions.</Notice>
      <Button color="brand" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
