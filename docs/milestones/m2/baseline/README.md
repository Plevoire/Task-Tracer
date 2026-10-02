# Task Tracker

Historical M2 snapshot README. On 2026-10-02, documentation links were repaired after relocation; source and tests were not changed. Use the [current app](../../../../index.html) for sample tasks. Instructions below describe the historical snapshot; local-check commands run from this baseline folder.

Local practice project using plain HTML, CSS, and JavaScript. Use invented sample tasks only.

## Run

Double-click `index.html` and open it in a modern browser such as Edge or Chrome. Keep using the same browser/profile and file location for your saved tasks. No install, backend server, or internet connection is needed.

Add a title with the button or Enter. Check/uncheck to change completion. Delete removes that sample task. Refresh to check persistence.

M2 adds a category dropdown and Edit buttons. Choose Uncategorized, School, Home, or Personal. Edit lets you change the title/category, then Save or Cancel. While an edit is open, other controls pause so you can finish the draft safely. A failed Save keeps the draft for retry or Cancel.

Combine Status and Category filter to narrow the visible list. Filters reset to All after refresh. They do not delete tasks. The completion counter always counts the full list; the separate "tasks shown" message counts the current view. A newly added task may be hidden by the current filter.

Legacy tasks without a category display as Uncategorized. Loading does not overwrite their stored JSON. The next successful task change saves categories with the full collection. An invalid stored category blocks changes and preserves the original data.

The app uses browser localStorage under `task-tracker-v1`. Clearing browser data can erase tasks. Private browsing and browser settings can limit storage. Direct-file storage behavior varies between browsers; check [verification evidence](../../m1/evidence/verification.md) for what was actually tested.

## Understand the code

- `index.html`: HTML gives the page its structure, including the form and list. `defer` runs the script after HTML is ready.
- `styles.css`: CSS controls appearance. A media query changes the layout on narrow screens.
- `app.js`: JavaScript handles user actions. `tasks` is an array, an ordered list. Each task is an object with named values: `id`, `title`, `completed`.
- An event listener runs code when something happens, such as submitting the form or changing a checkbox.
- `renderTasks()` builds the visible list from the array. `textContent` displays titles as text, including titles that look like HTML.
- `JSON.stringify()` turns tasks into text for saving. `JSON.parse()` turns saved text back into data.
- `saveTasks()` saves before changing the displayed list. A failed save leaves the last successful list intact.
- `visibleTasks()` derives a filtered list for display. The original `tasks` array is still the only collection saved.
- `restoreFocus()` finds a task row by its unique ID. When a task leaves the view, focus moves to a neighbor or the add input.
- `editingId` records which task is being edited. The draft stays in the edit form until Save or Cancel; it is not saved on refresh.

Current scope and next action are in [state.md](../../../../state.md). Acceptance criteria are in [M1 Run Packet](../../m1/run-packet.md).

Current M2 criteria: [M2 Run Packet](../run-packet.md). M2 evidence and manual check: [../evidence/verification.md](../evidence/verification.md). M1 source copies are retained in `docs/milestones/m1/baseline/`; they are recovery references, not a second app to use with your saved data.

## Local checks

If Node.js is installed, run these commands from this folder:

```powershell
node --check app.js
node tests/app.test.cjs
```

The tests simulate page elements and browser storage. They check logic and failure handling; they do not replace opening the page in a real browser.
