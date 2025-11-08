"use client";

import React, { useState } from "react";
import { useSettingsStore } from "~/state/useSettingsStore";
import { useProjectStore } from "~/state/useProjectStore";
import { Button } from "./Button";
import { Card } from "./Card";
import { ProjectContextMenu } from "./ProjectContextMenu";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { cn } from "~/lib/utils";

interface SidebarProps {
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
  onNavigateToOverview: () => void;
  selectedProjectId: string | null;
  onSettings: () => void;
}

export function Sidebar({
  onCreateProject,
  onSelectProject,
  onNavigateToOverview,
  selectedProjectId,
  onSettings,
}: SidebarProps) {
  const { userName, streakDays, updateStreak } = useSettingsStore();
  const { projects, deleteProject } = useProjectStore();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    projectId: string;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    projectId: string;
    projectName: string;
  } | null>(null);

  // Update streak on mount
  React.useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const activeProjects = projects.filter(
    (p) => p.status === "active" || p.status === "planning"
  );
  const completedProjects = projects.filter((p) => p.status === "completed");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      projectId,
    });
  };

  const handleEdit = (projectId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit project:", projectId);
    setContextMenu(null);
  };

  const handleDeleteClick = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setDeleteModal({
        projectId,
        projectName: project.name,
      });
    }
    setContextMenu(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteModal) {
      deleteProject(deleteModal.projectId);
      setDeleteModal(null);
      // If deleted project was selected, navigate to overview
      if (selectedProjectId === deleteModal.projectId) {
        onNavigateToOverview();
      }
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-surface">
      {/* User Section */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToOverview}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {userName ? getInitials(userName) : "U"}
          </button>
          <button
            onClick={onNavigateToOverview}
            className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
          >
            <p className="truncate text-sm font-medium text-primary">
              {userName || "User"}
            </p>
            <p className="text-xs text-muted">
              {activeProjects.length} active project
              {activeProjects.length !== 1 ? "s" : ""}
            </p>
          </button>
          <button
            onClick={onSettings}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-alt transition-colors"
            aria-label="Settings"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide">
              Active Projects
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateProject}
              className="text-xs"
            >
              + New
            </Button>
          </div>
          <div className="space-y-1">
            {activeProjects.length === 0 ? (
              <p className="text-xs text-muted py-2">No active projects</p>
            ) : (
              activeProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  onContextMenu={(e) => handleContextMenu(e, project.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedProjectId === project.id
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-surface-alt"
                  )}
                >
                  <p className="truncate font-medium">{project.name}</p>
                  <p className="text-xs opacity-75">
                    {project.status === "planning" ? "Planning..." : "Active"}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {completedProjects.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              Completed
            </h3>
            <div className="space-y-1">
              {completedProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  onContextMenu={(e) => handleContextMenu(e, project.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors opacity-60",
                    selectedProjectId === project.id
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-surface-alt"
                  )}
                >
                  <p className="truncate font-medium">{project.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Streak Counter */}
      <div className="border-t border-border p-4">
        <Card className="p-3 bg-surface-alt">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🔥</div>
            <div className="flex-1">
              <p className="text-xs text-muted">Day Streak</p>
              <p className="text-lg font-bold text-primary">{streakDays}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ProjectContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={() => handleEdit(contextMenu.projectId)}
          onDelete={() => handleDeleteClick(contextMenu.projectId)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <DeleteProjectModal
          projectName={deleteModal.projectName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}

