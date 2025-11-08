# Project 365 – Master TODO

## 0. Repo & Project Setup

- [X] Create new public GitHub repo: `Project365`.
- [X] Initialize app with Next.js + React + TypeScript:
  - [X] Next.js app with TypeScript template
- [X] Set up base folder structure:
  - [X] `src/domain` (weekHelpers.ts)
  - [X] `src/state` (useProjectStore, useSettingsStore)
  - [X] `src/ui` (components folder with all UI components)
  - [X] `src/app` (Next.js app router structure)
  - [ ] `src/ai` (AI integration - in progress)
  - [ ] `src/services` (storage services - using Zustand persist for now)
  - [X] `docs/` (documentation)
- [X] Configure TypeScript:
  - [X] Ensure `"strict": true` in `tsconfig.json`.
- [X] Add ESLint + Prettier with basic configs and `lint` script.
- [X] Choose license (MIT) and add `LICENSE`.
- [X] Add `.cursor/rules` folder (global, ui-ux, ai-planning, state-data, notifications).
- [X] Verify dev server:
  - [X] `npm install`
  - [X] `npm run dev`
  - [X] App renders and works correctly.

## 1. Styling & Tailwind CSS

- [X] Install Tailwind CSS & dependencies (Tailwind v4 with Next.js).
- [X] Initialize Tailwind:
  - [X] Configured for Next.js app router.
