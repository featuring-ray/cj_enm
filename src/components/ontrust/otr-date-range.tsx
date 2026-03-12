"use client";

import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface OtrDateRangeProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  className?: string;
}

export function OtrDateRange({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  className,
}: OtrDateRangeProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="relative">
        <input
          type="text"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          placeholder="YYYY-MM-DD HH:mm:ss"
          style={{ width: 180, paddingRight: 28 }}
        />
        <Calendar
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={14}
        />
      </div>
      <span className="text-xs text-gray-400">~</span>
      <div className="relative">
        <input
          type="text"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          placeholder="YYYY-MM-DD HH:mm:ss"
          style={{ width: 180, paddingRight: 28 }}
        />
        <Calendar
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={14}
        />
      </div>
    </div>
  );
}
