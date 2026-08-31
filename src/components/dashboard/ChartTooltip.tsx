import { ReactNode } from 'react';

type ChartTooltipProps = {
  title?: string;
  children: ReactNode;
};

export default function ChartTooltip({ title, children }: ChartTooltipProps) {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl p-3 text-xs shadow-md dark:shadow-md/30 border-2 border-neutral-300 dark:border-neutral-700">
      {title && (
        <div className="font-medium mb-1 text-neutral-600 dark:text-neutral-300">
          {title}
        </div>
      )}
      <div className="flex flex-col gap-0.5 text-neutral-500 dark:text-neutral-400">
        {children}
      </div>
    </div>
  );
}
