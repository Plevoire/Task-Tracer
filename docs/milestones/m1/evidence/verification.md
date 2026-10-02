# M1 verification evidence

Documentation paths updated on 2026-10-02. Original dates, approvals, results, and limitations are preserved. Plain paths and recorded commands are relative to the project root; baseline commands now use relocated destinations. Markdown links are relative to this document.

- Date: 2026-10-01, Asia/Manila.
- Packet: TT-M1-001. Scope confirmed by the project owner with `Confirm` in this chat.
- One execution owner and writer: Codex. No additional agents.
- Artifacts: `index.html`, `styles.css`, `app.js`, `README.md`, `tests/app.test.cjs`.
- Implementation is present. See the owner-reported acceptance update below for the current result; automated browser acceptance remains unverified.

## Deterministic checks

Executed from `<project-root>`:

| Check | Actual result |
| --- | --- |
| `node --check app.js` | Exit 0; syntax passed |
| `node --check tests/app.test.cjs` | Exit 0; syntax passed |
| `node tests/app.test.cjs` | Exit 0; 6 tests passed, 0 failed |
| `node --test tests/app.test.cjs` | Runner could not spawn a subprocess: `spawn EPERM`. Running the same test file directly above completed all six tests. |

Passing tests run the actual app.js in Node's isolated JavaScript context with simulated page elements and localStorage:

1. Add trims whitespace, rejects blank titles, clears input, and displays HTML-looking titles as literal text.
2. Complete/incomplete changes update the count and survive a fresh script load using saved JSON. Deletion also survives a fresh load.
3. Duplicate titles have distinct IDs; deletion affects one task; an empty array persists; another storage key remains unchanged.
4. Simulated quota/write failure preserves stored and displayed state, reverts the checkbox, retains unsaved input, and allows a successful retry.
5. Malformed JSON, invalid task structure, and duplicate IDs preserve original saved data and disable changes.
6. Simulated blocked storage reads show a load error and disable changes.

These tests do not execute browser layout, native keyboard behavior, or native storage. Their storage readbacks are simulated, not real browser readbacks.

## Source review

- App source contains no HTTP/HTTPS URLs, fetch, XMLHttpRequest, or external dependencies.
- Only the app-specific key `task-tracker-v1` is read/written. There is no storage clear or unrelated-key deletion.
- Titles use textContent, not innerHTML.
- Form submission handles Add and Enter through the same event listener. Actual native Enter behavior is unverified.
- CSS includes narrow-screen layout rules; controls have labels and focus outlines. Actual layout, keyboard navigation, and accessibility are unverified.

## Actual browser attempt

The available surface was Codex In-app Browser. Attempted to open:

`file:///<project-root>/index.html`

The tool rejected the action before loading the page:

> The browser URL policy blocks this action. The requested URL protocol is not allowed. Allowed protocols: http:, https:.

The rejection also prohibited alternate browser surfaces or indirect workarounds. No server was added, no workaround attempted, and no screenshot or actual browser storage readback was obtained.

## Acceptance boundary before owner report

- Implementation and simulated behavior checks: passed as described above.
- Actual add/button/Enter, completion, deletion, refresh, direct-file persistence, narrow layout, keyboard path, and browser console: NOT VERIFIED.
- Browser-specific storage-failure behavior: NOT VERIFIED; simulated error handling passed.
- Result state: SANDBOX_BOUNDARY_BLOCKED for actual browser verification. DEMO_READY is not claimed.
- No deployment, publishing, credentials, external communication, real data, Git commit/push/PR/CI, or additional agents.

## Manual check requested before owner report

the project owner opens `index.html` in Edge or Chrome and performs this short check using sample tasks only:

1. Add `Read chapter 1` with Add, then `Practice JavaScript` with Enter. Try a blank title.
2. Complete one task, refresh, and confirm both titles and its checkbox remain. Uncheck it.
3. Add two `Sample task` entries. Delete one and confirm the other remains. Refresh again.
4. Delete all sample tasks and refresh. Confirm the list remains empty.
5. Check keyboard navigation and resize the browser to a narrow window.

If persistence fails, report the exact browser/error and revise the local-launch boundary explicitly rather than adding a server silently.

## Owner-reported acceptance update

On 2026-10-01, the project owner responded to the requested actual-browser check:

> yes gumagana naman lahat and aligned sa sinabi mo

This supports user-reported manual acceptance of the described core flow, including add, completion, refresh persistence, and deletion after refresh. Browser/version was not provided. Codex did not observe the page, capture screenshots, or read native localStorage. Detailed keyboard and narrow-screen behavior remain unverified by Codex.

Current milestone result: DEMO_READY based on passing deterministic checks and owner-reported manual acceptance. The earlier SANDBOX_BOUNDARY_BLOCKED entry records the historical automated-browser attempt; the tool limitation still applies but no longer blocks owner acceptance of M1.

Next action: read README.md and trace the Add flow in app.js. No additional feature or hosting change has been authorized or made.
