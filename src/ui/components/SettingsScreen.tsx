"use client";

import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";

export function SettingsScreen() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <Card className="p-6">
        <SectionHeader title="Settings" description="Configure your preferences" />
        <div className="mt-6">
          <p className="text-muted">Settings page coming soon...</p>
        </div>
      </Card>
    </div>
  );
}

