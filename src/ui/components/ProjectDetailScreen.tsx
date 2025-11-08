"use client";

import { useState } from "react";
import { useProjectStore, type Project } from "~/state/useProjectStore";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";
import { ProgressBar } from "./ProgressBar";
import { StatTile } from "./StatTile";
import { Badge } from "./Badge";
import { DraggableTaskList } from "./DraggableTaskList";
import { AIChat } from "./AIChat";
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
import { SortableItem } from "./SortableItem";

type ComponentType = "stats" | "goal" | "weekly-goals" | "tasks" | "missed-tasks" | "progress" | "ai";

interface Component {
  id: string;
  type: ComponentType;
}

interface ProjectDetailScreenProps {
  projectId: string;
}

export function ProjectDetailScreen({ projectId }: ProjectDetailScreenProps) {
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === projectId)
  );
  const { updateTask, deleteTask, reorderTasks, addTask, updateProject } =
    useProjectStore();

  const [components, setComponents] = useState<Component[]>([
    { id: "1", type: "stats" },
    { id: "2", type: "goal" },
    { id: "3", type: "weekly-goals" },
    { id: "4", type: "tasks" },
    { id: "5", type: "missed-tasks" },
    { id: "6", type: "progress" },
    { id: "7", type: "ai" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Project not found</p>
      </div>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(project.targetDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const completedTasks =
    project.dailyTasks?.filter((t) => t.status === "done").length || 0;
  const totalTasks = project.dailyTasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = project.dailyTasks?.filter((t) => t.date === today) || [];
  const missedTasks = project.missedTasks || [];

  const handleComponentDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleTaskToggle = (taskId: string) => {
    const task = project.dailyTasks?.find((t) => t.id === taskId);
    if (task) {
      updateTask(projectId, taskId, {
        status: task.status === "done" ? "pending" : "done",
      });
    }
  };

  const handleAddTask = (taskData?: Omit<Task, "id" | "projectId">) => {
    addTask(projectId, taskData || {
      title: "New Task",
      description: "",
      date: today,
      status: "pending",
      importance: 3,
      order: Date.now(),
    });
  };

  const renderComponent = (component: Component) => {
    switch (component.type) {
      case "stats":
        return (
          <Card key={component.id} className="p-6">
            <SectionHeader title="Project Statistics" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <StatTile
                label="Days Remaining"
                value={daysRemaining}
                description={daysRemaining > 0 ? "On track" : "Time's up!"}
                trend={
                  daysRemaining > 30 ? "up" : daysRemaining > 0 ? "neutral" : "down"
                }
              />
              <StatTile
                label="Tasks Completed"
                value={`${completedTasks}/${totalTasks}`}
                description={`${Math.round(progress)}% done`}
                trend="up"
              />
              <StatTile
                label="Today"
                value={todayTasks.length}
                description="Tasks scheduled"
                trend="neutral"
              />
            </div>
          </Card>
        );
      case "goal":
        return (
          project.longTermGoal && (
            <Card key={component.id} className="p-6">
              <SectionHeader title="Long Term Goal" />
              <p className="text-muted mt-2">{project.longTermGoal}</p>
            </Card>
          )
        );
      case "weekly-goals":
        return (
          project.weeklyGoals &&
          project.weeklyGoals.length > 0 && (
            <Card key={component.id} className="p-6">
              <SectionHeader title="This Week's Goals" />
              <ul className="space-y-2 mt-4">
                {project.weeklyGoals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted">{goal}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )
        );
      case "tasks":
        return (
          <Card key={component.id} className="p-6">
            <DraggableTaskList
              tasks={todayTasks}
              onUpdate={(taskId, updates) =>
                updateTask(projectId, taskId, updates)
              }
              onDelete={(taskId) => deleteTask(projectId, taskId)}
              onToggle={handleTaskToggle}
              onReorder={(taskIds) => reorderTasks(projectId, taskIds)}
              onAddTask={handleAddTask}
            />
          </Card>
        );
      case "missed-tasks":
        return (
          missedTasks.length > 0 && (
            <Card key={component.id} className="p-6">
              <SectionHeader title="This Week's Missed Tasks" />
              <div className="mt-4">
                <DraggableTaskList
                  tasks={missedTasks}
                  onUpdate={(taskId, updates) =>
                    updateTask(projectId, taskId, updates)
                  }
                  onDelete={(taskId) => deleteTask(projectId, taskId)}
                  onToggle={handleTaskToggle}
                  onReorder={(taskIds) => reorderTasks(projectId, taskIds)}
                  onAddTask={handleAddTask}
                />
              </div>
            </Card>
          )
        );
      case "progress":
        return (
          <Card key={component.id} className="p-6">
            <SectionHeader title="Overall Progress" />
            <div className="mt-4">
              <ProgressBar value={progress} showLabel variant="default" />
            </div>
          </Card>
        );
      case "ai":
        return (
          <Card key={component.id} className="p-6">
            <SectionHeader
              title="AI Assistant"
              description="Ask AI to modify your project, tasks, or goals"
            />
            <div className="mt-4">
              <AIChat
                context={`Project: ${project.name}. ${project.description}`}
                placeholder="Ask AI to modify tasks, update goals, or get advice..."
                onMessage={async (message) => {
                  // TODO: Connect to actual AI service
                  return `I understand you want to: "${message}". This is a placeholder response. Connect me to your AI service!`;
                }}
              />
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 pt-4 min-h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">{project.name}</h1>
              <p className="text-muted mt-1">{project.description}</p>
            </div>
            <Badge
              variant={
                project.status === "completed"
                  ? "success"
                  : project.status === "active"
                    ? "default"
                    : "muted"
              }
            >
              {project.status}
            </Badge>
          </div>
        </div>

        {/* Rearrangeable Components */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleComponentDragEnd}
        >
          <SortableContext
            items={components.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6 max-w-6xl mx-auto">
              {components
                .filter((c) => {
                  // Filter out components that shouldn't be shown
                  if (c.type === "goal" && !project.longTermGoal) return false;
                  if (c.type === "weekly-goals" && !project.weeklyGoals?.length)
                    return false;
                  if (c.type === "missed-tasks" && missedTasks.length === 0)
                    return false;
                  return true;
                })
                .map((component) => (
                  <SortableItem key={component.id} id={component.id}>
                    {renderComponent(component)}
                  </SortableItem>
                ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
