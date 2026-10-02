# Task Tracker

Historical M1 snapshot README. On 2026-10-02, documentation links were repaired after relocation; source and tests were not changed. Use the [current app](../../../../index.html) for sample tasks. Instructions below describe the historical snapshot; local-check commands run from this baseline folder.

Local practice project using plain HTML, CSS, and JavaScript. Use invented sample tasks only.

## Run

Double-click `index.html` and open it in a modern browser such as Edge or Chrome. Keep using the same browser/profile and file location for your saved tasks. No install, backend server, or internet connection is needed.

Add a title with the button or Enter. Check/uncheck to change completion. Delete removes that sample task. Refresh to check persistence.

The app uses browser localStorage under `task-tracker-v1`. Clearing browser data can erase tasks. Private browsing and browser settings can limit storage. Direct-file storage behavior varies between browsers; check [verification evidence](../evidence/verification.md) for what was actually tested.

## Understand the code

- `index.html`: HTML gives the page its structure, including the form and list. `defer` runs the script after HTML is ready.
- `styles.css`: CSS controls appearance. A media query changes the layout on narrow screens.
- `app.js`: JavaScript handles user actions. `tasks` is an array, an ordered list. Each task is an object with named values: `id`, `title`, `completed`.
- An event listener runs code when something happens, such as submitting the form or changing a checkbox.
- `renderTasks()` builds the visible list from the array. `textContent` displays titles as text, including titles that look like HTML.
- `JSON.stringify()` turns tasks into text for saving. `JSON.parse()` turns saved text back into data.
- `saveTasks()` saves before changing the displayed list. A failed save leaves the last successful list intact.

Current scope and next action are in [state.md](../../../../state.md). Acceptance criteria are in [M1 Run Packet](../run-packet.md).

## Local checks

If Node.js is installed, run these commands from this folder:

```powershell
node --check app.js
node tests/app.test.cjs
```

The tests simulate page elements and browser storage. They check logic and failure handling; they do not replace opening the page in a real browser.
