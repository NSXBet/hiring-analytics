import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartPoint } from "@/types";
import { CHART_COLORS } from "@/lib/constants";

interface StatusDistributionChartProps {
  data: ChartPoint[];
}

const StatusDistributionChart = ({ data }: StatusDistributionChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 min-h-0">
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
              formatter={(value: number, name: string) => [`${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`, name]}
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--background))",
              }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
          </RePieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="truncate text-muted-foreground" title={item.name}>
              {item.name}: <strong className="text-foreground">{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDistributionChart;
