import { ReactNode } from 'react';

type InsightCardProps = {
  title: string;
  children: ReactNode;
};

export default function InsightCard({ title, children }: InsightCardProps) {
  return (
    <div className="flex flex-col gap-2 flex-1 bg-neutral-100 dark:bg-neutral-900 px-6 py-4 rounded-2xl outline-1 outline-neutral-200 dark:outline-neutral-800 shadow-md dark:shadow-md/30">
      <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
        {title}
      </span>
      {children}
    </div>
  );
}
