"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CHART_COLORS = {
  primary: "#2563EB",
  primaryLight: "rgba(37, 99, 235, 0.15)",
  secondary: "#10B981",
  secondaryLight: "rgba(16, 185, 129, 0.15)",
  muted: "#64748B",
  grid: "#E2E8F0",
};

function formatDate(label: string) {
  const d = new Date(label);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatShortDate(label: string) {
  const d = new Date(label);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "numeric" });
}

export function SubmissionsOverTimeChart({ data }: { data: { date: string; submissions: number }[] }) {
  const chartData = data.map((d) => ({ ...d, label: formatDate(d.date) }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="submissionsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
            <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontSize: 13,
          }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.date && formatDate(payload[0].payload.date)}
          formatter={(value) => [Number(value ?? 0), "Submissions"]}
        />
        <Area
          type="monotone"
          dataKey="submissions"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          fill="url(#submissionsGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ViewsOverTimeChart({ data }: { data: { date: string; views: number }[] }) {
  const chartData = data.map((d) => ({ ...d, label: formatDate(d.date) }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
            <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontSize: 13,
          }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.date && formatDate(payload[0].payload.date)}
          formatter={(value) => [Number(value ?? 0), "Views"]}
        />
        <Area
          type="monotone"
          dataKey="views"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          fill="url(#viewsGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FormPerformanceBarChart({
  data,
}: {
  data: { id: string; title: string; views: number; submissions: number }[];
}) {
  const chartData = data.slice(0, 8).map((d) => ({
    ...d,
    name: d.title.length > 20 ? d.title.slice(0, 20) + "…" : d.title,
    fullName: d.title,
  }));
  if (chartData.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 44)}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontSize: 13,
          }}
          formatter={(value, name) => [Number(value ?? 0), name === "views" ? "Views" : "Submissions"]}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value) => (value === "views" ? "Views" : "Submissions")}
        />
        <Bar dataKey="views" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} name="views" />
        <Bar dataKey="submissions" fill={CHART_COLORS.secondary} radius={[0, 4, 4, 0]} name="submissions" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ConversionRateBarChart({
  data,
}: {
  data: { id: string; title: string; conversionRate: number }[];
}) {
  const chartData = data
    .slice(0, 8)
    .filter((d) => d.conversionRate > 0)
    .map((d) => ({
      ...d,
      name: d.title.length > 18 ? d.title.slice(0, 18) + "…" : d.title,
      fullName: d.title,
      rate: Number(d.conversionRate.toFixed(1)),
    }));
  if (chartData.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 36)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, "auto"]}
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontSize: 13,
          }}
          formatter={(value) => [`${Number(value ?? 0)}%`, "Conversion"]}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName}
        />
        <Bar dataKey="rate" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} name="Conversion %" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ViewsVsSubmissionsChart({
  data,
}: {
  data: { date: string; views: number; submissions: number }[];
}) {
  const chartData = data.map((d) => ({
    ...d,
    label: formatShortDate(d.date),
  }));
  if (chartData.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="viewsVsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.25} />
            <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="subVsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.secondary} stopOpacity={0.25} />
            <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontSize: 13,
          }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.date && formatDate(payload[0].payload.date)}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="views" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#viewsVsGrad)" name="Views" />
        <Area type="monotone" dataKey="submissions" stroke={CHART_COLORS.secondary} strokeWidth={2} fill="url(#subVsGrad)" name="Submissions" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
