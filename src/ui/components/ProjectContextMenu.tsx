"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { cn } from "~/lib/utils";

interface ProjectContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectContextMenu({
  x,
  y,
  onClose,
  onEdit,
  onDelete,
}: ProjectContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-surface border border-border rounded-lg shadow-lg py-1 z-50 min-w-[120px]"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-surface-alt transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-surface-alt transition-colors"
      >
        Delete
      </button>
    </div>
  );
}

