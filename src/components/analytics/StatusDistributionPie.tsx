import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { LeadStatus } from "@/types/crm";

interface StatusDistributionPieProps {
  data: Record<LeadStatus, number>;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "hsl(199, 89%, 48%)",
  contacted: "hsl(38, 92%, 50%)",
  replied: "hsl(142, 71%, 45%)",
  positive: "hsl(142, 71%, 35%)",
  meeting: "hsl(262, 83%, 58%)",
  closed: "hsl(220, 9%, 46%)",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <span className="font-medium text-foreground capitalize">{payload[0].name}</span>
          <span className="text-muted-foreground">({payload[0].value})</span>
        </div>
      </div>
    );
  }
  return null;
};

export const StatusDistributionPie = ({ data }: StatusDistributionPieProps) => {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count,
    fill: STATUS_COLORS[status as LeadStatus],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              formatter={(value) => (
                <span className="text-sm text-muted-foreground capitalize">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};
