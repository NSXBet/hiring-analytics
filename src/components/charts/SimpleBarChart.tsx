import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartPoint } from "@/types";
import { CHART_COLORS } from "@/lib/constants";

interface SimpleBarChartProps {
  data: ChartPoint[];
  label: string;
  colorMap?: Record<string, string>;
  fallbackColors?: string[];
  orientation?: "vertical" | "horizontal";
}

const SimpleBarChart = ({
  data,
  label,
  colorMap,
  fallbackColors = CHART_COLORS,
  orientation = "vertical",
}: SimpleBarChartProps) => {
  const chartConfig = { value: { label, color: "hsl(var(--chart-1))" } };
  const isHorizontal = orientation === "horizontal";

  return (
    <ChartContainer config={chartConfig} className="aspect-[16/10] w-full min-h-[340px]">
      <BarChart
        data={data}
        layout={isHorizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 16, bottom: isHorizontal ? 8 : 56, left: isHorizontal ? 100 : 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        {isHorizontal ? (
          <>
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={92}
              interval={0}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              angle={data.length > 6 ? -35 : 0}
              textAnchor={data.length > 6 ? "end" : "middle"}
              height={data.length > 6 ? 60 : 32}
            />
            <YAxis type="number" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
          </>
        )}
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colorMap?.[entry.name] || fallbackColors[index % fallbackColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default SimpleBarChart;
