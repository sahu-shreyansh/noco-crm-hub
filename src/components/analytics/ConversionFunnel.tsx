import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface ConversionFunnelProps {
  data: FunnelStage[];
}

export const ConversionFunnel = ({ data }: ConversionFunnelProps) => {
  const maxCount = data[0].count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Conversion Funnel</h3>
        <div className="space-y-3">
          {data.map((stage, index) => {
            const widthPercentage = (stage.count / maxCount) * 100;
            const hue = 221 - index * 15;

            return (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{stage.count.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + 0.1 * index, ease: "easeOut" }}
                    className="h-full rounded-lg"
                    style={{
                      background: `linear-gradient(90deg, hsl(${hue}, 83%, 53%) 0%, hsl(${hue}, 83%, 63%) 100%)`,
                    }}
                  />
                  {index < data.length - 1 && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {data[index + 1] && (
                        <span className="bg-card/80 px-1.5 py-0.5 rounded">
                          {Math.round((data[index + 1].count / stage.count) * 100)}% →
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};
