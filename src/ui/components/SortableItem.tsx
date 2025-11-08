"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
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
      {/* Drag Handle - 2 lines in top right */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab active:cursor-grabbing p-1 hover:bg-surface-alt rounded transition-colors z-10"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <svg
          className="w-5 h-5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>
      {children}
    </div>
  );
}

