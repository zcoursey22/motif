'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Ranked } from '@/lib/summary';
import ChartCard from '../ChartCard';
import ChartTooltip from '../ChartTooltip';
import {
  AXIS_TICK,
  CHART_COLOR,
  GRID_PROPS,
  TOOLTIP_CURSOR,
} from '@/lib/chartTheme';

export default function BreakdownChart<T extends string>({
  title,
  data,
  labels,
  noun,
}: {
  title: string;
  data: Ranked<T>[];
  labels: Record<T, string>;
  noun: string;
}) {
  const rows = useMemo(
    () => data.map(({ key, count }) => ({ name: labels[key], count })),
    [data, labels]
  );

  return (
    <ChartCard title={title} isEmpty={!rows.length}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray={GRID_PROPS.strokeDasharray}
            className={GRID_PROPS.className}
            horizontal={false}
          />
          <XAxis type="number" tick={AXIS_TICK} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={AXIS_TICK}
            width={90}
            interval={0}
          />
          <Tooltip
            cursor={TOOLTIP_CURSOR}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as { name: string; count: number };
              return (
                <ChartTooltip title={row.name}>
                  <div>
                    {row.count} {noun}
                  </div>
                </ChartTooltip>
              );
            }}
          />
          <Bar dataKey="count" fill={CHART_COLOR} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
