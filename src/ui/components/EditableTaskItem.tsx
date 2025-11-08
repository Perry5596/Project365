"use client";

import { useState, useRef, useEffect } from "react";
import { type Task } from "~/state/useProjectStore";
import { Badge } from "./Badge";
import { cn } from "~/lib/utils";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EditableTaskItemProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onToggle: () => void;
}

export function EditableTaskItem({
  task,
  onUpdate,
  onDelete,
  onToggle,
}: EditableTaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate({
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setEditTitle(task.title);
      setEditDescription(task.description || "");
      setIsEditing(false);
    }
  };

  const handleImportanceChange = (importance: number) => {
    onUpdate({ importance });
  };

  const isCompleted = task.status === "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-alt",
        isCompleted && "opacity-60",
        isDragging && "shadow-lg"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted hover:text-primary mt-1"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={onToggle}
        className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-transform scale-95 active:scale-90"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded border border-border bg-surface px-2 py-1 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Description (optional)"
              className="w-full rounded border border-border bg-surface px-2 py-1 text-xs text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setEditTitle(task.title);
                  setEditDescription(task.description || "");
                  setIsEditing(false);
                }}
                className="text-xs text-muted hover:text-primary px-2 py-1 rounded hover:bg-surface-alt transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editTitle.trim()}
                className="text-xs text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="cursor-text"
          >
            <div className="flex items-start justify-between gap-2">
              <label
                className={cn(
                  "text-sm font-medium text-primary cursor-pointer flex-1",
                  isCompleted && "line-through"
                )}
              >
                {task.title}
              </label>
              <div className="flex items-center gap-2 shrink-0">
                {task.status === "missed" && <Badge variant="warning">Missed</Badge>}
                {task.effortEstimate && (
                  <Badge variant="muted">{task.effortEstimate}</Badge>
                )}
              </div>
            </div>
            {task.description && (
              <p
                className={cn(
                  "mt-1 text-sm text-muted",
                  isCompleted && "line-through"
                )}
              >
                {task.description}
              </p>
            )}
          </div>
        )}

        {/* Importance and Actions */}
        {!isEditing && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted">Importance:</span>
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleImportanceChange(level)}
                  className={cn(
                    "w-4 h-4 rounded-full border transition-colors",
                    (task.importance || 3) >= level
                      ? "bg-primary border-primary"
                      : "bg-surface border-border hover:border-primary"
                  )}
                />
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-xs text-danger hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

