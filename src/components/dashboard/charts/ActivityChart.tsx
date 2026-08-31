'use client';

import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { SessionWithEntries } from '@/lib/schemas/session';
import { ActivityPoint, activityTrend, type TimeBucket } from '@/lib/summary';
import { parseLocalDate } from '@/lib/utils/date';
import ChartCard from '../ChartCard';
import ChartTooltip from '../ChartTooltip';
import {
  AXIS_TICK,
  BAR_RADIUS,
  CHART_COLOR,
  CHART_MARGIN,
  GRID_PROPS,
  TOOLTIP_CURSOR,
} from '@/lib/chartTheme';

type Metric = 'sessions' | 'entries' | 'minutes';

const METRICS: { key: Metric; label: string }[] = [
  { key: 'sessions', label: 'Sessions' },
  { key: 'entries', label: 'Entries' },
  { key: 'minutes', label: 'Minutes' },
];

function formatTick(value: unknown): string {
  return parseLocalDate(String(value)).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function ActivityChart({
  sessions,
  bucket,
  start,
}: {
  sessions: SessionWithEntries[];
  bucket: TimeBucket;
  start: Date;
}) {
  const [metric, setMetric] = useState<Metric>('sessions');
  const data = useMemo(
    () => activityTrend(sessions, bucket, start),
    [sessions, bucket, start]
  );

  const toggle = (
    <div className="flex gap-1">
      {METRICS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setMetric(key)}
          className={`px-2 py-1 rounded-lg cursor-pointer font-medium text-xs ${
            metric === key
              ? 'text-white bg-indigo-400 dark:bg-indigo-500'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <ChartCard title="Activity" action={toggle} isEmpty={!data.length}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid
            strokeDasharray={GRID_PROPS.strokeDasharray}
            className={GRID_PROPS.className}
          />
          <XAxis dataKey="date" tickFormatter={formatTick} tick={AXIS_TICK} />
          <YAxis tick={AXIS_TICK} allowDecimals={false} />
          <Tooltip
            cursor={TOOLTIP_CURSOR}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as ActivityPoint;
              return (
                <ChartTooltip title={formatTick(label)}>
                  <div>{p.sessions} sessions</div>
                  <div>{p.entries} entries</div>
                  <div>{p.minutes} min</div>
                </ChartTooltip>
              );
            }}
          />
          <Bar dataKey={metric} fill={CHART_COLOR} radius={BAR_RADIUS} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
