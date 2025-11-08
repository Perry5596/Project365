import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getWeekStartDateString,
  getNextWeekStartDate,
  daysBetween,
} from "~/domain/weekHelpers";

export interface WeeklyGoal {
  id: string;
  text: string;
  completed: boolean;
  weekStartDate: string; // ISO date string for the week this goal belongs to
}

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
  weeklyGoals?: WeeklyGoal[];
  dailyTasks?: Task[];
  missedTasks?: Task[];
  currentWeekStartDate?: string; // ISO date string for current week
  daysAhead?: number; // Number of days ahead of schedule (negative = behind)
  lastWeekCompletedDate?: string; // When the last week was completed early
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
  // Weekly goal operations
  toggleWeeklyGoal: (projectId: string, goalId: string) => void;
  moveToNextWeek: (projectId: string) => void;
  // Days ahead/behind calculation
  calculateDaysAhead: (projectId: string) => number;
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
        set((state) => {
          const project = state.projects.find((p) => p.id === projectId);
          if (!project) return state;

          // Get pending tasks for the same date, sorted by importance (desc) then order
          const dateTasks = (project.dailyTasks || []).filter(
            (t) => t.date === task.date && t.status === "pending"
          );
          const sortedDateTasks = [...dateTasks].sort((a, b) => {
            const importanceDiff = (b.importance || 3) - (a.importance || 3);
            if (importanceDiff !== 0) return importanceDiff;
            return (a.order || 0) - (b.order || 0);
          });

          // Find where to insert based on importance
          const taskImportance = task.importance || 3;
          let insertIndex = sortedDateTasks.length;
          for (let i = 0; i < sortedDateTasks.length; i++) {
            const currentImportance = sortedDateTasks[i]?.importance || 3;
            if (taskImportance > currentImportance) {
              insertIndex = i;
              break;
            } else if (taskImportance === currentImportance) {
              // Same importance, insert at end of this importance level
              let j = i;
              while (j < sortedDateTasks.length && (sortedDateTasks[j]?.importance || 3) === taskImportance) {
                j++;
              }
              insertIndex = j;
              break;
            }
          }

          // Calculate order value to insert at correct position
          if (insertIndex === 0) {
            // Insert at beginning
            task.order = (sortedDateTasks[0]?.order || 0) - 1;
          } else if (insertIndex >= sortedDateTasks.length) {
            // Insert at end
            task.order = (sortedDateTasks[sortedDateTasks.length - 1]?.order || Date.now()) + 1;
          } else {
            // Insert between two tasks
            const prevOrder = sortedDateTasks[insertIndex - 1]?.order || 0;
            const nextOrder = sortedDateTasks[insertIndex]?.order || Date.now();
            task.order = Math.floor((prevOrder + nextOrder) / 2);
          }

          // Separate pending and completed tasks
          const pendingTasks = (project.dailyTasks || []).filter((t) => t.status !== "done");
          const completedTasks = (project.dailyTasks || []).filter((t) => t.status === "done");

          // Insert into pending tasks at correct position
          const allPendingTasks = [...pendingTasks];
          const datePendingTasks = allPendingTasks.filter((t) => t.date === task.date);
          const otherDateTasks = allPendingTasks.filter((t) => t.date !== task.date);
          
          const sortedDatePending = [...datePendingTasks].sort((a, b) => {
            const importanceDiff = (b.importance || 3) - (a.importance || 3);
            if (importanceDiff !== 0) return importanceDiff;
            return (a.order || 0) - (b.order || 0);
          });

          // Find insert position in sorted array
          let finalInsertIndex = sortedDatePending.length;
          for (let i = 0; i < sortedDatePending.length; i++) {
            const currentImportance = sortedDatePending[i]?.importance || 3;
            if (taskImportance > currentImportance) {
              finalInsertIndex = i;
              break;
            } else if (taskImportance === currentImportance) {
              let j = i;
              while (j < sortedDatePending.length && (sortedDatePending[j]?.importance || 3) === taskImportance) {
                j++;
              }
              finalInsertIndex = j;
              break;
            }
          }

          sortedDatePending.splice(finalInsertIndex, 0, task);
          const newDailyTasks = [...otherDateTasks, ...sortedDatePending, ...completedTasks];

          return {
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    dailyTasks: newDailyTasks,
                  }
                : p
            ),
          };
        });
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
      toggleWeeklyGoal: (projectId, goalId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  weeklyGoals: p.weeklyGoals?.map((g) =>
                    g.id === goalId ? { ...g, completed: !g.completed } : g
                  ),
                }
              : p
          ),
        }));
      },
      moveToNextWeek: (projectId) => {
        set((state) => {
          const project = state.projects.find((p) => p.id === projectId);
          if (!project) return state;

          const currentWeekStart = project.currentWeekStartDate || getWeekStartDateString(new Date(project.startDate));
          const nextWeekStart = getNextWeekStartDate(currentWeekStart);
          const today = new Date();
          const currentWeekStartDate = new Date(currentWeekStart);
          
          // Calculate days ahead: if completing week early, days between today and next week start
          const daysAhead = daysBetween(today, new Date(nextWeekStart));

          return {
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    currentWeekStartDate: nextWeekStart,
                    daysAhead: (p.daysAhead || 0) + daysAhead,
                    lastWeekCompletedDate: today.toISOString().split("T")[0],
                    // Reset weekly goals for new week (would be generated by AI in real implementation)
                    weeklyGoals: p.weeklyGoals?.map((g) => ({
                      ...g,
                      completed: false,
                      weekStartDate: nextWeekStart,
                    })),
                  }
                : p
            ),
          };
        });
      },
      calculateDaysAhead: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return 0;

        const today = new Date();
        const currentWeekStart = project.currentWeekStartDate || getWeekStartDateString(new Date(project.startDate));
        const nextWeekStart = getNextWeekStartDate(currentWeekStart);
        
        // Base days ahead from project
        let baseDaysAhead = project.daysAhead || 0;

        // If last week was completed early, calculate decay
        if (project.lastWeekCompletedDate) {
          const lastCompletedDate = new Date(project.lastWeekCompletedDate);
          const daysSinceCompletion = daysBetween(lastCompletedDate, today);
          const nextWeekStartDate = new Date(nextWeekStart);
          
          // Days ahead decreases as we approach the next week start
          if (today < nextWeekStartDate) {
            const daysUntilNextWeek = daysBetween(today, nextWeekStartDate);
            // Days ahead should be the minimum of: base days ahead, or days until next week
            return Math.max(0, Math.min(baseDaysAhead, daysUntilNextWeek));
          } else {
            // Past the next week start, days ahead starts decreasing
            const daysPastNextWeek = daysBetween(nextWeekStartDate, today);
            return Math.max(0, baseDaysAhead - daysPastNextWeek);
          }
        }

        return baseDaysAhead;
      },
    }),
    {
      name: "project365-projects",
    }
  )
);

