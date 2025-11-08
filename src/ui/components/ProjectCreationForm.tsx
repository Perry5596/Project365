"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";
import { Badge } from "./Badge";

const COMMON_GOALS = [
  "Get into College",
  "Start a Business",
  "Learn a New Skill",
  "Get Fit & Healthy",
  "Land a Dream Job",
  "Write a Book",
  "Learn a Language",
  "Build an App",
  "Save Money",
  "Travel the World",
  "Start a YouTube Channel",
  "Master an Instrument",
  "Get a Promotion",
  "Buy a House",
  "Start a Podcast",
  "Run a Marathon",
  "Build a Brand",
  "Get Certified",
  "Improve Mental Health",
  "Start Investing",
];

const TIMEFRAMES = [
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "180 Days", value: 180 },
  { label: "365 Days", value: 365 },
];

interface ProjectCreationFormProps {
  onContinue: (data: {
    name: string;
    timeframe: number;
    goals: string[];
    aiInput: string;
  }) => void;
  onCancel: () => void;
}

export function ProjectCreationForm({
  onContinue,
  onCancel }: ProjectCreationFormProps) {
  const [step, setStep] = useState<"form" | "ai">("form");
  const [name, setName] = useState("");
  const [timeframe, setTimeframe] = useState(365);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [aiInput, setAiInput] = useState("");

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((g) => g !== goal)
        : prev.length < 3
          ? [...prev, goal]
          : prev
    );
  };

  const handleContinue = () => {
    if (step === "form") {
      if (name.trim() && selectedGoals.length > 0) {
        setStep("ai");
      }
    } else {
      if (aiInput.trim().length > 50) {
        onContinue({
          name: name.trim(),
          timeframe,
          goals: selectedGoals,
          aiInput: aiInput.trim(),
        });
      }
    }
  };

  if (step === "form") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <Card className="w-full max-w-3xl p-8">
          <SectionHeader
            title="Create New Project"
            description="Let's set up your goal and timeline"
          />
          <div className="space-y-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Get into MIT for Computer Science"
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Expected Timeframe
              </label>
              <div className="grid grid-cols-4 gap-3">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.value)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                      timeframe === tf.value
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface text-primary hover:bg-surface-alt"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Select Goals (up to 3)
              </label>
              <div className="flex flex-wrap gap-2 p-4 border border-border rounded-lg bg-surface-alt min-h-[200px]">
                {COMMON_GOALS.map((goal) => (
                  <Badge
                    key={goal}
                    variant={selectedGoals.includes(goal) ? "default" : "muted"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleGoal(goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">
                Selected: {selectedGoals.length}/3
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="ghost" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                className="flex-1"
                disabled={!name.trim() || selectedGoals.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-4xl p-8">
        <SectionHeader
          title="Tell Us More"
          description="The more details you provide, the better your personalized plan will be"
        />
        <div className="space-y-6 mt-6">
          <div className="bg-surface-alt rounded-lg p-4 border border-border">
            <p className="text-sm text-muted mb-2">
              <strong className="text-primary">Example:</strong> If your goal is to get into
              college, tell us:
            </p>
            <ul className="text-sm text-muted space-y-1 list-disc list-inside">
              <li>Which college/university?</li>
              <li>What major or program?</li>
              <li>Your current SAT/ACT scores</li>
              <li>Your GPA and academic standing</li>
              <li>Financial situation and scholarship needs</li>
              <li>Extracurricular activities</li>
              <li>Any deadlines or important dates</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Share Your Details
            </label>
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Start typing... The more details, the better!"
              className="w-full h-64 rounded-lg border border-border bg-surface px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 resize-none"
            />
            <p className="mt-2 text-xs text-muted">
              {aiInput.length} characters (minimum 50 recommended)
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="ghost"
              onClick={() => setStep("form")}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleContinue}
              className="flex-1"
              disabled={aiInput.trim().length < 50}
            >
              Create Project
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

