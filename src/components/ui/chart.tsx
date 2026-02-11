import * as React from "react";
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  type TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContainerProps = React.ComponentProps<"div"> & {
  config?: ChartConfig;
  // Recharts ResponsiveContainer expects a single ReactElement or a render function.
  // We narrow this from React.ReactNode so TypeScript is satisfied.
  children: React.ReactElement;
};

function ChartStyle({ id, config }: { id: string; config?: ChartConfig }) {
  if (!config) {
    return null;
  }

  const entries = Object.entries(config).filter(([, value]) => value.color);
  if (!entries.length) {
    return null;
  }

  const styles = entries
    .map(([key, value]) => {
      return `--color-${key}: ${value.color};`;
    })
    .join("\n");

  return (
    <style>{`[data-chart="${id}"] { ${styles} }`}</style>
  );
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, config, children, ...props }, ref) => {
    const [chartId] = React.useState(
      () => id ?? `chart-${Math.random().toString(36).slice(2)}`
    );

    return (
      <div
        ref={ref}
        data-chart={chartId}
        className={cn("h-[240px] w-full text-xs text-[#a1a1aa]", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = RechartsTooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="border-2 border-[#27272a] bg-[#050505] px-3 py-2 font-mono text-xs text-[#a1a1aa] shadow-[6px_6px_0_0_#1a1a1a]">
      {label ? <div className="text-white text-xs">{label}</div> : null}
      <div className="mt-1 space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey as string} className="flex items-center gap-2">
            <span
              className="h-2 w-2 border border-[#27272a]"
              style={{ background: entry.color }}
            />
            <span className="uppercase tracking-widest text-[10px]">
              {entry.name}
            </span>
            <span className="text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
