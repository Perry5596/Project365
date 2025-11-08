"use client";

import { Button } from "./Button";
import { Card } from "./Card";
import { StatTile } from "./StatTile";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-extrabold text-primary">Project 365</h1>
          <p className="text-xl text-muted">
            AI-assisted goal tracker and strategist for the next 365 days of your life
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatTile
            label="Open Source"
            value="100%"
            description="Free and open source"
          />
          <StatTile
            label="AI Powered"
            value="Smart"
            description="Personalized planning"
          />
          <StatTile
            label="Your Goals"
            value="365"
            description="Days to achieve them"
          />
        </div>

        {/* Info Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Welcome!</h2>
            <p className="text-muted">
              Project 365 is an open-source application designed to help you achieve
              any goal within 365 days. Using AI, we create personalized plans that
              break down your ambitions into actionable daily tasks.
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted mb-2">
                Created with ❤️ by{" "}
                <span className="font-semibold text-primary">jdbre</span>
              </p>
              <a
                href="https://github.com/jdbre/project365"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline inline-flex items-center gap-1"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="flex justify-center">
          <Button size="lg" onClick={onGetStarted} className="px-12">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

