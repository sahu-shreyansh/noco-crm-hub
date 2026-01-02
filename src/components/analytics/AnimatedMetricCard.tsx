import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface AnimatedMetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
  decimals?: number;
}

const useCountUp = (end: number, duration: number = 1500, decimals: number = 0) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Number((end * easeOut).toFixed(decimals)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, decimals]);

  return count;
};

export const AnimatedMetricCard = ({
  title,
  value,
  suffix = "",
  prefix = "",
  icon: Icon,
  trend,
  delay = 0,
  decimals = 0,
}: AnimatedMetricCardProps) => {
  const animatedValue = useCountUp(value, 1500, decimals);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30 group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-foreground tracking-tight">
              {prefix}{animatedValue.toLocaleString()}{suffix}
            </span>
          </div>

          {trend && (
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
