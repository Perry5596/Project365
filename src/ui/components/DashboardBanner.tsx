"use client";

import { Button } from "./Button";
import { StatTile } from "./StatTile";
import { useSettingsStore } from "~/state/useSettingsStore";
import { useProjectStore } from "~/state/useProjectStore";

interface DashboardBannerProps {
  onCreateProject: () => void;
}

export function DashboardBanner({ onCreateProject }: DashboardBannerProps) {
  const { userName } = useSettingsStore();
  const { projects } = useProjectStore();

  const activeProjects = projects.filter(
    (p) => p.status === "active" || p.status === "planning"
  );
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="border-b border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Project 365</h1>
          <p className="text-muted mt-1">Welcome back, {userName || "User"}!</p>
        </div>
        <Button onClick={onCreateProject} size="lg">
          + Create New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <StatTile
          label="Total Projects"
          value={projects.length}
          description={`${activeProjects.length} active`}
        />
        <StatTile
          label="Completed"
          value={completedProjects.length}
          description="Achievements unlocked"
        />
        <StatTile
          label="In Progress"
          value={activeProjects.length}
          description="Keep going!"
        />
      </div>
    </div>
  );
}

