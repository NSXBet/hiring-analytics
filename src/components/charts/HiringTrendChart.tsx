import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartPoint } from "@/types";

interface HiringTrendChartProps {
  data: ChartPoint[];
}

const chartConfig = {
  hired: { label: "Contratados", color: "hsl(var(--chart-2))" },
  opened: { label: "Abertas", color: "hsl(var(--chart-1))" },
};

const HiringTrendChart = ({ data }: HiringTrendChartProps) => (
  <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
    <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
      <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Line type="monotone" dataKey="hired" stroke="var(--color-hired)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      <Line type="monotone" dataKey="opened" stroke="var(--color-opened)" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 4" />
    </LineChart>
  </ChartContainer>
);

export default HiringTrendChart;
