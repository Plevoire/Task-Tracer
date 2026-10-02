# Task Tracker

Historical M3 snapshot README. On 2026-10-02, documentation links were repaired after relocation; source and tests were not changed. Use the [current app](../../../../index.html) for sample tasks. Instructions below describe the historical snapshot; local-check commands run from this baseline folder.

Local practice project using plain HTML, CSS, and JavaScript. Use invented sample tasks only.

## Run

Double-click `index.html` and open it in a modern browser such as Edge or Chrome. Keep using the same browser/profile and file location for your saved tasks. No install, backend server, or internet connection is needed.

Add a title with the button or Enter. Check/uncheck to change completion. Delete removes that sample task. Refresh to check persistence.

Choose a category and use Edit to change a task's title/category, then Save or Cancel. While an edit is open, other controls pause so you can finish the draft safely. A failed Save keeps the draft for retry or Cancel.

M3 lets you create custom categories. In "Create a category", enter a sample name such as BSIT and click Add category or press Enter. The name is trimmed, blank names and duplicates such as School/school are rejected, and the new category is selected for new tasks. It also appears in Edit and the category filter. Categories persist even without assigned tasks. Rename/delete categories are deferred.

Combine Status and Category filter to narrow the visible list. Filters reset to All after refresh. They do not delete tasks. The completion counter always counts the full list; the separate "tasks shown" message counts the current view. A newly added task may be hidden by the current filter.

Legacy tasks without a category display as Uncategorized. Loading does not overwrite stored JSON. The next successful task/category change saves a record containing `{ version: 1, tasks, categories }`. This keeps tasks and category names together in one save. The version describes the storage format, not the milestone. Invalid data, unsupported versions, or task references to missing categories block changes and preserve the original data.

The app uses browser localStorage under `task-tracker-v1`. Clearing browser data can erase tasks. Private browsing and browser settings can limit storage. Direct-file storage behavior varies between browsers; check [verification evidence](../../m1/evidence/verification.md) for what was actually tested.

## Understand the code

- `index.html`: HTML gives the page its structure, including the form and list. `defer` runs the script after HTML is ready.
- `styles.css`: CSS controls appearance. A media query changes the layout on narrow screens.
- `app.js`: JavaScript handles user actions. `tasks` is an array, an ordered list. Each task is an object with named values: `id`, `title`, `completed`, `category`. The separate `categories` array stores available category names.
- An event listener runs code when something happens, such as submitting the form or changing a checkbox.
- `renderTasks()` builds the visible list from the array. `textContent` displays titles as text, including titles that look like HTML.
- `JSON.stringify()` turns the data record into text for saving. `JSON.parse()` turns saved text back into data.
- `loadData()` validates saved records and accepts old task arrays in memory without writing on load.
- `saveData()` saves the full task/category record before updating memory or the displayed list. A failed save leaves the last successful data intact.
- `fillCategories()` builds dropdown choices from the category list, preserving existing selections.
- `visibleTasks()` derives a filtered list for display. The full `tasks` array is still saved along with categories.
- `restoreFocus()` finds a task row by its unique ID. When a task leaves the view, focus moves to a neighbor or the add input.
- `editingId` records which task is being edited. The draft stays in the edit form until Save or Cancel; it is not saved on refresh.

Current scope and next action are in [state.md](../../../../state.md). Current acceptance criteria: [M3 Run Packet](../run-packet.md). M3 evidence/manual check: [../evidence/verification.md](../evidence/verification.md).

Historical M2 criteria/evidence: [M2 Run Packet](../../m2/run-packet.md), [../../m2/evidence/verification.md](../../m2/evidence/verification.md). M1/M2 source copies are retained in `docs/milestones/` as recovery references. Older code cannot read the new saved-record format; do not restore it over the current app or reset browser data without a recovery plan. Use the current page for sample testing.

## Local checks

If Node.js is installed, run these commands from this folder:

```powershell
node --check app.js
node tests/app.test.cjs
```

The tests simulate page elements and browser storage. They check logic and failure handling; they do not replace opening the page in a real browser.
