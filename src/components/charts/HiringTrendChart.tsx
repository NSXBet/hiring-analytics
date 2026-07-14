import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartPoint } from "@/types";

interface HiringTrendChartProps {
  data: ChartPoint[];
}

const chartConfig = {
  hired: { label: "Hired", color: "hsl(var(--chart-2))" },
  opened: { label: "Open", color: "hsl(var(--chart-1))" },
};

const HiringTrendChart = ({ data }: HiringTrendChartProps) => (
  <ChartContainer config={chartConfig} className="aspect-[16/10] w-full min-h-[340px]">
    <LineChart data={data} margin={{ top: 8, right: 16, bottom: data.length > 6 ? 64 : 32, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis
        dataKey="name"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        interval={0}
        angle={data.length > 6 ? -35 : 0}
        textAnchor={data.length > 6 ? "end" : "middle"}
        height={data.length > 6 ? 60 : 32}
      />
      <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Line type="monotone" dataKey="hired" stroke="var(--color-hired)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      <Line type="monotone" dataKey="opened" stroke="var(--color-opened)" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 4" />
    </LineChart>
  </ChartContainer>
);

export default HiringTrendChart;