- [X] Configure `tailwind.config.ts`:
  - [X] Set `content` to include all source files.
  - [X] Extend theme with:
    - [X] Colors: background, surface, border, accent, danger, success, warning, muted, primary.
    - [X] GitHub dark-inspired color scheme (#2596be primary).
    - [X] Dark mode support.
- [X] Add Tailwind base styles in `src/styles/globals.css`:
  - [X] `@import "tailwindcss"` with `@theme` block.
  - [X] CSS variables for theming.
- [X] Create base layout & components using Tailwind:
  - [X] `Sidebar` (with user info, projects list, streak counter).
  - [X] `NavBar` (top navigation bar).
  - [X] `Button`, `Card`, `Badge`, `StatTile`, `TaskItem`, `EditableTaskItem`.
  - [X] `ProgressBar`, `CircularProgress`, `SectionHeader`.
  - [X] `SortableItem`, `DraggableTaskList`, `NewTaskForm`.
  - [X] `AIChat`, `WeeklyGoalsList`, `DaysAheadBadge`.
  - [X] `ProjectContextMenu`, `DeleteProjectModal`.
  - [X] Theme toggle with light/dark mode support.

## 2. Domain Modeling

- [X] Create domain types in `src/state/useProjectStore.ts`:
  - [X] `Project` (with id, name, description, timeframe, goals, dates, status, tasks, weeklyGoals)
  - [X] `WeeklyGoal` (with id, text, completed, weekStartDate)
  - [X] `Task` (with id, projectId, title, description, date, status, importance, order)
- [X] Create enums/constants:
  - [X] `ProjectStatus`: "planning" | "active" | "completed" | "cancelled"
  - [X] `TaskStatus`: "pending" | "done" | "missed"
  - [X] Timeframe constraints (30, 90, 180, 365 days)
- [X] Create `src/domain/weekHelpers.ts`:
  - [X] `getWeekStartDate(date)` - Get Sunday of week
  - [X] `getWeekStartDateString(date)` - ISO string for week start
  - [X] `getNextWeekStartDate(currentWeekStart)` - Calculate next week
  - [X] `daysBetween(date1, date2)` - Calculate days between dates
- [X] Implement selectors in components:
  - [X] `daysRemaining` calculation (in ProjectDetailScreen)
  - [X] `daysAhead` calculation (in useProjectStore)
  - [X] `getTasksForDate` (filtering in components)
  - [X] `getMissedTasksForCurrentWeek` (project.missedTasks)

## 3. State & Storage (Local-First)

- [X] Install Zustand:
  - [X] `npm install zustand zustand/middleware/persist`
- [X] Design storage strategy:
  - [X] Using Zustand persist middleware with localStorage.
- [X] Implement Zustand stores:
  - [X] `useProjectStore` in `src/state/useProjectStore.ts`:
    - [X] `projects` array with full CRUD operations
    - [X] `selectedProjectId` state
    - [X] Task operations: `addTask`, `updateTask`, `deleteTask`, `reorderTasks`
    - [X] Weekly goal operations: `toggleWeeklyGoal`, `moveToNextWeek`
    - [X] `calculateDaysAhead` function
    - [X] Persisted to localStorage as "project365-projects"
  - [X] `useSettingsStore` in `src/state/useSettingsStore.ts`:
    - [X] `openAIApiKey`, `userName`, `hasCompletedOnboarding`
    - [X] `streakDays`, `lastActiveDate` with streak calculation
    - [X] `theme` ("light" | "dark") with `toggleTheme`, `setTheme`
    - [X] Persisted to localStorage as "project365-settings"
- [X] Data loads automatically on app startup via Zustand persist.

## 4. UI & Routing

- [X] Use Next.js App Router for routing (client-side state management for screens).
- [X] Implement screen management in `src/app/page.tsx`:
  - [X] `welcome` – Welcome screen with get started button
  - [X] `onboarding` – Onboarding flow (name, API key)
  - [X] `overview` – Overview/dashboard screen
  - [X] `create-project` – Project creation form
  - [X] `creating-project` – Loading screen during project creation
  - [X] `project-detail` – Project detail screen
  - [X] `settings` – Settings screen
- [X] Implement `AppShell` with `Sidebar` & main content area:
  - [X] Sidebar with user avatar, projects list (active/completed), streak counter
  - [X] NavBar at top with theme toggle and create project button
  - [X] Main content area with scrollable views
- [X] Overview/Dashboard screen:
  - [X] Statistics cards (total projects, completed, in progress)
  - [X] Overall progress today (circular progress, task completion)
  - [X] AI chat for account-wide questions
  - [X] Draggable/rearrangeable components
- [X] Project creation screen:
  - [X] Multi-phase form (name, timeframe, goals selection)
  - [X] AI input phase for detailed project context
  - [X] Loading screen with status messages
  - [X] Simulated project creation (ready for AI integration)
- [X] Project detail screen:
  - [X] Header (title, description, status badge, days remaining)
  - [X] Project statistics (circular progress, days remaining, today's tasks, schedule status)
  - [X] Long-term goal display
  - [X] Weekly goals (completable with checkboxes, move to next week modal)
  - [X] Today's tasks (draggable, editable, with importance, completed section)
  - [X] Missed tasks section
  - [X] Progress today (task completion for today only)
  - [X] AI chat for project-specific questions
  - [X] Draggable/rearrangeable components
- [X] Settings screen:
  - [X] Basic structure (ready for API key input, model selection, etc.)
- [X] Additional features:
  - [X] Right-click context menu on projects (Edit, Delete)
  - [X] Delete confirmation modal
  - [X] Theme toggle (light/dark mode) in NavBar

## 5. AI Integration – Core

- [ ] Install OpenAI SDK:
  - [ ] `npm install openai zod`
- [ ] Create `src/ai/openaiClient.ts`:
  - [ ] Function to call OpenAI with provided API key and model.
- [ ] Create `src/ai/types.ts` and `src/ai/schemas.ts`:
  - [ ] `AiProjectPlan`, `AiMilestone`, `AiPlannedTask` + Zod schemas.
- [ ] Create `src/ai/prompts/createProjectPlanPrompt.ts`:
  - [ ] Function that builds the prompt given project goal & constraints.
- [ ] Create `src/ai/planGenerator.ts`:
  - [ ] `generateInitialPlan(goalInput)` using OpenAI.
  - [ ] Parse + validate response; map to `Project` + `Task`s.
- [ ] Wire project creation form to call `generateInitialPlan` and save result.
- [X] UI components ready:
  - [X] `AIChat` component (ChatGPT-like interface)
  - [X] AI input phase in project creation
  - [X] AI chat in overview and project detail screens
  - [X] Placeholder responses (ready for real AI integration)

## 6. AI Integration – Ongoing Control

- [ ] Add "Regenerate Plan" button on project detail.
- [ ] Add "Shorten Timeline" flow:
  - [ ] Modal to pick new target date.
  - [ ] Send project snapshot + new date to AI.
- [ ] Add "Adjust Difficulty" control (easier/harder).
- [ ] Add "Incorporate Missed Tasks" action:
  - [ ] Summarize missed tasks.
  - [ ] Ask AI for updated schedule.
- [X] AI chat interface ready in project detail screen for these interactions.

## 7. Task Lifecycle & Missed Tasks

- [ ] Implement daily rollover:
  - [ ] On app load, mark overdue pending tasks as missed.
- [ ] Implement weekly cleanup:
  - [ ] Detect new week and clear last week's missed list.
- [X] Missed Tasks UI:
  - [X] Show current week's missed tasks by project.
  - [X] Allow marking them done (via task toggle).
  - [X] Tasks displayed in separate "Missed Tasks" section.
- [X] Task management features:
  - [X] Tasks sorted by importance (5 → 1), then by order
  - [X] Completed tasks automatically move to "Completed" section at bottom
  - [X] Tasks are draggable and reorderable (within pending tasks)
  - [X] Tasks are editable (inline editing with confirm button)
  - [X] Tasks have importance scores (1-5)
  - [X] New tasks inserted at correct position based on importance

## 8. Schedule Metrics & Forcing Function

- [X] Implement `daysRemaining` and display it:
  - [X] Calculated in ProjectDetailScreen.
  - [X] Displayed in project statistics section.
  - [X] Shown in StatTile component.
- [X] Implement `daysAhead` calculation and display:
  - [X] `calculateDaysAhead` function in useProjectStore.
  - [X] Tracks days ahead when weeks are completed early.
  - [X] Decays as time passes.
  - [X] Displayed with `DaysAheadBadge` component (green for ahead, red for behind).
  - [X] Shows "0 days ahead" when on schedule.
- [X] Weekly goals completion tracking:
  - [X] Weekly goals are completable with checkboxes.
  - [X] Modal appears when all goals completed, offering to move to next week.
  - [X] `moveToNextWeek` function calculates and adds days ahead.
  - [X] Days ahead persists and decays appropriately.
- [ ] When behind:
  - [ ] Show "Generate catch-up plan" action (ready for AI integration).
- [ ] When ahead:
  - [ ] Show options to shorten timeline or increase difficulty (ready for AI integration).

## 9. Notifications & Reminders (Web)

- [ ] Implement notification service (`src/services/notifications.ts`):
  - [ ] Wrap browser Notification API (requestPermission, show).
- [ ] Settings toggles for:
  - [ ] Daily reminder.
  - [ ] Behind schedule alerts.
  - [ ] Weekly review.
- [ ] Simple scheduling strategy:
  - [ ] Trigger reminders when app is open (no background guarantees yet).
  - [ ] Use in-app banners when browser notifications disabled.
- [X] Settings screen structure ready for notification preferences.

## 10. Settings & Model Selection

- [X] API key management:
  - [X] Input in onboarding screen.
  - [X] Local persistence via `useSettingsStore`.
  - [ ] Masking in settings screen (to be added).
  - [ ] "Test key" button (to be added).
- [ ] Model selection dropdown (to be added to settings screen).
- [X] Persist settings via Zustand persist middleware.
- [X] Theme management:
  - [X] Light/dark mode toggle in NavBar.
  - [X] Theme persisted in settings store.
  - [X] Theme applied via `ThemeProvider` component.
  - [X] GitHub dark-inspired color scheme.

## 11. Testing & QA

- [ ] Add test setup (Vitest or Jest).
- [ ] Unit tests for:
  - [ ] Date utilities.
  - [ ] `daysRemaining`, `daysBehind`.
  - [ ] Missed task rollover logic.
  - [ ] AI response parsing & Zod validation.
- [ ] Manual QA checklist:
  - [ ] Create project, generate plan, complete/miss tasks, see metrics update.
  - [ ] Change timeline and verify recalculations.
  - [ ] Settings changes persist between reloads.

## 12. Open Source Polish

- [ ] Write `CONTRIBUTING.md`.
- [ ] Add `CODE_OF_CONDUCT.md`.
- [ ] Create GitHub issue templates.
- [ ] Add CI (GitHub Actions) for lint + tests.
- [ ] Add screenshots/GIFs to README after core UI is stable.
- [ ] Tag first `v0.1.0` once the main flow works end-to-end.
