"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

type InsightStats = {
  avgStreakBeforeRelapse: number;
  journalDays30: number;
  relapseCount90: number;
  lastRelapseDaysAgo: number | null;
};

type InsightsSectionProps = {
  stats: InsightStats;
  relapseByTimeBlock: { label: string; count: number }[];
  weeklyActivity: { week: string; journals: number; relapses: number }[];
  triggerCounts: { trigger: string; count: number }[];
  streakDistribution: { label: string; count: number }[];
};

const relapseTimeConfig = {
  relapses: { label: "Relapses", color: "#E11D48" },
};

const weeklyConfig = {
  journals: { label: "Journals", color: "#a1a1aa" },
  relapses: { label: "Relapses", color: "#E11D48" },
};

const triggerConfig = {
  relapses: { label: "Relapses", color: "#E11D48" },
};

const streakDistributionConfig = {
  relapses: { label: "Relapses", color: "#E11D48" },
};

export function InsightsSection({
  stats,
  relapseByTimeBlock,
  weeklyActivity,
  triggerCounts,
  streakDistribution,
}: InsightsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasRelapseTiming = relapseByTimeBlock.some((item) => item.count > 0);

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            INSIGHTS
          </h2>
          <p className="text-[#52525b] text-sm">
            Patterns in relapse timing, journaling, and streak stability.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-widest">
              Snapshot
            </CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">Last 30-90 Days</CardTitle>
              <span
                title="Key metrics from the last 30-90 days: average streak length before relapses, journaling frequency, total relapses, and time since last relapse."
                className="cursor-help"
              >
                <Info className="w-4 h-4 text-[#52525b]" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <div className="border-2 border-[#27272a] p-4 bg-[#050505]">
              <p className="text-[#52525b] text-xs uppercase tracking-widest">
                Avg Streak Before Relapse
              </p>
              <p className="text-white text-2xl font-bold">
                {stats.avgStreakBeforeRelapse} days
              </p>
            </div>
            <div className="border-2 border-[#27272a] p-4 bg-[#050505]">
              <p className="text-[#52525b] text-xs uppercase tracking-widest">
                Journal Days (30d)
              </p>
              <p className="text-white text-2xl font-bold">
                {stats.journalDays30}/30
              </p>
            </div>
            <div className="border-2 border-[#27272a] p-4 bg-[#050505]">
              <p className="text-[#52525b] text-xs uppercase tracking-widest">
                Relapses (90d)
              </p>
              <p className="text-white text-2xl font-bold">
                {stats.relapseCount90}
              </p>
            </div>
            <div className="border-2 border-[#27272a] p-4 bg-[#050505]">
              <p className="text-[#52525b] text-xs uppercase tracking-widest">
                Last Relapse
              </p>
              <p className="text-white text-2xl font-bold">
                {stats.lastRelapseDaysAgo === null
                  ? "None"
                  : `${stats.lastRelapseDaysAgo}d ago`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-widest">
              Relapses By Time Block
            </CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">Time Of Day</CardTitle>
              <span
                title="Shows when relapses typically occur throughout the day. Identifying time patterns can help you prepare for high-risk periods."
                className="cursor-help"
              >
                <Info className="w-4 h-4 text-[#52525b]" />
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {hasRelapseTiming ? (
              <ChartContainer config={relapseTimeConfig}>
                <LineChart data={relapseByTimeBlock} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke="#27272a" vertical={false} />
                  <XAxis dataKey="label" stroke="#52525b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Relapses"
                    stroke="var(--color-relapses)"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 2, stroke: "#E11D48", fill: "#050505" }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <p className="text-[#52525b] text-sm">No relapse timing data yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-widest">
              Journals vs Relapses
            </CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">Weekly Activity</CardTitle>
              <span
                title="Compares your journaling frequency against relapses week by week. Higher journaling often correlates with fewer relapses."
                className="cursor-help"
              >
                <Info className="w-4 h-4 text-[#52525b]" />
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weeklyConfig}>
              <BarChart data={weeklyActivity} margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke="#27272a" vertical={false} />
                <XAxis dataKey="week" stroke="#52525b" tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="journals" name="Journals" fill="var(--color-journals)" />
                <Bar dataKey="relapses" name="Relapses" fill="var(--color-relapses)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-widest">
              Top Triggers
            </CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">Common Reasons</CardTitle>
              <span
                title="Most frequently cited reasons for relapses. Understanding your triggers helps you develop targeted prevention strategies."
                className="cursor-help"
              >
                <Info className="w-4 h-4 text-[#52525b]" />
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {triggerCounts.length ? (
              <ChartContainer config={triggerConfig} className="h-[260px]">
                <BarChart
                  layout="vertical"
                  data={triggerCounts}
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid stroke="#27272a" horizontal={false} />
                  <XAxis type="number" stroke="#52525b" tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis
                    dataKey="trigger"
                    type="category"
                    stroke="#52525b"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" name="Relapses" fill="var(--color-relapses)" />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-[#52525b] text-sm">No trigger data yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-widest">
              Relapse Risk By Streak Length
            </CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">Streak Distribution</CardTitle>
              <span
                title="Shows how often relapses occur at different streak lengths. Early streaks (0-7 days) are the most vulnerable period. Understanding your danger zones helps you prepare for high-risk moments."
                className="cursor-help"
              >
                <Info className="w-4 h-4 text-[#52525b]" />
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {streakDistribution.some((item) => item.count > 0) ? (
              <ChartContainer config={streakDistributionConfig} className="h-[260px]">
                <BarChart
                  layout="vertical"
                  data={streakDistribution}
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid stroke="#27272a" horizontal={false} />
                  <XAxis type="number" stroke="#52525b" tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis
                    dataKey="label"
                    type="category"
                    stroke="#52525b"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" name="Relapses" fill="var(--color-relapses)" />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-[#52525b] text-sm">No streak distribution data yet.</p>
            )}
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
}
