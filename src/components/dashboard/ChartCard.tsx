import { ReactNode } from 'react';

type ChartCardProps = {
  title: string;
  isEmpty?: boolean;
  action?: ReactNode;
  children: ReactNode;
};

export default function ChartCard({
  title,
  isEmpty,
  action,
  children,
}: ChartCardProps) {
  return (
    <div className="h-72 flex flex-col rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-4 outline-1 outline-neutral-200 dark:outline-neutral-800 shadow-md dark:shadow-md/30">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md font-medium text-neutral-700 dark:text-neutral-300">
          {title}
        </h3>
        {action}
      </div>
      <div className="flex-1 min-h-0">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
            No data for this range.
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
