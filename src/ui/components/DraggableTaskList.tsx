"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { EditableTaskItem } from "./EditableTaskItem";
import { NewTaskForm } from "./NewTaskForm";
import { type Task } from "~/state/useProjectStore";
import { Button } from "./Button";

interface DraggableTaskListProps {
  tasks: Task[];
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onToggle: (taskId: string) => void;
  onReorder: (taskIds: string[]) => void;
  onAddTask: (taskData?: Omit<Task, "id" | "projectId">) => void;
}

export function DraggableTaskList({
  tasks,
  onUpdate,
  onDelete,
  onToggle,
  onReorder,
  onAddTask,
}: DraggableTaskListProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Separate pending and completed tasks
  const pendingTasks = tasks.filter((t) => t.status !== "done");
  const completedTasks = tasks.filter((t) => t.status === "done");

  // Sort pending tasks by importance (desc) then order
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    const importanceDiff = (b.importance || 3) - (a.importance || 3);
    if (importanceDiff !== 0) return importanceDiff;
    return (a.order || 0) - (b.order || 0);
  });

  // Sort completed tasks by completion order (most recent first)
  const sortedCompletedTasks = [...completedTasks].sort((a, b) => (b.order || 0) - (a.order || 0));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Only allow reordering within pending tasks
      const activeTask = sortedPendingTasks.find((t) => t.id === active.id);
      const overTask = sortedPendingTasks.find((t) => t.id === over.id);
      
      if (activeTask && overTask) {
        const oldIndex = sortedPendingTasks.findIndex((t) => t.id === active.id);
        const newIndex = sortedPendingTasks.findIndex((t) => t.id === over.id);

        const newTasks = arrayMove(sortedPendingTasks, oldIndex, newIndex);
        // Combine with completed tasks for reorder
        onReorder([...newTasks.map((t) => t.id), ...sortedCompletedTasks.map((t) => t.id)]);
      }
    }
  };

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary">Tasks</h3>
        {!isAddingTask && (
          <Button variant="ghost" size="sm" onClick={handleAddTaskClick}>
            + Add Task
          </Button>
        )}
      </div>
      {isAddingTask && (
        <NewTaskForm
          onSave={(taskData) => {
            onAddTask(taskData);
            setIsAddingTask(false);
          }}
          onCancel={() => setIsAddingTask(false)}
        />
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedPendingTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortedPendingTasks.map((task) => (
              <EditableTaskItem
                key={task.id}
                task={task}
                onUpdate={(updates) => onUpdate(task.id, updates)}
                onDelete={() => onDelete(task.id)}
                onToggle={() => onToggle(task.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {completedTasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
            Completed
          </h4>
          <div className="space-y-2">
            {sortedCompletedTasks.map((task) => (
              <EditableTaskItem
                key={task.id}
                task={task}
                onUpdate={(updates) => onUpdate(task.id, updates)}
                onDelete={() => onDelete(task.id)}
                onToggle={() => onToggle(task.id)}
              />
            ))}
          </div>
        </div>
      )}
      {tasks.length === 0 && !isAddingTask && (
        <p className="text-sm text-muted text-center py-4">
          No tasks yet. Click "Add Task" to create one.
        </p>
      )}
    </div>
  );
}

