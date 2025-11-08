"use client";

import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";

interface ProjectCreationLoadingProps {
  status: string;
  progress: number;
}

const STATUS_MESSAGES = [
  "Analyzing your goal...",
  "Creating personalized milestones...",
  "Generating weekly objectives...",
  "Breaking down into daily tasks...",
  "Optimizing your timeline...",
  "Finalizing your plan...",
];

export function ProjectCreationLoading({
  status,
  progress,
}: ProjectCreationLoadingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              Creating Your Plan
            </h2>
            <p className="text-muted">
              This may take a couple of minutes. Please don't close this page.
            </p>
          </div>
          <div className="space-y-4">
            <ProgressBar value={progress} showLabel variant="default" />
            <div className="space-y-2">
              {STATUS_MESSAGES.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-sm transition-opacity ${
                    idx <= Math.floor((progress / 100) * STATUS_MESSAGES.length)
                      ? "text-primary opacity-100"
                      : "text-muted opacity-50"
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-primary mt-4">{status}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

