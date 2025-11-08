"use client";

import { Button } from "./Button";

interface DeleteProjectModalProps {
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteProjectModal({
  projectName,
  onConfirm,
  onCancel,
}: DeleteProjectModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-primary mb-2">
          Delete Project
        </h3>
        <p className="text-muted mb-6">
          Are you sure you want to delete <strong>"{projectName}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-danger hover:bg-danger/90 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

