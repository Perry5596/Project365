"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";
import { useSettingsStore } from "~/state/useSettingsStore";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<"intro" | "setup">("intro");
  const [userName, setUserName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { setUserName: saveUserName, setOpenAIApiKey: saveApiKey, completeOnboarding } =
    useSettingsStore();

  const handleContinue = () => {
    if (step === "intro") {
      setStep("setup");
    } else {
      if (userName.trim() && apiKey.trim()) {
        saveUserName(userName.trim());
        saveApiKey(apiKey.trim());
        completeOnboarding();
        onComplete();
      }
    }
  };

  if (step === "intro") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <Card className="w-full max-w-2xl p-8">
          <SectionHeader
            title="How Project 365 Works"
            description="Let's get you set up in just a few steps"
          />
          <div className="space-y-6 mt-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">1. Set Your Goal</h3>
              <p className="text-muted">
                Tell us what you want to achieve. Whether it's getting into college,
                starting a business, or learning a new skill - we'll help you get there.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">2. AI Creates Your Plan</h3>
              <p className="text-muted">
                Our AI analyzes your goal and creates a personalized plan with daily
                tasks, weekly milestones, and a clear path to success.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">3. Track Your Progress</h3>
              <p className="text-muted">
                Complete tasks, track your progress, and stay motivated with daily
                reminders and progress indicators.
              </p>
            </div>
            <div className="pt-4">
              <Button onClick={handleContinue} size="lg" className="w-full">
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
      <Card className="w-full max-w-2xl p-8">
        <SectionHeader
          title="Setup Your Account"
          description="We need a few details to get started"
        />
        <div className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
            />
            <p className="mt-2 text-xs text-muted">
              Your API key is stored locally and never sent to our servers.{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Get your API key here
              </a>
            </p>
          </div>
          <div className="pt-4">
            <Button
              onClick={handleContinue}
              size="lg"
              className="w-full"
              disabled={!userName.trim() || !apiKey.trim()}
            >
              Complete Setup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

