"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { type Task } from "~/state/useProjectStore";

interface NewTaskFormProps {
  onSave: (task: Omit<Task, "id" | "projectId">) => void;
  onCancel: () => void;
  defaultDate?: string;
}

export function NewTaskForm({ onSave, onCancel, defaultDate }: NewTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState(3);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        date: defaultDate || new Date().toISOString().split("T")[0]!,
        status: "pending",
        importance: importance as 1 | 2 | 3 | 4 | 5,
        order: Date.now(),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && title.trim()) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task title"
        className="w-full rounded border border-border bg-surface px-2 py-1 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Description (optional)"
        className="w-full rounded border border-border bg-surface px-2 py-1 text-xs text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        rows={2}
      />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Importance:</span>
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => setImportance(level)}
            className={`w-4 h-4 rounded-full border transition-colors ${
              importance >= level
                ? "bg-primary border-primary"
                : "bg-surface border-border hover:border-primary"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="text-xs text-muted hover:text-primary px-2 py-1 rounded hover:bg-surface-alt transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="text-xs text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

