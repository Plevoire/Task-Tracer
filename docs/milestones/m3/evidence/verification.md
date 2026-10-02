# M3 verification evidence

Documentation paths updated on 2026-10-02. Original dates, approvals, results, and limitations are preserved. Plain paths and recorded commands are relative to the project root; baseline commands now use relocated destinations. Markdown links are relative to this document.

- Date: 2026-10-01, Asia/Manila. Packet: TT-M3-001. Owner explicitly approved custom-category creation/persistence.
- One execution owner/writer. No agents or external model lanes added.
- Implemented: category creation, blank/case-insensitive duplicate validation, dynamic Add/Edit/filter options, unused-category persistence, compatible loading of M1/M2 data.
- Deferred: category rename/delete, tags, all other roadmap features.

## Executed checks

| Check | Actual result |
| --- | --- |
| `node --check app.js` | Exit 0 |
| `node --check tests/app.test.cjs` | Exit 0 |
| `node tests/app.test.cjs` | Exit 0; 25 passed, 0 failed |
| `node docs/milestones/m2/baseline/tests/app.test.cjs` | Exit 0; preserved M2 source passes its 17 tests |
| Static HTML/source check | Unique static IDs; all JavaScript element references present; local assets present; no external URLs/network calls/innerHTML/storage-wide clear; one app-specific storage-write site |

Tests execute actual app.js against simulated DOM/localStorage. These are not native-browser results.

## Feature map and evidence

- M1/M2 regressions: original 17 behavior tests retained, with storage readback adapted to the new record and the all-category filter's empty value.
- Create category: submit `  BSIT  `; assert trimmed name, cleared input, focused input, new selection, and stored record.
- Unused category: create with no tasks, reopen app using saved data; assert no write on load and category available in Add/filter. Delete its sample task; category still survives simulated reload.
- Add/Edit/filter: use custom BSIT/Fitness categories, reassign under active filter, complete task, reopen and filter; assert correct task identity/category/completion and hidden tasks retained.
- Duplicate validation: empty/whitespace names and case-insensitive duplicates including built-ins produce errors and no storage writes.
- Preserve selection/data: adding category under filters leaves current filters and stored task collection unchanged; unrelated storage key preserved.
- Failed category save: simulate denied write from legacy data; original JSON and dropdown choices unchanged, input retained; retry saves the legacy tasks and new category together.
- `all` name: custom category literally named `all` filters independently; empty filter value represents all categories without collision.
- Literal text: HTML-looking category appears as plain option text.
- Malformed/new-format data: unsupported version, invalid/missing/duplicate/blank category names, missing Uncategorized, bad task list, duplicate IDs, or missing category reference preserve original JSON and disable both task/category mutation.
- Edit pause: category creation disabled during task editing; Cancel restores it.

## Persistence decisions and recovery

- Same key: `task-tracker-v1`. New format: `{ version: 1, tasks, categories }`. One setItem saves both collections before changing memory/UI.
- Valid old M1/M2 arrays are loaded in memory with original default categories. Missing task category defaults to Uncategorized. Loading never writes; next successful mutation writes the new format.
- New records must have a known version, valid unique category names, Uncategorized, valid tasks/unique IDs, and matching task category references. Corrupt/unsupported data is not overwritten.
- Filters reset on refresh; category names persist. Rename/delete categories are absent.
- Preserved M2 source/tests: `docs/milestones/m2/baseline/`. Its old loader cannot read new M3 records; rollback is not automatic and must preserve new tasks/categories. No browser data was cleared or mutated by these checks.

## Truth boundaries and result

- Actual M3 browser interactions, native storage JSON readback, keyboard/accessibility, mobile appearance, and console: NOT VERIFIED.
- Previous file:// browser-policy rejection prohibits indirect workarounds. No retry, alternate browser route, server, policy change, or hosting was introduced.
- M2 owner-reported acceptance does not verify M3. No M3 screenshots available.
- Result: SANDBOX_BOUNDARY_BLOCKED only at native M3 browser acceptance; implementation/simulated checks complete. DEMO_READY is not yet claimed for M3.
- No deployment, publishing, real data, external communication, credentials, dependencies/frameworks, or forge actions. App repair attempts: 0.

## Exact next action

the project owner refreshes the existing index.html and uses invented samples:

1. Create BSIT, assign it to a sample task, and refresh. Confirm category and task remain and old tasks are still present.
2. Create Errands without assigning tasks, refresh, and confirm it remains in the dropdowns.
3. Try blank names, `bsit`, and `school`. Expect errors and no extra categories.
4. Edit a sample task to BSIT, then use Incomplete/Completed plus BSIT filters and complete/uncomplete it.
5. Use keyboard Enter/Tab and a narrow browser window. Report browser/version and results before M3 is marked DEMO_READY.

## Owner acceptance

On 2026-10-01, the project owner stated "approved ko na yung m3 and M4". Record M3 as owner-accepted and M4 as authorized. No browser/version, screenshots, storage readback, or specific native M3 test results were supplied; do not relabel approval as Codex-observed runtime verification.
