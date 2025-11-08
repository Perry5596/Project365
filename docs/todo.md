# Project 365 – Master TODO

## 0. Repo & Project Setup

- [X] Create new public GitHub repo: `Project365`.
- [X] Initialize app with Vite + React + TypeScript:
  - [X] `npm create vite@latest project-365 -- --template react-ts`
- [ ] Set up base folder structure:
  - [ ] `src/domain`
  - [ ] `src/state`
  - [ ] `src/ui`
  - [ ] `src/screens`
  - [ ] `src/ai`
  - [ ] `src/services`
  - [ ] `docs/`
- [X] Configure TypeScript:
  - [X] Ensure `"strict": true` in `tsconfig.json`.
- [X] Add ESLint + Prettier with basic configs and `lint` script.
- [X] Choose license (MIT) and add `LICENSE`.
- [X] Add `.cursor/rules` folder (global, ui-ux, ai-planning, state-data, notifications).
- [X] Verify dev server:
  - [X] `npm install`
  - [X] `npm run dev`
  - [X] App renders basic placeholder.

## 1. Styling & Tailwind CSS

- [X] Install Tailwind CSS & dependencies (per Tailwind + Vite guide).
- [X] Initialize Tailwind:
  - [X] `npx tailwindcss init -p`
- [X] Configure `tailwind.config.(js|ts)`:
  - [X] Set `content` to include `index.html`, `src/**/*.{ts,tsx}`.
  - [X] Extend theme with:
    - [X] Colors: background, surface, border, accent, danger, success.
    - [X] Typography scale.
    - [X] Radii & shadows.
- [X] Add Tailwind base styles in `src/index.css`:
  - [X] `@tailwind base; @tailwind components; @tailwind utilities;`
- [ ] Create base layout & components using Tailwind:
  - [ ] `AppShell` (sidebar + main panel).
  - [ ] `Button`, `Card`, `Tag`, `StatTile`, `TaskItem`.

## 2. Domain Modeling

- [ ] Create `src/domain/types.ts`:
  - [ ] `Project`
  - [ ] `Milestone`
  - [ ] `Task`
  - [ ] `ProgressMetric`
- [ ] Create enums/constants:
  - [ ] `ProjectStatus`
  - [ ] `TaskStatus`
  - [ ] `MAX_PROJECT_DAYS = 365`
- [ ] Create `src/domain/dates.ts`:
  - [ ] `daysBetween(a, b)`
  - [ ] Week helpers.
- [ ] Create `src/domain/selectors.ts`:
  - [ ] `getDaysRemaining(project)`
  - [ ] `getDaysBehind(project, tasks)`
  - [ ] `getTasksForDate(projectId, date)`
  - [ ] `getMissedTasksForCurrentWeek(projectId, date)`

## 3. State & Storage (Local-First)

- [ ] Install Zustand:
  - [ ] `npm install zustand`
- [ ] Design storage strategy:
  - [ ] Simple wrapper around localStorage or IndexedDB.
- [ ] Implement `ProjectRepository` in `src/services/storage/projects.ts`:
  - [ ] `getAllProjects`, `getProjectById`, `saveProjects`.
- [ ] Implement `TaskRepository`:
  - [ ] `getTasksByProjectId`, `saveTasks`.
- [ ] Implement `SettingsRepository`:
  - [ ] Store API key, model selection, notification preferences, theme.
- [ ] Create Zustand stores:
  - [ ] `useProjectStore`
  - [ ] `useTaskStore`
  - [ ] `useSettingsStore`.
- [ ] Load initial data on app startup.

## 4. UI & Routing

- [ ] Install React Router:
  - [ ] `npm install react-router-dom`
- [ ] Configure routes:
  - [ ] `/` – Dashboard
  - [ ] `/projects/:projectId` – Project detail
  - [ ] `/missed` – Missed tasks view
  - [ ] `/settings` – Settings
- [ ] Implement `AppShell` with sidebar & main content.
- [ ] Dashboard:
  - [ ] Project cards (title, status, days remaining).
  - [ ] Button to create new project.
- [ ] Project creation screen:
  - [ ] Form for basic project details.
  - [ ] “Generate plan with AI” (stub).
- [ ] Project detail screen:
  - [ ] Header (title, days remaining, status).
  - [ ] Tabs/sections: Today, Week, Plan, Missed Tasks.
- [ ] Settings screen:
  - [ ] API key input.
  - [ ] AI model selection.
  - [ ] Notification toggles and time.
  - [ ] Theme toggle.

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

## 6. AI Integration – Ongoing Control

- [ ] Add “Regenerate Plan” button on project detail.
- [ ] Add “Shorten Timeline” flow:
  - [ ] Modal to pick new target date.
  - [ ] Send project snapshot + new date to AI.
- [ ] Add “Adjust Difficulty” control (easier/harder).
- [ ] Add “Incorporate Missed Tasks” action:
  - [ ] Summarize missed tasks.
  - [ ] Ask AI for updated schedule.

## 7. Task Lifecycle & Missed Tasks

- [ ] Implement daily rollover:
  - [ ] On app load, mark overdue pending tasks as missed.
- [ ] Implement weekly cleanup:
  - [ ] Detect new week and clear last week’s missed list.
- [ ] Missed Tasks UI:
  - [ ] Show current week’s missed tasks by project.
  - [ ] Allow marking them done or ignoring them.

## 8. Schedule Metrics & Forcing Function

- [ ] Implement `daysRemaining` and display it:
  - [ ] On project cards and headers.
- [ ] Implement `daysBehind` and display with warning styling.
- [ ] When behind:
  - [ ] Show “Generate catch-up plan” action.
- [ ] When ahead:
  - [ ] Show options to shorten timeline or increase difficulty.

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

## 10. Settings & Model Selection

- [ ] API key management:
  - [ ] Input, masking, local persistence.
  - [ ] “Test key” button.
- [ ] Model selection dropdown.
- [ ] Persist settings via `SettingsRepository`.

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
