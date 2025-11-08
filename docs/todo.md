# Project 365 – Master TODO

## 0. Repo & Project Setup

- [ ] Create new public GitHub repo: `project-365` (or chosen name).
- [ ] Initialize project with `pnpm` or `yarn` and a base Expo + React Native TypeScript template.
- [ ] Set up base folder structure:
  - [ ] `src/domain`
  - [ ] `src/state`
  - [ ] `src/ui`
  - [ ] `src/screens`
  - [ ] `src/ai`
  - [ ] `src/services`
  - [ ] `docs/`
- [ ] Add TypeScript config with `"strict": true`.
- [ ] Add ESLint + Prettier with sensible defaults and CI lint script.
- [ ] Choose license (MIT) and add `LICENSE`.
- [ ] Create `README.md` with vision, screenshots placeholder, and quickstart.
- [ ] Add `.cursor/rules` folder and paste in global & feature rules.

## 1. Domain Modeling

- [ ] Define core TypeScript types in `src/domain/types.ts`:
  - [ ] `Project`
  - [ ] `Milestone`
  - [ ] `Task` (planned task, missed task via status field)
  - [ ] `ProgressMetric`
- [ ] Define enums/constants:
  - [ ] `ProjectStatus` (planned, active, completed, cancelled)
  - [ ] `TaskStatus` (pending, done, missed)
  - [ ] `MAX_PROJECT_DAYS = 365`
- [ ] Implement utility functions in `src/domain/dates.ts`:
  - [ ] `daysBetween(a, b)`
  - [ ] `isNewWeek(previousDate, currentDate)`
  - [ ] Helpers for start/end of week.
- [ ] Implement key calculations in `src/domain/selectors.ts`:
  - [ ] `getDaysRemaining(project)`
  - [ ] `getDaysBehind(project, taskHistory)`
  - [ ] `getTasksForDate(projectId, date)`
  - [ ] `getMissedTasksForCurrentWeek(projectId, date)`

## 2. Storage & State

- [ ] Choose local storage implementation (e.g. SQLite via Expo).
- [ ] Implement `ProjectRepository`:
  - [ ] `getAllProjects`
  - [ ] `getProjectById`
  - [ ] `createProject`
  - [ ] `updateProject`
  - [ ] `deleteProject`
- [ ] Implement `TaskRepository`:
  - [ ] `getTasksByProjectId`
  - [ ] `createTasks`
  - [ ] `updateTask`
  - [ ] `deleteTask`
- [ ] Implement `SettingsRepository`:
  - [ ] Store AI model choice, API key, notifications settings, theme.
- [ ] Create Zustand stores:
  - [ ] `useProjectStore`
  - [ ] `useTaskStore`
  - [ ] `useSettingsStore`
- [ ] Wire repositories into stores with async actions.
- [ ] Add startup bootstrap logic to load initial data on app launch.

## 3. UI & Navigation

- [ ] Set up navigation (Expo Router or React Navigation).
- [ ] Implement **Home / Dashboard** screen:
  - [ ] List of projects with:
    - [ ] Title
    - [ ] Days remaining
    - [ ] Status badge
  - [ ] Button to create new project.
- [ ] Implement **Project creation** screen:
  - [ ] Form for:
    - [ ] Project name
    - [ ] Description
    - [ ] Start date (default today)
    - [ ] Target date (limit 365 days)
    - [ ] Optional baseline and constraints.
  - [ ] “Generate plan with AI” button.
- [ ] Implement **Project detail** screen:
  - [ ] Header with:
    - [ ] Project title
    - [ ] Days remaining
    - [ ] Status
  - [ ] Tabs/sections for:
    - [ ] Today
    - [ ] Week
    - [ ] Plan (milestones)
    - [ ] Missed tasks
  - [ ] Area for AI assistant (dockable panel or bottom sheet).
- [ ] Implement **Settings** screen:
  - [ ] OpenAI API key entry.
  - [ ] AI model selection.
  - [ ] Notification toggles and time selection.
  - [ ] Theme toggle (light/dark).

## 4. Theming & Design System

- [ ] Create `src/ui/theme.ts` with:
  - [ ] Color tokens for light and dark theme.
  - [ ] Typography scale and font families.
  - [ ] Radii and shadow tokens.
- [ ] Build primitive components:
  - [ ] `Button`
  - [ ] `Card`
  - [ ] `Tag/Badge`
  - [ ] `ProgressBar`
  - [ ] `StatTile`
  - [ ] `TaskItem`
  - [ ] `SectionHeader`
- [ ] Implement theme provider and hook (`useTheme`).
- [ ] Ensure basic support for dark mode switching.

## 5. AI Integration – Core

