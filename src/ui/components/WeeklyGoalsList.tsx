"use client";

import { useState } from "react";
import { type WeeklyGoal } from "~/state/useProjectStore";
import { SectionHeader } from "./SectionHeader";
import { Button } from "./Button";
import { cn } from "~/lib/utils";

interface WeeklyGoalsListProps {
  goals: WeeklyGoal[];
  onToggleGoal: (goalId: string) => void;
  onMoveToNextWeek?: () => void;
}

export function WeeklyGoalsList({
  goals,
  onToggleGoal,
  onMoveToNextWeek,
}: WeeklyGoalsListProps) {
  const completedCount = goals.filter((g) => g.completed).length;
  const allCompleted = goals.length > 0 && completedCount === goals.length;
  const [showMoveWeekModal, setShowMoveWeekModal] = useState(false);

  const handleGoalToggle = (goalId: string) => {
    onToggleGoal(goalId);
    
    // Check if all goals will be completed after this toggle
    const goal = goals.find((g) => g.id === goalId);
    if (goal && !goal.completed) {
      const willBeAllCompleted = completedCount + 1 === goals.length;
      if (willBeAllCompleted && onMoveToNextWeek) {
        setShowMoveWeekModal(true);
      }
    }
  };

  return (
    <>
      <div>
        <SectionHeader
          title="This Week's Goals"
          description={`${completedCount}/${goals.length} completed`}
        />
        <ul className="space-y-2 mt-4">
          {goals.map((goal, index) => (
            <li
              key={goal.id || `goal-${index}`}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-surface-alt transition-colors"
            >
              <input
                type="checkbox"
                checked={Boolean(goal.completed)}
                onChange={() => handleGoalToggle(goal.id)}
                className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-transform scale-95 active:scale-90"
              />
              <span
                className={cn(
                  "flex-1 text-muted",
                  goal.completed && "line-through opacity-60"
                )}
              >
                {goal.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Move to Next Week Modal */}
      {showMoveWeekModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-primary mb-2">
              All Goals Completed! 🎉
            </h3>
            <p className="text-muted mb-6">
              You've completed all goals for this week. Would you like to move
              ahead to next week's goals?
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowMoveWeekModal(false)}
                className="flex-1"
              >
                Stay on This Week
              </Button>
              <Button
                onClick={() => {
                  onMoveToNextWeek?.();
                  setShowMoveWeekModal(false);
                }}
                className="flex-1"
              >
                Move to Next Week
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

