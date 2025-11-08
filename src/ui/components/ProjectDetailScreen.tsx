"use client";

import { useProjectStore, type Project } from "~/state/useProjectStore";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";
import { TaskItem } from "./TaskItem";
import { ProgressBar } from "./ProgressBar";
import { StatTile } from "./StatTile";
import { Badge } from "./Badge";

interface ProjectDetailScreenProps {
  projectId: string;
}

export function ProjectDetailScreen({ projectId }: ProjectDetailScreenProps) {
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === projectId)
  );

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Project not found</p>
      </div>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(project.targetDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const completedTasks = project.dailyTasks?.filter((t) => t.status === "done").length || 0;
  const totalTasks = project.dailyTasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = project.dailyTasks?.filter((t) => t.date === today) || [];
  const missedTasks = project.missedTasks || [];

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">{project.name}</h1>
            <p className="text-muted mt-1">{project.description}</p>
          </div>
          <Badge
            variant={
              project.status === "completed"
                ? "success"
                : project.status === "active"
                  ? "default"
                  : "muted"
            }
          >
            {project.status}
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <StatTile
            label="Days Remaining"
            value={daysRemaining}
            description={daysRemaining > 0 ? "On track" : "Time's up!"}
            trend={daysRemaining > 30 ? "up" : daysRemaining > 0 ? "neutral" : "down"}
          />
          <StatTile
            label="Tasks Completed"
            value={`${completedTasks}/${totalTasks}`}
            description={`${Math.round(progress)}% done`}
            trend="up"
          />
          <StatTile
            label="This Week"
            value={todayTasks.length}
            description="Tasks today"
            trend="neutral"
          />
        </div>
      </div>

      {/* Long Term Goal */}
      {project.longTermGoal && (
        <Card className="p-6">
          <SectionHeader title="Long Term Goal" />
          <p className="text-muted">{project.longTermGoal}</p>
        </Card>
      )}

      {/* This Week's Goals */}
      {project.weeklyGoals && project.weeklyGoals.length > 0 && (
        <Card className="p-6">
          <SectionHeader title="This Week's Goals" />
          <ul className="space-y-2 mt-4">
            {project.weeklyGoals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted">{goal}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Today's Tasks */}
      <Card className="p-6">
        <SectionHeader title="Today's Tasks" />
        <div className="space-y-3 mt-4">
          {todayTasks.length === 0 ? (
            <p className="text-muted text-sm">No tasks for today. Great job!</p>
          ) : (
            todayTasks.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                effortEstimate={task.effortEstimate}
                checked={task.status === "done"}
                onToggle={() => {
                  // TODO: Implement task toggle
                }}
              />
            ))
          )}
        </div>
      </Card>

      {/* Missed Tasks */}
      {missedTasks.length > 0 && (
        <Card className="p-6">
          <SectionHeader title="This Week's Missed Tasks" />
          <div className="space-y-3 mt-4">
            {missedTasks.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                description={task.description}
                status="missed"
                effortEstimate={task.effortEstimate}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Progress */}
      <Card className="p-6">
        <SectionHeader title="Overall Progress" />
        <div className="mt-4">
          <ProgressBar value={progress} showLabel variant="default" />
        </div>
      </Card>
    </div>
  );
}

