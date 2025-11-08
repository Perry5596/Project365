"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "~/state/useSettingsStore";
import { useProjectStore } from "~/state/useProjectStore";
import { WelcomeScreen } from "~/ui/components/WelcomeScreen";
import { OnboardingScreen } from "~/ui/components/OnboardingScreen";
import { Sidebar } from "~/ui/components/Sidebar";
import { DashboardBanner } from "~/ui/components/DashboardBanner";
import { DashboardScreen } from "~/ui/components/DashboardScreen";
import { ProjectCreationForm } from "~/ui/components/ProjectCreationForm";
import { ProjectCreationLoading } from "~/ui/components/ProjectCreationLoading";
import { ProjectDetailScreen } from "~/ui/components/ProjectDetailScreen";
import { SettingsScreen } from "~/ui/components/SettingsScreen";

type AppScreen =
  | "welcome"
  | "onboarding"
  | "dashboard"
  | "create-project"
  | "creating-project"
  | "project-detail"
  | "settings";

export default function Home() {
  const { hasCompletedOnboarding, userName } = useSettingsStore();
  const { selectedProjectId, setSelectedProjectId, createProject, updateProject } =
    useProjectStore();

  const [screen, setScreen] = useState<AppScreen>("welcome");
  const [projectCreationData, setProjectCreationData] = useState<{
    name: string;
    timeframe: number;
    goals: string[];
    aiInput: string;
  } | null>(null);

  // Initialize screen based on onboarding status
  useEffect(() => {
    if (hasCompletedOnboarding) {
      if (selectedProjectId) {
        setScreen("project-detail");
      } else {
        setScreen("dashboard");
      }
    } else {
      setScreen("welcome");
    }
  }, [hasCompletedOnboarding, selectedProjectId]);

  const handleGetStarted = () => {
    setScreen("onboarding");
  };

  const handleOnboardingComplete = () => {
    setScreen("dashboard");
  };

  const handleCreateProject = () => {
    setScreen("create-project");
  };

  const handleProjectFormContinue = (data: {
    name: string;
    timeframe: number;
    goals: string[];
    aiInput: string;
  }) => {
    setProjectCreationData(data);
    setScreen("creating-project");
    simulateProjectCreation(data);
  };

  const simulateProjectCreation = async (data: {
    name: string;
    timeframe: number;
    goals: string[];
  }) => {
    // Simulate AI project creation with status updates
    const statuses = [
      "Analyzing your goal...",
      "Creating personalized milestones...",
      "Generating weekly objectives...",
      "Breaking down into daily tasks...",
      "Optimizing your timeline...",
      "Finalizing your plan...",
    ];

    const startDate = new Date();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + data.timeframe);

    // Create project immediately
    const projectId = createProject({
      name: data.name,
      description: `Achieve: ${data.goals.join(", ")}`,
      timeframe: data.timeframe,
      goals: data.goals,
      startDate: startDate.toISOString(),
      targetDate: targetDate.toISOString(),
    });

    // Simulate progress updates
    for (let i = 0; i < statuses.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // In a real implementation, you'd update progress here
    }

    // Generate sample data
    const longTermGoal = `Successfully achieve: ${data.goals.join(" and ")} within ${data.timeframe} days.`;
    const weeklyGoals = [
      "Complete initial research and planning",
      "Set up necessary resources and tools",
      "Begin executing core tasks",
    ];

    const today = new Date();
    const dailyTasks = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      return {
        id: crypto.randomUUID(),
        projectId,
        title: `Task ${i + 1} for ${data.name}`,
        description: `Complete this task as part of your ${data.name} project`,
        date: dateStr!,
        status: "pending" as const,
        effortEstimate: (["S", "M", "L"] as const)[i % 3],
      };
    });

    // Update project with generated data
    updateProject(projectId, {
      status: "active",
      longTermGoal,
      weeklyGoals,
      dailyTasks,
      missedTasks: [],
    });

    // Navigate to project detail
    setSelectedProjectId(projectId);
    setScreen("project-detail");
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setScreen("project-detail");
  };

  const handleSettings = () => {
    setScreen("settings");
  };

  const handleBackToDashboard = () => {
    setSelectedProjectId(null);
    setScreen("dashboard");
  };

  // Welcome and Onboarding screens (full screen)
  if (screen === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (screen === "onboarding") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (screen === "create-project") {
    return (
      <ProjectCreationForm
        onContinue={handleProjectFormContinue}
        onCancel={handleBackToDashboard}
      />
    );
  }

  if (screen === "creating-project") {
    return (
      <ProjectCreationLoading
        status="Creating your personalized plan..."
        progress={50}
      />
    );
  }

  // Main app layout (sidebar + content)
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        onCreateProject={handleCreateProject}
        onSelectProject={handleSelectProject}
        selectedProjectId={selectedProjectId}
        onSettings={handleSettings}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {screen !== "settings" && (
          <DashboardBanner onCreateProject={handleCreateProject} />
        )}
        <div className="flex-1 overflow-hidden">
          {screen === "dashboard" && (
            <DashboardScreen
              onCreateProject={handleCreateProject}
              onSelectProject={handleSelectProject}
            />
          )}
          {screen === "project-detail" && selectedProjectId && (
            <ProjectDetailScreen projectId={selectedProjectId} />
          )}
          {screen === "settings" && <SettingsScreen />}
        </div>
      </div>
    </div>
  );
}
