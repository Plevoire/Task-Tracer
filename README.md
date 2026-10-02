# Task Tracker

Local practice project using plain HTML, CSS, and JavaScript. Use invented sample tasks only.

## Run

Double-click `index.html` and open it in a modern browser such as Edge or Chrome. Keep using the same browser/profile and file location for your saved tasks. No install, backend server, or internet connection is needed.

Add a title with the button or Enter. Check/uncheck to change completion. Delete removes that sample task. Refresh to check persistence.

Choose a category and use Edit to change a task's title/category, then Save or Cancel. While an edit is open, other controls pause so you can finish the draft safely. A failed Save keeps the draft for retry or Cancel.

M3 lets you create custom categories. In "Create a category", enter a sample name such as BSIT and click Add category or press Enter. The name is trimmed, blank names and duplicates such as School/school are rejected, and the new category is selected for new tasks. It also appears in Edit and the category filter. Categories persist even without assigned tasks. Rename/delete categories are deferred.

M4 adds Low/Normal/High priority and an optional due date to Add and Edit. Existing tasks default to Normal with no due date. Both fields persist after saving. Clear the date in Edit and Save to remove a deadline. After adding a task, the date input clears; category and priority selections stay available for the next sample task.

Due dates contain a calendar date, not a time. An incomplete task dated before the browser's local today displays "Overdue" text. Due today, future, completed, and undated tasks are not overdue. Dates must be valid calendar dates in years 0001–9999. Labels recalculate when the list renders or the page refreshes; there are no background reminders, timers, or notifications.

Combine Status and Category filter to narrow the visible list. Filters reset to All after refresh. They do not delete tasks. The completion counter always counts the full list; the separate "tasks shown" message counts the current view. A newly added task may be hidden by the current filter.

Legacy tasks without a category display as Uncategorized. Loading does not overwrite stored JSON. The next successful task/category change saves a record containing `{ version: 1, tasks, categories }`. This keeps tasks and category names together in one save. The version describes the storage format, not the milestone. Invalid data, unsupported versions, or task references to missing categories block changes and preserve the original data.

The app uses browser localStorage under `task-tracker-v1`. Clearing browser data can erase tasks. Private browsing and browser settings can limit storage. Direct-file storage behavior varies between browsers; check [verification evidence](docs/milestones/m1/evidence/verification.md) for what was actually tested.

## Understand the code

- `index.html`: HTML gives the page its structure, including the form and list. `defer` runs the script after HTML is ready.
- `styles.css`: CSS controls appearance. A media query changes the layout on narrow screens.
- `app.js`: JavaScript handles user actions. `tasks` is an array, an ordered list. Each task is an object with named values: `id`, `title`, `completed`, `category`, `priority`, `dueDate`. The separate `categories` array stores available category names.
- An event listener runs code when something happens, such as submitting the form or changing a checkbox.
- `renderTasks()` builds the visible list from the array. `textContent` displays titles as text, including titles that look like HTML.
- `JSON.stringify()` turns the data record into text for saving. `JSON.parse()` turns saved text back into data.
- `loadData()` validates saved records and accepts old task arrays in memory without writing on load.
- `saveData()` saves the full task/category record before updating memory or the displayed list. A failed save leaves the last successful data intact.
- `fillCategories()` builds dropdown choices from the category list, preserving existing selections.
- `visibleTasks()` derives a filtered list for display. The full `tasks` array is still saved along with categories.
- `restoreFocus()` finds a task row by its unique ID. When a task leaves the view, focus moves to a neighbor or the add input.
- `editingId` records which task is being edited. The draft stays in the edit form until Save or Cancel; it is not saved on refresh.
- `validDueDate()` rejects impossible calendar dates, including February 29 in a non-leap year. It avoids timezone conversion and automatic rollover into another month.
- `localToday()` uses the browser's local date. Valid YYYY-MM-DD strings can be compared directly because their year, month, and day are in fixed order.
- `validateTaskForm()` applies the same rules to Add and Edit and focuses the first invalid field.

Current scope and next action are in [state.md](state.md). Current acceptance criteria: [M4 Run Packet](docs/milestones/m4/run-packet.md). M4 evidence/manual check: [M4 verification](docs/milestones/m4/evidence/verification.md).

See the [milestone index](docs/milestones/README.md) for M1–M4 packets and evidence. Existing M1–M3 source copies are retained in each milestone's `baseline/` folder as recovery references. M1/M2 code cannot read newer saved records; M3 code does not validate priority/due date fields. Do not restore older code over the current app or reset browser data without a recovery plan. Use the current page for sample testing.

## Local checks

If Node.js is installed, run these commands from this folder:

```powershell
node --check app.js
node tests/app.test.cjs
```

The tests simulate page elements and browser storage. They check logic and failure handling; they do not replace opening the page in a real browser.
