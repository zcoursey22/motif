'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ratingTrend, type RatingPoint, type TimeBucket } from '@/lib/summary';
import { RATING_ORDER } from '@/lib/constants';
import { parseLocalDate } from '@/lib/utils/date';
import ChartCard from '../ChartCard';
import ChartTooltip from '../ChartTooltip';
import {
  AXIS_TICK,
  CHART_COLOR,
  CHART_MARGIN,
  GRID_PROPS,
  TOOLTIP_CURSOR,
} from '@/lib/chartTheme';
import { EntryWithDate } from '@/lib/utils/session';

function formatDate(value: unknown): string {
  return parseLocalDate(String(value)).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function formatRating(value: number): string {
  const r = RATING_ORDER[value];
  return r ? r.charAt(0).toUpperCase() + r.slice(1) : '';
}

export default function RatingChart({
  entries,
  bucket,
  start,
}: {
  entries: EntryWithDate[];
  bucket: TimeBucket;
  start: Date;
}) {
  const data = useMemo(
    () => ratingTrend(entries, bucket, start),
    [entries, bucket, start]
  );

  const hasAnyRating = data.some(p => p.avg !== null);

  return (
    <ChartCard title="Rating" isEmpty={!hasAnyRating}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid
            strokeDasharray={GRID_PROPS.strokeDasharray}
            className={GRID_PROPS.className}
          />
          <XAxis dataKey="date" tickFormatter={formatDate} tick={AXIS_TICK} />
          <YAxis
            type="number"
            domain={[0, RATING_ORDER.length - 1]}
            ticks={RATING_ORDER.map((_, i) => i)}
            tickFormatter={formatRating}
            tick={AXIS_TICK}
            width={70}
          />
          <Tooltip
            cursor={TOOLTIP_CURSOR}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as RatingPoint;
              if (p.avg === null) return null;
              return (
                <ChartTooltip title={formatDate(label)}>
                  <div>
                    {formatRating(Math.round(p.avg))} ({p.avg.toFixed(1)})
                    average
                  </div>
                  <div>
                    {p.count} rated {p.count === 1 ? 'entry' : 'entries'}
                  </div>
                </ChartTooltip>
              );
            }}
          />
          <Line
            type="linear"
            dataKey="avg"
            stroke={CHART_COLOR}
            strokeWidth={2}
            dot={{ r: 4 }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
