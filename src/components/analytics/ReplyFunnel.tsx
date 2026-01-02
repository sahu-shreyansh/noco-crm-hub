import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface ReplyFunnelProps {
  data: FunnelStage[];
}

const STAGE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--info))",
  "hsl(142, 71%, 45%)",
  "hsl(142, 71%, 55%)",
  "hsl(262, 83%, 58%)",
];

export const ReplyFunnel = ({ data }: ReplyFunnelProps) => {
  const maxCount = data[0]?.count || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Reply Conversion Funnel</h3>
        <div className="space-y-4">
          {data.map((stage, index) => {
            const widthPercentage = (stage.count / maxCount) * 100;
            const conversionRate =
              index > 0 ? Math.round((stage.count / data[index - 1].count) * 100) : 100;

            return (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                    {index > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {conversionRate}% from previous
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {stage.count.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="h-10 bg-muted rounded-xl overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + 0.1 * index, ease: "easeOut" }}
                    className="h-full rounded-xl flex items-center justify-end pr-3"
                    style={{
                      background: `linear-gradient(90deg, ${STAGE_COLORS[index]} 0%, ${STAGE_COLORS[index]}dd 100%)`,
                    }}
                  >
                    {widthPercentage > 15 && (
                      <span className="text-xs font-medium text-white/90">
                        {stage.percentage}%
                      </span>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Funnel Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Conversion</span>
            <span className="font-semibold text-foreground">
              {data.length > 1
                ? Math.round((data[data.length - 1].count / data[0].count) * 100)
                : 0}
              % ({data[0]?.stage} → {data[data.length - 1]?.stage})
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
