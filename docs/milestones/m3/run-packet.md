# M3 Run Packet

Documentation paths updated on 2026-10-02. Original dates, approvals, results, and limitations are preserved. Plain paths and recorded commands are relative to the project root; baseline commands now use relocated destinations. Markdown links are relative to this document.

- Identity: TT-M3-001. Created: 2026-10-01, Asia/Manila. Status: BLOCKED only at native-browser acceptance; implementation/checks complete.
- Owner: the project owner; execution owner/writer: Codex only. No additional agents, external model lanes, independent reviewers, or worktrees.
- Authority: the project owner explicitly approved the proposed custom-category M3 scope in this chat.
- Mode: STANDARD. Shape: feature with local persistence compatibility. Method: smallest plain-JavaScript slice, deterministic behavior checks, runtime verification only when permitted.
- Workspace/write boundary: `<project-root>`. No Git repository, branch, or forge authority.
- Baseline: owner-accepted M2; 17 simulated tests. Preserve source/tests under `docs/milestones/m2/baseline/` and retain M1/M2 packets and evidence.
- Goal: users create their own categories and use them in Add/Edit/combined filters; unused categories persist.
- Scope: category-name input and Add category button; trim whitespace; reject blank/case-insensitive duplicate names; retain built-in categories and Uncategorized default. Keep single-category tasks and M2 edit behavior.
- Data: save tasks and categories in one JSON record under existing key `task-tracker-v1`. New format: `{ version: 1, tasks, categories }`, where version identifies the storage format, not milestone. Accept valid legacy M1/M2 arrays in memory with default categories; never write on load. Validate complete new records and task/category references before mutation. Invalid/unsupported data remains untouched.
- Filter boundary: an empty select value means all categories; blank category names are rejected. A legitimate custom category named "all" must remain independently filterable.
- Allowed: in-scope app/tests/docs/evidence/state, local sample-only tests, baseline preservation. Credentials/external service access: none.
- Excluded: rename/delete categories, tags, other roadmap features, backend/accounts/sync/hosting/notifications, real personal data, new dependencies/frameworks, global config/manual/memory edits, Git/PR/CI/publishing, additional agents.
- Verification: app/test syntax, M1/M2 regressions, custom creation/validation, unused-category reload, Add/Edit/filter use, case-insensitive duplicates, filtered task preservation, failed saves, legacy conversion, malformed/unsupported records. Distinguish simulated results from actual browser evidence.
- Evidence: `docs/milestones/m3/evidence/verification.md`. Available browser previously rejected file:// and prohibited workarounds; do not retry or bypass it. No server or alternate route authorized.
- Acceptance: create BSIT, assign/edit/filter tasks, refresh retains category and data; blank/duplicate names reject; unused categories survive; legacy tasks preserve identity/title/completion; failed saves leave data/UI unchanged and retain input for retry; unrelated storage stays untouched; existing M2 behavior passes.
- Budget: six repairs, at most two same-hypothesis failures without new evidence; no review/fan-out. Stop for material scope/recovery conflicts, protected actions, or exhausted budget.
- Recovery: M2 source copies only. An older M2 loader cannot read the new envelope; do not automatically restore source or overwrite new saved data. Stored categories/tasks must be preserved during any separately approved rollback.
- Expected result: DEMO_READY only with supported runtime evidence; otherwise SANDBOX_BOUNDARY_BLOCKED at native-browser acceptance, separately reporting completed implementation/checks.

## Execution result

Implemented the approved scope. App/test syntax passed; 25 simulated behavior tests passed. HTML/source reference checks passed. Preserved M2 baseline passed 17 tests. App repairs: 0. No protected actions performed.

Result: SANDBOX_BOUNDARY_BLOCKED at actual M3 browser acceptance; no workarounds attempted. Exact next action: the project owner performs the sample-only native-browser check in `docs/milestones/m3/evidence/verification.md` and reports browser/results. Do not transfer M2 acceptance to M3.

Continuation: the project owner accepted M3 and authorized M4 on 2026-10-01. Native M3 test details were not supplied. Active work proceeds under docs/milestones/m4/run-packet.md; preserve the verification distinction above.
