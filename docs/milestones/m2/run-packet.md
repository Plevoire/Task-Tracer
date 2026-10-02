# M2 Run Packet

Documentation paths updated on 2026-10-02. Original dates, approvals, results, and limitations are preserved. Plain paths and recorded commands are relative to the project root; baseline commands now use relocated destinations. Markdown links are relative to this document.

- Identity: TT-M2-001. Owner: the project owner. Execution owner/writer: Codex, one only; no subagents, reviews, or external model lanes.
- Authority: the project owner approved the proposed M2 scope on 2026-10-01. Status: DEMO_READY based on implementation/checks and owner-reported manual acceptance on 2026-10-01.
- Mode: STANDARD. Shape: feature. Method: small plain-JavaScript changes, targeted tests, runtime verification when permitted.
- Workspace: `<project-root>`. No Git repository/branches/worktrees; no forge authority.
- Baseline: M1 source, six passing simulated tests, owner-reported browser acceptance. Preserve M1 packet/evidence; baseline source copies under `docs/milestones/m1/baseline/` for recovery.
- Goal: edit titles/categories and find tasks with combined status/category filters.
- Categories: Uncategorized, School, Home, Personal; one per task. Editing uses Save/Cancel; only one edit at a time. Other task/add/filter controls pause during an edit to protect the draft.
- Filters: All/Incomplete/Completed and all categories/one category. Temporary page state; reset on refresh. They never replace the saved full list.
- Compatibility: same storage key `task-tracker-v1`. Missing legacy category defaults to Uncategorized in memory. Invalid present category or corrupt data blocks mutation without overwriting. No automatic write on load.
- Allowed: local in-scope app, tests, docs/evidence/state changes; sample-only simulations; relevant local checks.
- Excluded: tags/custom categories, priorities/dates/search/sorting/clear completed, accounts/backend/sync/hosting/notifications, real data, credentials, publishing, Git/PR/CI actions, global config or manual edits.
- Verification: app/test syntax; existing regressions plus editing, combinations, legacy normalization, full-list preservation, focus under filters, and storage failures. Browser tool previously rejects file:// and prohibits workarounds; do not retry blocked actions. Record actual browser acceptance as pending if unchanged.
- Evidence: `docs/milestones/m2/evidence/verification.md`. Expected result: DEMO_READY only with runtime evidence; otherwise SANDBOX_BOUNDARY_BLOCKED at actual browser acceptance, with implementation/checks separately reported.
- Budget: six repairs, max two unchanged-hypothesis failures; no independent review or topology expansion.
- Stop: protected actions, material scope changes, exhausted budget, recovery conflict. Recovery: retained M1 source only; never reset browser data or unrelated files.

## Acceptance criteria

1. Legacy tasks load as Uncategorized without losing identity/title/completion or writing on load.
2. Save updates only the selected task and persists; Cancel changes nothing; blank title rejects.
3. Categories persist on add/edit and refresh.
4. Combined filters show the correct subset without deleting hidden tasks; reset on refresh.
5. Task actions and focus use IDs. A disappearing row focuses a visible neighbor or title input.
6. Empty collection and empty filtered result have different messages.
7. Failed saves preserve stored/task state and editing drafts; invalid saved data remains untouched.
8. Existing add/delete/toggle/counter behavior passes; controls have labels and text states, keyboard focus, and narrow-layout rules.
9. Report simulated checks separately from actual browser, storage readback, keyboard, and visual evidence.

## Execution result

Implemented the approved scope; 17 simulated behavior tests and both syntax checks pass. HTML references/assets and absence of external dependencies reviewed. Preserved M1 source passes its original six tests.

Result: DEMO_READY based on 17 passing simulated tests and the project owner reporting the new features work on 2026-10-01. Automated browser verification remains unavailable; browser/version and detailed native checks were not supplied. No browser workaround attempted. See `docs/milestones/m2/evidence/verification.md` for exact evidence, limits, and manual sample-only steps.

Budget used: 0 app repairs; no additional agents or scope changes. No protected actions performed. Next action: the project owner approves or revises a separately proposed M3 scope for custom-category creation. No M3 implementation is authorized by this M2 packet.

