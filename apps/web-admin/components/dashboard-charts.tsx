'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface ChartDataPoint {
  date: string;
  bookingCount: number;
  orderCount: number;
  bookingRevenue: number;
  orderRevenue: number;
}

interface DashboardChartsProps {
  data: ChartDataPoint[];
}

function formatRevenue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

export function DashboardCharts({ data }: DashboardChartsProps): JSX.Element {
  if (data.length === 0) return <></>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-lg border bg-background p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Số lượt theo ngày
        </h3>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v?.slice(-5) ?? v}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelFormatter={(label) => `Ngày ${label}`}
              />
              <Legend />
              <Bar
                dataKey="bookingCount"
                name="Đặt xe"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="orderCount"
                name="Đơn hàng"
                fill="hsl(142 76% 36%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Doanh thu theo ngày (đ)
        </h3>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v?.slice(-5) ?? v}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={formatRevenue}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  `${formatRevenue(value)} đ`,
                  name,
                ]}
                labelFormatter={(label) => `Ngày ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="bookingRevenue"
                name="Đặt xe"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="orderRevenue"
                name="Đơn hàng"
                stroke="hsl(142 76% 36%)"
                fill="hsl(142 76% 36% / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
