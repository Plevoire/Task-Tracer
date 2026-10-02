# M4 verification evidence

Documentation paths updated on 2026-10-02. Original dates, approvals, results, and limitations are preserved. Plain paths and recorded commands are relative to the project root; baseline commands now use relocated destinations. Markdown links are relative to this document.

- Date: 2026-10-01, Asia/Manila. Packet: TT-M4-001.
- Authorization: the project owner approved M4 and accepted M3. The M3 approval does not supply native-browser test details.
- One execution owner/writer; no agents, external model lanes, dependencies, or framework changes.
- Implemented: Low/Normal/High priority; optional due date in Add/Edit; visible priority/date/Overdue text; compatible defaults and validation.
- Preserved: custom categories, Add/Edit/Cancel, completion, deletion, filters, counts, task IDs, full-record saving, storage failure handling.

## Executed checks

| Command/check | Actual result |
| --- | --- |
| `node --check app.js` | Exit 0 |
| `node --check tests/app.test.cjs` | Exit 0 |
| `node tests/app.test.cjs` | Exit 0; 33 passed, 0 failed |
| `node docs/milestones/m3/baseline/tests/app.test.cjs` | Exit 0; M3 baseline passes its original 25 tests |
| Static HTML/source check | Unique IDs, matching JavaScript references, labeled priority/date controls, local assets; no external URLs/network calls, innerHTML assignments, or storage-wide clear |

Tests execute actual app.js using simulated DOM, storage, input-validity flags, and a controlled local-calendar clock. Default test date is 2026-10-01. No browser was controlled and no native storage was read back.

## Mapped behavior evidence

- M1–M3: 25 retained behavior tests pass, including custom categories, filters, focus, legacy conversion, and failure handling.
- Legacy defaults: old arrays and M3 records load with Normal/blank-date in memory; original JSON unchanged on load; subsequent save preserves IDs/titles/completion/categories.
- Add: every priority, optional date, and custom category persists through simulated reload; due input clears after successful Add.
- Edit: save priority/date while preserving task identity/completion; Cancel leaves saved JSON unchanged; clear date and reload successfully.
- Calendar validation: rejects February 29 in 2026/1900, April 31, invalid month/day/year, non-padded strings, and non-date input. Accepts leap dates in 2000/2024, years 0001/9999, and blank date.
- Overdue: incomplete yesterday shows text; today/tomorrow/undated do not. Complete hides Overdue, uncomplete restores it. Controlled next-day reload correctly changes today's previous label to Overdue.
- Failure: denied writes retain Add input/priority/date and Edit draft; original data unchanged; retry saves successfully.
- Corrupt saved fields: invalid priorities, null/non-string dates, impossible dates, and datetime strings are preserved and mutations disabled in both array and record formats.
- Simulated browser-input validity: invalid date validity flag rejects an empty sanitized value; correcting an edit error allows Save and directs focus to the offending date field.

## Date/data contract

- Storage remains `task-tracker-v1`, record version 1 with tasks/categories together.
- New task fields: `priority` string Low/Normal/High; `dueDate` empty or valid YYYY-MM-DD date in years 0001–9999.
- Missing fields receive defaults in memory; present invalid fields are not silently repaired or overwritten.
- Date-only comparison uses browser-local year/month/day, not UTC parsing. Fixed-width valid date strings compare in calendar order.
- Overdue is derived, never saved: incomplete plus nonempty date before local today. Due today is not overdue.
- Labels update on list rendering or refresh. No automatic midnight timer, notification, or background reminder is promised.
- Priority/category selections remain after Add; date/title clear. Edit behavior still pauses other controls and retains failed-save drafts.

## Native-browser boundary and result

- Native M4 page interaction, date picker/invalid typing, storage JSON, keyboard/accessibility, narrow-screen appearance, and console: NOT VERIFIED.
- Previously observed browser policy rejects file:// and prohibits workarounds. No retry/server/alternate route/policy change introduced.
- M3 owner acceptance does not verify M4. No M4 screenshot captured.
- Implementation and simulated acceptance complete. Result: SANDBOX_BOUNDARY_BLOCKED only at native M4 acceptance; DEMO_READY not yet claimed.
- Protected actions performed: none. No real data, publishing/deployment, credentials, external messaging, spending, Git/PR/CI, or additional agents.
- Recovery: M3 source/tests retained in `docs/milestones/m3/baseline/`. No automatic source rollback or browser-data reset. App repairs: 0.

## Exact next action

the project owner refreshes the existing index.html and tests invented samples:

1. Add a High-priority task due yesterday. Confirm it displays Overdue and keeps priority/date after refresh.
2. Add a task due today, a future date, and no date. They should not show Overdue.
3. Complete yesterday's task, then uncomplete it. Overdue should disappear and return.
4. Edit priority/date, Save, and refresh. Clear a due date and Save; try Cancel on another change.
5. Confirm custom categories, combined filters, and old tasks remain usable. Check keyboard/narrow layout and report browser/version and results.

## Resume verification, 2026-10-02

- Reconciled checkpoint, canonical state, active packet, prior evidence, workspace identity, and actual source. No conflict or app-code change.
- `node --check app.js` and `node --check tests/app.test.cjs`: exit 0.
- `node tests/app.test.cjs`: exit 0; 33 passed, 0 failed. Simulated DOM/storage/input validity and controlled test clock; the default test clock remains October 1, with a next-day scenario covered by the suite.
- October 1 static checks and M3 baseline results were not rerun. Native-browser limitations remain unchanged; no browser attempt, storage readback, screenshot, or workaround performed.
- Next action remains the five sample checks above. If the browser-local day is October 2, use October 1 as yesterday and October 3 as tomorrow. Await owner-reported browser/version/results before recording M4 runtime acceptance.
