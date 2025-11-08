import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Project {
  id: string;
  name: string;
  description: string;
  timeframe: number; // days
  goals: string[];
  startDate: string;
  targetDate: string;
  status: "planning" | "active" | "completed" | "cancelled";
  createdAt: string;
  longTermGoal?: string;
  weeklyGoals?: string[];
  dailyTasks?: Task[];
  missedTasks?: Task[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  date: string;
  status: "pending" | "done" | "missed";
  effortEstimate?: "S" | "M" | "L";
  importance?: number; // 1-5, 5 being very important
  order?: number; // For drag and drop ordering
}

interface ProjectState {
  projects: Project[];
  selectedProjectId: string | null;
  createProject: (project: Omit<Project, "id" | "createdAt" | "status">) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSelectedProjectId: (id: string | null) => void;
  getProject: (id: string) => Project | undefined;
  // Task operations
  addTask: (projectId: string, task: Omit<Task, "id" | "projectId">) => string;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  reorderTasks: (projectId: string, taskIds: string[]) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      selectedProjectId: null,
      createProject: (projectData) => {
        const id = crypto.randomUUID();
        const project: Project = {
          ...projectData,
          id,
          createdAt: new Date().toISOString(),
          status: "planning",
        };
        set((state) => ({
          projects: [...state.projects, project],
        }));
        return id;
      },
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProjectId:
            state.selectedProjectId === id ? null : state.selectedProjectId,
        }));
      },
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      getProject: (id) => get().projects.find((p) => p.id === id),
      addTask: (projectId, taskData) => {
        const id = crypto.randomUUID();
        const task: Task = {
          ...taskData,
          id,
          projectId,
          importance: taskData.importance ?? 3,
          order: taskData.order ?? Date.now(),
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  dailyTasks: [...(p.dailyTasks || []), task],
                }
              : p
          ),
        }));
        return id;
      },
      updateTask: (projectId, taskId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  dailyTasks: p.dailyTasks?.map((t) =>
                    t.id === taskId ? { ...t, ...updates } : t
                  ),
                  missedTasks: p.missedTasks?.map((t) =>
                    t.id === taskId ? { ...t, ...updates } : t
                  ),
                }
              : p
          ),
        }));
      },
      deleteTask: (projectId, taskId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  dailyTasks: p.dailyTasks?.filter((t) => t.id !== taskId),
                  missedTasks: p.missedTasks?.filter((t) => t.id !== taskId),
                }
              : p
          ),
        }));
      },
      reorderTasks: (projectId, taskIds) => {
        set((state) => {
          const project = state.projects.find((p) => p.id === projectId);
          if (!project?.dailyTasks) return state;

          const taskMap = new Map(project.dailyTasks.map((t) => [t.id, t]));
          const reorderedTasks = taskIds
            .map((id) => taskMap.get(id))
            .filter((t): t is Task => t !== undefined);

          return {
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    dailyTasks: reorderedTasks.map((t, idx) => ({
                      ...t,
                      order: idx,
                    })),
                  }
                : p
            ),
          };
        });
      },
    }),
    {
      name: "project365-projects",
    }
  )
);

