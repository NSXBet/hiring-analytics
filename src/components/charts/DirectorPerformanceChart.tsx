import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartPoint } from "@/types";
import { DIRECTOR_COLORS } from "@/lib/constants";

interface DirectorPerformanceChartProps {
  data: ChartPoint[];
}

const chartConfig = {
  value: { label: "Contratações", color: "hsl(var(--chart-1))" },
};

const DirectorPerformanceChart = ({ data }: DirectorPerformanceChartProps) => (
  <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
    <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
      <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={DIRECTOR_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ChartContainer>
);

export default DirectorPerformanceChart;
