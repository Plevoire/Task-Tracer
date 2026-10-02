# M2 verification evidence

Documentation paths updated on 2026-10-02. Original dates, approvals, results, and limitations are preserved. Plain paths and recorded commands are relative to the project root; baseline commands now use relocated destinations. Markdown links are relative to this document.

- Date: 2026-10-01, Asia/Manila. Packet: TT-M2-001.
- Authorization: the project owner approved M2 in this chat. One execution owner/writer; no agents added.
- Implemented: title/category editing with Save/Cancel, four fixed categories, combined status/category filters, visible-task count, legacy category defaults, ID-based focus restoration.
- Preserved: add/delete/complete/incomplete, global completion count, sample-only local file launch, storage key `task-tracker-v1`.

## Actual deterministic results

| Command/check | Result |
| --- | --- |
| `node --check app.js` | Exit 0 |
| `node --check tests/app.test.cjs` | Exit 0 |
| `node tests/app.test.cjs` | Exit 0; 17 passed, 0 failed |
| `node docs/milestones/m1/baseline/tests/app.test.cjs` | Exit 0; preserved M1 source passes its original 6 tests |
| Read-only HTML/source check | All static JavaScript element references exist in HTML; app.js/styles.css exist; no external URLs, fetch/XMLHttpRequest calls, innerHTML assignments, or storage-wide clear |

The tests execute actual app.js in a simulated DOM/localStorage. They do not execute browser rendering or native storage.

## Mapped feature coverage

| Feature | Driven action and observable proof |
| --- | --- |
| M1 behavior | Add, whitespace rejection, literal title display, toggles, deletion, reload, empty list, unrelated key preserved |
| Legacy compatibility | Load a task without category; display Uncategorized; original saved JSON unchanged on load; successful later save retains ID/title/completion |
| Editing | Edit one duplicate-title task; Save changes only its title/category, preserves ID/completion, and survives simulated reload |
| Cancel/validation | Blank title and invalid category rejected; Cancel leaves original JSON unchanged and restores Edit focus |
| Failed edit save | Simulated write denial retains editor/draft, original data, and paused controls; retry saves successfully |
| Filters | All 15 status/category combinations show expected task IDs and do not write storage |
| Hidden tasks | Edit/delete/add/complete under filters preserve full stored collection; hidden new tasks become visible after simulated reload |
| Focus | Stable-ID focus despite different full-array/visible positions; disappearing rows move to neighbor or title input |
| Empty view | Empty collection and no matches produce distinct messages |
| Corrupt storage | Malformed JSON, invalid categories, invalid core fields, duplicate IDs/read denial preserve data and disable mutation |
| Failed filtered mutation | Failed completion restores checkbox; failed deletion preserves visible/hidden tasks and stored JSON |

## Data and interaction decisions

- Only a missing category defaults to Uncategorized. Present but invalid category is rejected to avoid silently rewriting stored information.
- Normalization happens in memory without writes on load; the next successful mutation saves the full collection including categories.
- Filters reset on each script load and are not persisted.
- A single task may be edited. Other add/task/filter controls pause until Save/Cancel, protecting the current draft.
- Unsaved editing drafts are not persistent and will be lost if the page is refreshed. README documents this.
- The basic completion counter uses the full task collection; the separate visible count uses the filtered collection.
- Actions use task IDs; visible neighbor positions are used only for fallback focus.

## Actual browser boundary

Previous attempts in this chat established that the available browser tool rejects file:// and prohibits indirect workarounds. No blocked action was retried; no server, alternate browser route, hosting, or policy changes were introduced.

M2 native-browser flow, native localStorage readback, native focus/keyboard behavior, accessibility interaction, narrow-screen appearance, and browser console remain NOT VERIFIED. Semantic labels, checkbox states, status messages, focus calls, and responsive rules were inspected in source; that is not runtime accessibility proof.

M1 owner-reported browser acceptance does not verify these new M2 features. No M2 browser screenshots were captured.

## Result before owner report

- Implementation and simulated acceptance: complete, 17 tests pass.
- Result state: SANDBOX_BOUNDARY_BLOCKED at actual M2 browser acceptance. DEMO_READY not yet claimed for M2.
- Protected actions performed: none. No external effects, new credentials/dependencies/frameworks, Git/PR/CI actions, deployment, or real data.
- Recovery: M1 source and original tests retained in `docs/milestones/m1/baseline/`. Do not clear browser storage or move the active page as an automatic rollback.

the project owner refreshes the existing index.html and tests invented samples:

1. Confirm an existing M1 task displays Uncategorized. Add School and Home sample tasks.
2. Edit one title/category, Save, refresh, and verify the change. Try a blank edit, then Cancel and verify no change.
3. Combine Incomplete + School. Complete a visible task; confirm it disappears and keyboard focus stays usable. Switch to Completed + School to find it again.
4. Under School, edit a task to Home; confirm it leaves the view and remains under Home. Delete a School sample while filtered; Home tasks must remain.
5. Pick a filter with no matches and compare its message with a genuinely empty list. Refresh and confirm filters reset to All, with all task data retained.
6. Use keyboard Tab/Enter/Space and a narrow browser window. Report browser/version, results, and any error before M2 is marked DEMO_READY.

## Owner-reported acceptance update

On 2026-10-01, the project owner reported in this chat:

> with the new features it is working naman

Current M2 result: DEMO_READY based on 17 passing simulated tests and owner-reported manual runtime acceptance. Browser/version, screenshots, native storage JSON, and detailed keyboard/narrow-layout checks were not supplied. Codex automated native-browser verification remains unavailable; the earlier blocked entry is historical.

Next action: owner approval or revision of the proposed M3 custom-category creation scope. No M3 app code has been changed or authorized yet.
