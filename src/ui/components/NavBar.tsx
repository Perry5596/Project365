"use client";

import { Button } from "./Button";
import { useSettingsStore } from "~/state/useSettingsStore";

interface NavBarProps {
  onCreateProject: () => void;
}

export function NavBar({ onCreateProject }: NavBarProps) {
  const { userName } = useSettingsStore();

  return (
    <div className="border-b border-border bg-surface px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">Project 365</h1>
          <span className="text-sm text-muted">
            Welcome back, {userName || "User"}!
          </span>
        </div>
        <Button onClick={onCreateProject} size="md">
          + Create Project
        </Button>
      </div>
    </div>
  );
}

