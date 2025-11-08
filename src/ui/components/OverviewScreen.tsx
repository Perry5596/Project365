"use client";

import { useProjectStore } from "~/state/useProjectStore";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";
import { ProgressBar } from "./ProgressBar";
import { StatTile } from "./StatTile";
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
import { useState } from "react";
import { SortableItem } from "./SortableItem";

type ComponentType = "stats" | "progress" | "ai";

interface Component {
  id: string;
  type: ComponentType;
}

export function OverviewScreen() {
  const { projects } = useProjectStore();
  const [components, setComponents] = useState<Component[]>([
    { id: "1", type: "stats" },
    { id: "2", type: "progress" },
    { id: "3", type: "ai" },
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

  const activeProjects = projects.filter(
    (p) => p.status === "active" || p.status === "planning"
  );
  const completedProjects = projects.filter((p) => p.status === "completed");

  // Calculate overall progress
  const totalTasks = projects.reduce(
    (sum, p) => sum + (p.dailyTasks?.length || 0),
    0
  );
  const completedTasks = projects.reduce(
    (sum, p) =>
      sum + (p.dailyTasks?.filter((t) => t.status === "done").length || 0),
    0
  );
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderComponent = (component: Component) => {
    switch (component.type) {
      case "stats":
        return (
          <Card key={component.id} className="p-6">
            <SectionHeader title="Overview Statistics" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <StatTile
                label="Total Projects"
                value={projects.length}
                description={`${activeProjects.length} active`}
              />
              <StatTile
                label="Completed"
                value={completedProjects.length}
                description="Achievements unlocked"
              />
              <StatTile
                label="In Progress"
                value={activeProjects.length}
                description="Keep going!"
              />
            </div>
          </Card>
        );
      case "progress":
        // Calculate today's task progress across all projects
        const today = new Date().toISOString().split("T")[0];
        const todayTasksAll = projects.reduce(
          (sum, p) => sum + (p.dailyTasks?.filter((t) => t.date === today).length || 0),
          0
        );
        const todayCompletedTasksAll = projects.reduce(
          (sum, p) =>
            sum +
            (p.dailyTasks?.filter((t) => t.date === today && t.status === "done").length || 0),
          0
        );
        const todayProgressAll = todayTasksAll > 0 
          ? (todayCompletedTasksAll / todayTasksAll) * 100 
          : 0;
        
        return (
          <Card key={component.id} className="p-6">
            <SectionHeader title="Overall Progress Today" />
            <div className="mt-4 space-y-4">
              <ProgressBar
                value={todayProgressAll}
                showLabel
                variant="default"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted">Tasks Completed</p>
                  <p className="text-2xl font-bold text-primary">
                    {todayCompletedTasksAll}/{todayTasksAll}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted">Completion Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(todayProgressAll)}%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      case "ai":
        return (
          <Card key={component.id} className="p-6">
            <SectionHeader
              title="AI Assistant"
              description="Ask questions about your projects and progress"
            />
            <div className="mt-4">
              <AIChat
                context="User's project overview"
                placeholder="Ask about your projects, progress, or get advice..."
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={components.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6 max-w-6xl mx-auto">
              {components.map((component) => (
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

