import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "~/lib/utils";
import { Card } from "./Card";
import { Badge } from "./Badge";

export interface TaskCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  date?: string;
  status?: "pending" | "done" | "missed";
  effortEstimate?: "S" | "M" | "L";
  onComplete?: () => void;
  onDelete?: () => void;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  (
    {
      className,
      title,
      description,
      date,
      status = "pending",
      effortEstimate,
      onComplete,
      onDelete,
      ...props
    },
    ref
  ) => {
    const isCompleted = status === "done";
    const isMissed = status === "missed";

    return (
      <Card
        ref={ref}
        variant="default"
        className={cn(
          "p-4 transition-colors hover:bg-surface-alt",
          isCompleted && "opacity-60",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={cn(
                  "text-base font-semibold text-primary",
                  isCompleted && "line-through"
                )}
              >
                {title}
              </h3>
              {isMissed && <Badge variant="warning">Missed</Badge>}
              {effortEstimate && <Badge variant="muted">{effortEstimate}</Badge>}
            </div>
            {description && (
              <p
                className={cn(
                  "text-sm text-muted mb-2",
                  isCompleted && "line-through"
                )}
              >
                {description}
              </p>
            )}
            {date && (
              <p className="text-xs text-muted">{date}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isCompleted && onComplete && (
              <button
                onClick={onComplete}
                className="rounded-lg px-3 py-1.5 text-xs font-medium bg-success/10 text-success hover:bg-success/20 transition-colors"
              >
                Complete
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded-lg px-3 py-1.5 text-xs font-medium bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

TaskCard.displayName = "TaskCard";

