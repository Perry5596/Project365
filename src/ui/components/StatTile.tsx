import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "~/lib/utils";
import { Card } from "./Card";

export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

export const StatTile = forwardRef<HTMLDivElement, StatTileProps>(
  ({ className, label, value, description, trend, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="default"
        className={cn("p-4", className)}
        {...props}
      >
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-primary">{value}</p>
          {description && (
            <p className="text-sm text-muted">{description}</p>
          )}
          {trend && (
            <span
              className={cn(
                "text-xs font-medium mt-1",
                trend === "up" && "text-success",
                trend === "down" && "text-danger",
                trend === "neutral" && "text-muted"
              )}
            >
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "neutral" && "→"}
            </span>
          )}
        </div>
      </Card>
    );
  }
);

StatTile.displayName = "StatTile";

