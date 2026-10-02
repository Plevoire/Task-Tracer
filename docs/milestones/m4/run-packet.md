# M4 Run Packet

Documentation paths updated on 2026-10-02. Original dates, approvals, results, and limitations are preserved. Plain paths and recorded commands are relative to the project root; baseline commands now use relocated destinations. Markdown links are relative to this document.

- Identity: TT-M4-001. Created: 2026-10-01, Asia/Manila. Status: BLOCKED only at native M4 acceptance; implementation/checks complete.
- Authority: the project owner explicitly approved M4 priorities/due dates/Overdue label and accepted M3 in this chat. M3 approval is owner acceptance, not supplied native-browser test details.
- Owner: the project owner. Execution owner/writer: Codex only; zero agents/external model lanes/reviewers/worktrees.
- Mode: STANDARD. Shape: feature with local data compatibility. Method: smallest plain-JavaScript implementation and deterministic tests.
- Workspace: `<project-root>`; no Git repository/branch/forge authority. Baseline: M3 source/tests under `docs/milestones/m3/baseline/`, 25 simulated tests.
- Goal: add/edit priority Low/Normal/High, optional due date, and visible Overdue text for incomplete tasks past their date.
- Date contract: date-only YYYY-MM-DD, years 0001–9999, valid Gregorian calendar date, or empty string for no date. Compare against the browser's local calendar date. Due today is not overdue; completed/undated tasks are not overdue. Recalculate on render/refresh; no background reminders or timers.
- Compatibility: retain key `task-tracker-v1` and version-1 tasks/categories record. Missing priority defaults to Normal, missing dueDate to empty in memory; no write on load. Present invalid values or corrupt data block changes without overwrite.
- In scope: labeled Add/Edit controls, visible priority/due/overdue text, keyboard focus/error handling, saved-data compatibility, targeted tests/docs/state/evidence.
- Excluded: sorting/search/new filters, reminders/notifications, category rename/delete, backend/accounts/sync/deployment, real data, credentials/dependencies/frameworks, global files, Git/PR/CI and additional agents.
- Allowed: scoped source/tests/docs/evidence, local sample simulations/checks, baseline copies. External access/credentials: none required.
- Acceptance: add/edit values persist; blank date accepted; invalid dates/priorities rejected; old tasks normalize without loss/writes; correct yesterday/today/tomorrow/leap boundaries; completed tasks lack Overdue; failure preserves data/drafts; M1–M3 behavior passes.
- Evidence: `docs/milestones/m4/evidence/verification.md`. Browser file:// policy previously blocks automation and prohibits workarounds; no retry/server/alternate route. Native browser/keyboard/layout/readback must remain unverified unless owner provides results.
- Budget: six repairs; at most two same-hypothesis failures without new evidence. Stop for protected actions, material scope/recovery conflicts, or exhausted budget.
- Recovery: preserve M3 source/history; no automatic rollback or browser-data reset. M3 source cannot validate new priority/date fields, so do not use it to modify M4 data without a deliberate recovery plan.
- Expected result: DEMO_READY only with supported runtime acceptance; otherwise SANDBOX_BOUNDARY_BLOCKED only at native M4 acceptance, separately reporting implementation/checks.

## Execution result

Implemented the approved slice. App/test syntax and static checks passed; 33 simulated behavior tests passed. Preserved M3 baseline passes 25 tests. App repairs: 0. No protected actions performed.

Result: SANDBOX_BOUNDARY_BLOCKED only at native M4 browser acceptance. Evidence: `docs/milestones/m4/evidence/verification.md`. Next action: the project owner runs the sample-only browser steps and reports results/browser. No earlier milestone's acceptance is transferred to M4.

Session stopped at owner's request on 2026-10-01. Continuity saved in `checkpoint.md`; intended manual continuation 2026-10-02. No automatic run scheduled and no additional scope authorized.
