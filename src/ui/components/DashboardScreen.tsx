"use client";

import { useProjectStore } from "~/state/useProjectStore";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";

interface DashboardScreenProps {
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
}

export function DashboardScreen({
  onCreateProject,
  onSelectProject,
}: DashboardScreenProps) {
  const { projects } = useProjectStore();
  const activeProjects = projects.filter(
    (p) => p.status === "active" || p.status === "planning"
  );

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {activeProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-primary">
              Ready to achieve your goals?
            </h2>
            <p className="text-muted max-w-md">
              Create your first project and let AI help you build a personalized
              plan to achieve it within 365 days.
            </p>
          </div>
          <Button onClick={onCreateProject} size="lg">
            + Create Your First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map((project) => {
              const daysRemaining = Math.ceil(
                (new Date(project.targetDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <Card
                  key={project.id}
                  className="p-6 cursor-pointer hover:bg-surface-alt transition-colors"
                  onClick={() => onSelectProject(project.id)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-primary">
                        {project.name}
                      </h3>
                      <Badge
                        variant={
                          project.status === "planning" ? "muted" : "default"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted">
                        {daysRemaining} days left
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(project.id);
                        }}
                      >
                        View →
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="flex justify-center pt-4">
            <Button onClick={onCreateProject} size="lg">
              + Create New Project
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

