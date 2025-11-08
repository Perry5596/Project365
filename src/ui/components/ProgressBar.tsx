import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "~/lib/utils";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    { className, value, max = 100, showLabel = false, variant = "default", ...props },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
      default: "bg-accent",
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-danger",
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabel && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-primary">Progress</span>
            <span className="text-xs text-muted">{Math.round(percentage)}%</span>
          </div>
        )}
        <div className="w-full h-2 bg-surface-alt rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 ease-out rounded-full",
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

