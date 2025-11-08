import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "~/lib/utils";
import { Badge } from "./Badge";

export interface TaskItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  status?: "pending" | "done" | "missed";
  effortEstimate?: "S" | "M" | "L";
  onToggle?: () => void;
  checked?: boolean;
}

export const TaskItem = forwardRef<HTMLDivElement, TaskItemProps>(
  (
    {
      className,
      title,
      description,
      status = "pending",
      effortEstimate,
      onToggle,
      checked = false,
      ...props
    },
    ref
  ) => {
    const isCompleted = status === "done" || checked;
    const isMissed = status === "missed";

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-alt",
          isCompleted && "opacity-60",
          className
        )}
        {...props}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-transform scale-95 active:scale-90"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <label
              className={cn(
                "text-sm font-medium text-primary cursor-pointer",
                isCompleted && "line-through"
              )}
            >
              {title}
            </label>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isMissed && <Badge variant="warning">Missed</Badge>}
              {effortEstimate && (
                <Badge variant="muted">{effortEstimate}</Badge>
              )}
            </div>
          </div>
          {description && (
            <p
              className={cn(
                "mt-1 text-sm text-muted",
                isCompleted && "line-through"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TaskItem.displayName = "TaskItem";

