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

  const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedTasks.findIndex((t) => t.id === active.id);
      const newIndex = sortedTasks.findIndex((t) => t.id === over.id);

      const newTasks = arrayMove(sortedTasks, oldIndex, newIndex);
      onReorder(newTasks.map((t) => t.id));
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
          items={sortedTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortedTasks.map((task) => (
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
      {tasks.length === 0 && !isAddingTask && (
        <p className="text-sm text-muted text-center py-4">
          No tasks yet. Click "Add Task" to create one.
        </p>
      )}
    </div>
  );
}

