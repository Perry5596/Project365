"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

interface DragHandleProps {
  id: string;
  children: ReactNode;
}

export function DragHandle({ id, children }: DragHandleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle - 6 dots in top right */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab active:cursor-grabbing p-1 hover:bg-surface-alt rounded transition-colors z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <svg
          className="w-5 h-5 text-muted"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="9" cy="9" r="1.5" />
          <circle cx="15" cy="9" r="1.5" />
          <circle cx="9" cy="15" r="1.5" />
          <circle cx="15" cy="15" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
        </svg>
      </div>
      {children}
    </div>
  );
}

