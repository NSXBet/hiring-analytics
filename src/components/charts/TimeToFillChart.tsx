import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartPoint } from "@/types";
import { CHART_COLORS } from "@/lib/constants";

interface TimeToFillChartProps {
  data: ChartPoint[];
}

const chartConfig = {
  value: { label: "Dias", color: "hsl(var(--chart-1))" },
};

const TimeToFillChart = ({ data }: TimeToFillChartProps) => (
  <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
    <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
      <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ChartContainer>
);

export default TimeToFillChart;
