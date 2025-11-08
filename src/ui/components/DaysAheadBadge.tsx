"use client";

import { cn } from "~/lib/utils";

interface DaysAheadBadgeProps {
  daysAhead: number; // Positive = ahead, negative = behind
  className?: string;
}

export function DaysAheadBadge({ daysAhead, className }: DaysAheadBadgeProps) {
  const isAhead = daysAhead > 0;
  const isBehind = daysAhead < 0;
  const days = Math.abs(daysAhead);

  if (daysAhead === 0) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-muted/10 text-muted border-muted">
          0
        </div>
        <span className="text-sm font-medium text-muted">days ahead</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2",
          isAhead
            ? "bg-success/10 text-success border-success"
            : "bg-danger/10 text-danger border-danger"
        )}
      >
        {days}
      </div>
      <span className={cn("text-sm font-medium", isAhead ? "text-success" : "text-danger")}>
        {isAhead ? "days ahead" : "days behind"}
      </span>
    </div>
  );
}

