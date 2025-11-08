"use client";

import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";

export function SettingsScreen() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 pt-4 min-h-full">
        <Card className="p-6">
          <SectionHeader title="Settings" description="Configure your preferences" />
          <div className="mt-6">
            <p className="text-muted">Settings page coming soon...</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