- [ ] Build `src/ai/openaiClient.ts`:
  - [ ] Reads API key from settings.
  - [ ] Configurable model name.
  - [ ] Basic rate limiting and error handling.
- [ ] Create Zod schemas in `src/ai/schemas.ts` for:
  - [ ] `AiProjectPlan`
  - [ ] `AiMilestone`
  - [ ] `AiPlannedTask`
- [ ] Implement prompt builders:
  - [ ] `createProjectPlanPrompt(goalInput, constraints, dates)`
- [ ] Implement `generateInitialPlan()` in `src/ai/planGenerator.ts`:
  - [ ] Call OpenAI.
  - [ ] Parse and validate JSON.
  - [ ] Map to internal `Project`, `Milestone`, `Task` types.
- [ ] Connect project creation screen to `generateInitialPlan()`:
  - [ ] On submit, call AI.
  - [ ] Save returned plan to repositories/stores.
  - [ ] Show loading/progress state and error handling.

## 6. AI Integration – Ongoing Control

- [ ] Implement “Regenerate plan” action:
  - [ ] User can request full re-plan.
  - [ ] AI returns new `AiProjectPlan`.
  - [ ] Option to replace existing plan or view diffs before applying.
- [ ] Implement “Shorten timeline” action:
  - [ ] User specifies new target date.
  - [ ] Send current plan + new date to AI.
  - [ ] Apply returned updated plan.
- [ ] Implement “Adjust difficulty” action:
  - [ ] Options: easier / harder.
  - [ ] AI adjusts tasks intensity/frequency.
- [ ] Implement “Incorporate missed tasks” action:
  - [ ] Provide AI with summary of missed tasks and remaining days.
  - [ ] AI returns updated schedule (or recommendations).
  - [ ] Apply changes to tasks.

## 7. Task Lifecycle & Missed Tasks

- [ ] Implement daily rollover logic:
  - [ ] At app startup or at defined times:
    - [ ] For each project, move yesterday’s pending tasks to `missed`.
- [ ] Implement weekly cleanup:
  - [ ] When crossing into a new week:
    - [ ] Clear previous week’s missed task list.
- [ ] Implement “Missed tasks” UI:
  - [ ] Screen/section showing current week’s missed tasks by project.
  - [ ] Ability to manually mark them as done or ignore.

## 8. Schedule Metrics & Forcing Function

- [ ] Implement `daysRemaining` and `daysBehind` calculations.
- [ ] Display `daysRemaining` in:
  - [ ] Project cards.
  - [ ] Project headers.
- [ ] Display `daysBehind` when > 0:
  - [ ] Color-coded warning.
- [ ] If `daysBehind > 0`:
  - [ ] Show call to action to generate a “catch-up” plan with AI.
- [ ] If **ahead of schedule**:
  - [ ] UI prompt: “You’re ahead by X days. Shorten the timeline or increase difficulty?”
  - [ ] Buttons that trigger AI actions.

## 9. Notifications & Reminders

- [ ] Implement notification service in `src/services/notifications`.
- [ ] Request notification permissions where required.
- [ ] Implement daily reminder scheduling:
  - [ ] Respect time chosen in settings.
- [ ] Implement behind/ahead schedule alerts:
  - [ ] Trigger based on state changes, not every render.
- [ ] Connect settings toggles to notification scheduling/cancellation.

## 10. Settings & Model Selection

- [ ] Build secure storage for OpenAI API key.
- [ ] Allow user to:
  - [ ] Paste key.
  - [ ] See whether key is valid (test call).
- [ ] Provide dropdown for model selection:
  - [ ] Default to powerful model.
  - [ ] Offer lighter model options.
- [ ] Persist and respect chosen model in AI calls.

## 11. Testing & QA

- [ ] Add unit tests for:
  - [ ] Date utilities.
  - [ ] `daysRemaining`, `daysBehind` logic.
  - [ ] Missed task rollovers.
  - [ ] AI JSON validation (schema tests with mock responses).
- [ ] Add basic integration tests for:
  - [ ] Project creation + plan generation flow (with mocked AI).
- [ ] Manual QA checklist:
  - [ ] Create project and generate plan.
  - [ ] Complete tasks and verify UI updates.
  - [ ] Leave tasks incomplete and verify missed tasks list.
  - [ ] Adjust timeline and verify recalculated metrics.

## 12. Open Source Polish

- [ ] Write CONTRIBUTING guide (how to set up dev environment, coding standards).
- [ ] Add CODE_OF_CONDUCT.
- [ ] Add issue templates (Bug, Feature, Question).
- [ ] Add basic CI workflow:
  - [ ] Lint
  - [ ] Test
- [ ] Add screenshots or GIFs once UI is ready.
- [ ] Tag first `v0.1.0` release once core flow is stable.
