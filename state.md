# Project state

## Project and goal

- Project: Task Tracker, beginner BSIT practice project.
- Human owner: the project owner. Execution owner/writer: Codex only; no subagents.
- Canonical workspace: `<project-root>`.
- Canonical state: this file in SecondBrain. Last updated: 2026-10-02, Asia/Manila.
- Goal: learn plain HTML/CSS/JavaScript while growing a simple organized local tracker. Current data remains invented sample tasks.

## Mode and active milestone

- Mode: STANDARD. Shape: feature with local data compatibility.
- M4: priorities, optional due dates, and Overdue text; explicitly approved on 2026-10-01.
- Status: BLOCKED only at native M4 acceptance. Implementation/checks complete; result SANDBOX_BOUNDARY_BLOCKED.
- Active envelope: [M4 Run Packet](docs/milestones/m4/run-packet.md), TT-M4-001.
- Workspace: local Git repository on `main`; origin `https://github.com/Plevoire/Task-Tracer.git`. Baseline source/tests: `docs/milestones/m3/baseline/`.
- Previous: M3 owner-accepted on 2026-10-01 with 25 simulated tests, native test details not supplied. M1/M2 have owner-reported runtime acceptance. Preserve historical packets/evidence.

## Execution and data boundaries

- Method: smallest plain-JavaScript slice; deterministic checks and native-browser evidence only when permitted. Clear writing follows pstack:unslop.
- Topology: one owner/writer, no other agents/external model lanes/worktrees. Verification: runnable tests plus mapped manual procedure.
- Task data: `{ id, title, completed, category, priority, dueDate }`. Priority Low/Normal/High; date empty or valid YYYY-MM-DD in years 0001–9999.
- Categories remain user-managed; Uncategorized default retained. Rename/delete are deferred.
- Same storage key `task-tracker-v1`; version-1 tasks/categories record. Missing legacy category/priority/date normalize in memory; no load writes. Invalid data remains untouched with changes disabled.
- Overdue is derived for incomplete tasks before the browser-local today. Due today, completed, future, and undated tasks are not overdue. Recalculate on render/refresh; no timers/reminders/notifications.
- Full task collection saved; filters only derive a view and reset on refresh. Counts retain full/visible distinction.
- One edit at a time; other controls pause. Failed Save retains draft and stored data; unsaved drafts are lost on refresh.
- Storage remains browser/profile/page-specific. No identity, sync, backend, or real data.
- Protected gates: new scope, real-data changes, accounts/backend/sync/hosting, credentials/communications/spending/publication/deployment/forge actions, or additional agents. None performed.

## Last verified results

- Resume verification on 2026-10-02: checkpoint, active packet, evidence, workspace, and actual source agree. Both syntax checks and all 33 simulated behavior tests passed again; no app code changed. Prior static and M3 baseline results below remain dated 2026-10-01.
- `node --check app.js` and `node --check tests/app.test.cjs`: passed.
- `node tests/app.test.cjs`: 33 passed, 0 failed. Actual code driven by simulated DOM/storage/input-validity and controlled calendar clock.
- Coverage: retained M1–M3 regressions; legacy defaults without load writes; priority/date add/edit/Cancel/clear/reload; invalid/leap/year boundaries; overdue/completed/today/next-day behavior; failed save/draft retry; invalid saved fields preserved.
- Static checks: unique HTML IDs, matching references, labeled priority/date controls, local assets, no external URLs/network/innerHTML/storage-wide clear.
- `node docs/milestones/m3/baseline/tests/app.test.cjs`: preserved M3 source passes 25 tests.
- Native M4 browser/date picker/storage readback, keyboard/accessibility, narrow layout, and console: NOT VERIFIED. Browser policy previously rejects file:// and prohibits workarounds; no server/alternate access added.
- M3 approval is owner acceptance, not detailed browser-test evidence; it does not verify M4. No M4 screenshots.
- Evidence: [docs/milestones/m4/evidence/verification.md](docs/milestones/m4/evidence/verification.md).

## Documentation organization, 2026-10-02

- Owner-authorized documentation refactor complete. Milestone records and existing snapshots are grouped under `docs/milestones/mN/`; [milestone index](docs/milestones/README.md) owns their listing. This state and the checkpoint remain canonical root records.
- All 31 original files are accounted for. All 16 app/source/test files retain their original SHA-256 fingerprints; current app and tests were not moved. Only documentation references/context were edited.
- Current app syntax and 33 simulated tests passed after relocation. Relocated M1/M2/M3 snapshot commands passed 6/17/25 tests. Local links, documented command paths, directory preservation, and root app assets were checked.
- Details and file mapping: [organization evidence](docs/documentation-organization.md). No deletion, push, publication, browser-data mutation, new feature, or additional agent. M4's native-browser acceptance remains unverified.

## Exact next action

Resumed from [checkpoint.md](checkpoint.md) on 2026-10-02 at the project owner's request. Reconciliation and targeted checks are complete. Next, the project owner runs/reports the sample-only M4 native-browser checks in [docs/milestones/m4/evidence/verification.md](docs/milestones/m4/evidence/verification.md), including browser/version and any failures. For a browser-local date of 2026-10-02, use October 1 for yesterday, October 2 for today, and October 3 for tomorrow. M4 acceptance remains pending those results; no new milestone is approved. No automated continuation/reminder is scheduled.

## Recovery and navigation

- Resume from this state, M4 packet, actual source/tests, and latest owner message; preserve M1–M3 history.
- Session continuity: [checkpoint.md](checkpoint.md). Implementation/check results remain intact; the stop does not imply native browser acceptance or new scope authorization.
- Recovery source: `docs/milestones/m3/baseline/`. Older code lacks new-field validation; do not automatically restore source, reset browser data, overwrite tasks/categories, or move the page.
- Native node --test previously hit spawn EPERM; run node tests/app.test.cjs without runner subprocesses.
- Run: [index.html](index.html). Learn: [README.md](README.md). Source: [app.js](app.js).
- No ExecPlan/ADR needed for this bounded milestone. No global manual/config/memory edits.

## Git publication setup, 2026-10-02

- The owner authorized review and public upload to `Plevoire/Task-Tracer` in a separate setup chat. This permission covers this reviewed upload, not automatic future pushes, releases, or deployment.
- Private local history is retained separately. Public history begins with a sanitized snapshot authored by Plevoire using the supplied GitHub no-reply email.
- Public snapshot review: personal first-name references and workstation paths were replaced in documentation. A limited credential-pattern scan found no matches. Browser localStorage task data is not stored in this repository.
- Current app syntax and 33 simulated tests were verified during Git setup. Native M4 acceptance remains pending; publication does not establish app acceptance.
- Upload is pending at the time this record is committed; successful remote readback will be reported separately.

## Public snapshot boundaries

This is a sanitized publication copy. Earlier private local commits are not ancestors of public history. Historical packets remain records of their original task boundaries. Resolve workspace locations from the actual checkout, not from redacted paths. App code and tests are unchanged; native M4 acceptance remains pending.
