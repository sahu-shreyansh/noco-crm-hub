import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

interface AnalyticsFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  dateRange: { from: Date | undefined; to: Date | undefined };
  sdr: string;
  status: string;
  sentiment: string;
}

const sdrOptions = [
  { value: "all", label: "All SDRs" },
  { value: "alex", label: "Alex Johnson" },
  { value: "maria", label: "Maria Garcia" },
  { value: "chris", label: "Chris Lee" },
  { value: "jordan", label: "Jordan Smith" },
  { value: "taylor", label: "Taylor Brown" },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "positive", label: "Positive" },
  { value: "meeting", label: "Meeting" },
  { value: "closed", label: "Closed" },
];

const sentimentOptions = [
  { value: "all", label: "All Sentiments" },
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
];

export const AnalyticsFilters = ({ onFilterChange }: AnalyticsFiltersProps) => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [sdr, setSdr] = useState("all");
  const [status, setStatus] = useState("all");
  const [sentiment, setSentiment] = useState("all");

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined });
    setSdr("all");
    setStatus("all");
    setSentiment("all");
    onFilterChange?.({
      dateRange: { from: undefined, to: undefined },
      sdr: "all",
      status: "all",
      sentiment: "all",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 rounded-2xl bg-card border border-border mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filters
          </div>

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* SDR Dropdown */}
          <Select value={sdr} onValueChange={setSdr}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select SDR" />
            </SelectTrigger>
            <SelectContent>
              {sdrOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Dropdown */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Lead Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sentiment Dropdown */}
          <Select value={sentiment} onValueChange={setSentiment}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Reply Sentiment" />
            </SelectTrigger>
            <SelectContent>
              {sentimentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button variant="ghost" size="sm" onClick={handleReset} className="ml-auto">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
