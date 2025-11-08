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
}

interface ProjectState {
  projects: Project[];
  selectedProjectId: string | null;
  createProject: (project: Omit<Project, "id" | "createdAt" | "status">) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSelectedProjectId: (id: string | null) => void;
  getProject: (id: string) => Project | undefined;
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
    }),
    {
      name: "project365-projects",
    }
  )
);

