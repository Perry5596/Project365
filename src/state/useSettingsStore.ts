import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  openAIApiKey: string | null;
  userName: string | null;
  hasCompletedOnboarding: boolean;
  streakDays: number;
  lastActiveDate: string | null;
  theme: "light" | "dark";
  setOpenAIApiKey: (key: string) => void;
  setUserName: (name: string) => void;
  completeOnboarding: () => void;
  updateStreak: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      openAIApiKey: null,
      userName: null,
      hasCompletedOnboarding: false,
      streakDays: 0,
      lastActiveDate: null,
      theme: "light",
      setOpenAIApiKey: (key) => set({ openAIApiKey: key }),
      setUserName: (name) => set({ userName: name }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
      updateStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          if (state.lastActiveDate === today) {
            return state; // Already updated today
          }
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];
          
          if (state.lastActiveDate === yesterdayStr) {
            // Consecutive day
            return {
              streakDays: state.streakDays + 1,
              lastActiveDate: today,
            };
          } else if (state.lastActiveDate === null) {
            // First time
            return {
              streakDays: 1,
              lastActiveDate: today,
            };
          } else {
            // Streak broken, reset
            return {
              streakDays: 1,
              lastActiveDate: today,
            };
          }
        });
      },
    }),
    {
      name: "project365-settings",
    }
  )
);

