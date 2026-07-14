import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartPoint } from "@/types";
import { CHART_COLORS } from "@/lib/constants";

interface StatusDistributionChartProps {
  data: ChartPoint[];
}

const StatusDistributionChart = ({ data }: StatusDistributionChartProps) => (
  <ResponsiveContainer width="100%" height="100%">
    <RePieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius="55%"
        outerRadius="80%"
        paddingAngle={2}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          borderRadius: "0.5rem",
          border: "1px solid hsl(var(--border))",
          backgroundColor: "hsl(var(--background))",
        }}
        itemStyle={{ color: "hsl(var(--foreground))" }}
      />
    </RePieChart>
  </ResponsiveContainer>
);

export default StatusDistributionChart;
