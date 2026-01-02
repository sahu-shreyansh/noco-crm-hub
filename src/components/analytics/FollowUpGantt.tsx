import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TimelineEvent } from "@/types/crm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FollowUpGanttProps {
  data: TimelineEvent[];
}

const EVENT_COLORS = {
  outreach: "hsl(var(--primary))",
  followup_1: "hsl(var(--info))",
  followup_2: "hsl(199, 89%, 38%)",
  reply: "hsl(var(--success))",
  meeting: "hsl(262, 83%, 58%)",
};

const EVENT_LABELS = {
  outreach: "Outreach",
  followup_1: "Follow-up 1",
  followup_2: "Follow-up 2",
  reply: "Reply",
  meeting: "Meeting",
};

const getDayPosition = (dateStr: string, startDate: Date, totalDays: number) => {
  const date = new Date(dateStr);
  const diffTime = date.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays / totalDays) * 100;
};

export const FollowUpGantt = ({ data }: FollowUpGanttProps) => {
  const startDate = new Date("2024-12-14");
  const endDate = new Date("2024-12-31");
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const today = new Date("2024-12-30");
  const todayPosition = getDayPosition(today.toISOString().split("T")[0], startDate, totalDays);

  const dateLabels = [];
  for (let i = 0; i <= totalDays; i += 4) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dateLabels.push({
      label: `Dec ${date.getDate()}`,
      position: (i / totalDays) * 100,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Follow-up Timeline</h3>
          <div className="flex items-center gap-4">
            {Object.entries(EVENT_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: EVENT_COLORS[key as keyof typeof EVENT_COLORS] }}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Date header */}
            <div className="relative h-8 mb-4 border-b border-border">
              {dateLabels.map((d, index) => (
                <div
                  key={index}
                  className="absolute text-xs text-muted-foreground transform -translate-x-1/2"
                  style={{ left: `calc(200px + ${d.position}% * 0.75)` }}
                >
                  {d.label}
                </div>
              ))}
            </div>

            {/* Timeline rows */}
            <div className="space-y-2">
              {data.map((timeline, rowIndex) => (
                <motion.div
                  key={timeline.lead_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * rowIndex }}
                  className="flex items-center h-12 group hover:bg-muted/30 rounded-lg transition-colors"
                >
                  {/* Sticky left column */}
                  <div className="w-[200px] flex-shrink-0 pr-4 sticky left-0 bg-card z-10">
                    <p className="text-sm font-medium text-foreground truncate">{timeline.lead_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{timeline.company}</p>
                  </div>

                  {/* Timeline bar */}
                  <div className="flex-1 relative h-8 bg-muted/20 rounded-lg overflow-hidden">
                    {/* Today marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
                      style={{ left: `${todayPosition}%` }}
                    >
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-[10px] text-destructive font-medium">
                        Today
                      </div>
                    </div>

                    {/* Events */}
                    <TooltipProvider>
                      {timeline.events.map((event, eventIndex) => {
                        const position = getDayPosition(event.date, startDate, totalDays);
                        return (
                          <Tooltip key={eventIndex}>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 * eventIndex }}
                                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full cursor-pointer hover:scale-125 transition-transform z-20"
                                style={{
                                  left: `${position}%`,
                                  backgroundColor: EVENT_COLORS[event.type],
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-card border border-border shadow-lg">
                              <div className="text-sm">
                                <p className="font-medium text-foreground">{event.label}</p>
                                <p className="text-muted-foreground">{event.date}</p>
                                <p className="text-xs text-muted-foreground mt-1">SDR: {timeline.sdr_name}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </TooltipProvider>

                    {/* Connection lines between events */}
                    {timeline.events.slice(0, -1).map((event, eventIndex) => {
                      const startPos = getDayPosition(event.date, startDate, totalDays);
                      const endPos = getDayPosition(timeline.events[eventIndex + 1].date, startDate, totalDays);
                      return (
                        <div
                          key={`line-${eventIndex}`}
                          className="absolute top-1/2 h-0.5 bg-muted-foreground/20 -translate-y-1/2"
                          style={{
                            left: `${startPos}%`,
                            width: `${endPos - startPos}%`,
                          }}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
