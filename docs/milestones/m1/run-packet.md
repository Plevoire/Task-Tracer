# Run Packet

Documentation paths updated on 2026-10-02. Original dates, approvals, results, and limitations are preserved. Plain paths and recorded commands are relative to the project root; baseline commands now use relocated destinations. Markdown links are relative to this document.

## Identity, goal, and authority

- Packet: `TT-M1-001`. Project: Task Tracker. Milestone: M1.
- Created: 2026-10-01, Asia/Manila. Status: DEMO_READY with owner-reported manual acceptance. the project owner explicitly confirmed the scope on 2026-10-01.
- Human owner: the project owner. Preparation and execution owner: Codex in this chat.
- Goal: a beginner-readable local task tracker that adds, lists, toggles, deletes, and preserves sample tasks after refresh.
- Observable result: open `index.html` in a browser and complete the acceptance flow below.
- Mode: STANDARD, feature work with local sample data and reversible source changes.
- Governance: canonical manual resolved from `~/.codex/AI_ENGINEERING_OS_PATH`; project navigation is `state.md`.

## Workspace and baseline

- Exact write boundary: `<project-root>`.
- Baseline: empty folder, no Git repository, existing app, tests, or accepted project contracts.
- Branch/worktree policy: work in this folder; no Git initialization or worktrees needed.
- Excluded writes: canonical manual, global Codex configuration, sibling projects, personal skills, and memory.
- Local browser sample storage is allowed after scope approval. Use only this app's storage key; never clear unrelated browser storage.
- Credentials: none needed or authorized. External services: none. No backend server or deployment.
- Technical containment of browser network access is not yet verified. The app will contain no external URLs, libraries, fonts, or network requests.

## Scope and design

- Planned source: `index.html` for structure, `styles.css` for appearance, `app.js` for behavior. Brief local usage instructions and verification evidence are in scope.
- UI: labeled task-title input, Add button, task list, completion checkbox, Delete button, empty-list message.
- Each task has an ID, title, and completed flag. The ID distinguishes tasks even when titles match.
- Trim title whitespace and reject blank titles. Display titles as plain text.
- Start with an empty list. During learning and testing, use invented sample titles only.
- Save every successful change as JSON in localStorage key `task-tracker-v1`; load it when the page opens.
- If saving/loading fails, show a clear message instead of silently claiming persistence or overwriting unreadable saved data.
- Excluded: editing titles, filters, due dates, categories, login, backend, online sync, deployment, real personal data, frameworks, package installation, and external assets.

## Method, topology, and permissions

- Method: understand baseline, implement smallest complete slice, run targeted checks, drive browser flow, repair ordinary failures, record results.
- Supporting skill: pstack:unslop. Other skills only if relevant and read first, within this single-owner scope.
- Verification skill: none; the procedure below is sufficient for this beginner milestone.
- Maximum writers: 1, Codex. Subagents: 0. Independent review: prohibited for this packet. External model lanes: none.
- Architecture comparison: unnecessary for this slice. Blast-radius check: inspect source for unintended external dependencies, network calls, and writes to unrelated storage.
- Authorized now: implement and verify the approved scope; confirmation recorded above.
- After explicit scope confirmation: create/edit in-scope app, checks, usage notes, evidence, and state; run local checks; drive sample browser interactions; repair ordinary failures.
- Git commits, push, PR, CI, merge, tags, releases, deployment, publishing, spending, credentials, real external messages, and real-data deletion are not authorized.

## Acceptance criteria

1. Enter a sample title and click Add or press Enter. Exactly one new incomplete task appears; the input clears.
2. Empty or whitespace-only titles create no task and produce understandable feedback.
3. All added tasks appear with their titles displayed as text. Duplicate titles can be managed independently.
4. Check a task to complete it; uncheck it to make it incomplete. Its visible checkbox and styling reflect the current state.
5. Delete removes only the selected task. Deleting the last task shows an empty-list message.
6. Refresh preserves added tasks, their completion state, and deletions. A deliberately emptied list stays empty after refresh.
7. The actual page works locally using plain HTML, CSS, and JavaScript, with no login, backend, online sync, or external resources.
8. Basic controls work with the keyboard and remain usable on a narrow screen.
9. Save/load failures produce clear feedback. No unrelated storage is modified.

## Verification and evidence

- Deterministic checks: JavaScript syntax check if an installed runtime is available; targeted meaningful checks for title validation and persistence behavior where feasible. Record exact commands and outcomes, not planned passes.
- Browser procedure: open the correct local `index.html`; add `Read chapter 1` with Add and `Practice JavaScript` with Enter; try a blank title; toggle both directions; refresh; add identical sample titles and delete one; verify the other survives; delete all; refresh and verify empty state.
- Read back the app-specific stored JSON after mutations and refresh when browser tools allow it.
- Check keyboard operation, narrow layout, text-only title rendering, browser errors, and storage failure handling where tooling supports it.
- Save actual results and unavailable checks in `docs/milestones/m1/evidence/verification.md`; preserve screenshots when available. Update `state.md` and this packet at closeout.
- No app behavior is mocked by design. Sample data is fictitious. Browser/tool restrictions and any unverified boundaries must be stated explicitly.
- Expected result: DEMO_READY only when evidence supports the local milestone. If browser verification is unavailable, report source/check results separately and leave actual user flow unverified.

## Budget, stopping, and recovery

- Repair budget: at most 6 attempts; at most 2 same-hypothesis failures without new evidence. Reviews and multi-model runs: 0.
- Stop before implementation until the project owner confirms scope. Escalate for material scope changes, protected actions, uncertain recovery, or exhausted repair budget.
- If file-page persistence is unsupported, record the evidence and seek a smallest scope adjustment rather than silently adding a server.
- Recovery: preserve existing/unrelated files and browser data. Amend only artifacts created for this milestone; no automatic bulk deletion or browser-wide reset.
- Resume from `state.md`, this packet, actual workspace, and latest owner authorization.

## Execution record and result

- Scope confirmation recorded. Implemented index.html, styles.css, app.js, README.md, and targeted tests.
- Syntax checks passed. `node tests/app.test.cjs`: 6 passed, 0 failed, using simulated DOM/storage. Native test-runner subprocess failed with spawn EPERM; direct execution completed the same tests.
- Browser attempt rejected file:// under the tool's URL policy, which permits only HTTP/HTTPS and prohibits workarounds. Actual browser user flow and storage readback remain unverified; no server introduced.
- Result: DEMO_READY based on six passing simulated behavior tests and owner-reported manual acceptance. the project owner reports all behavior matches the described flow on 2026-10-01; browser/version unspecified. Automated browser verification remains blocked, and real storage JSON, screenshots, keyboard, and narrow-layout details remain unverified by Codex.
- Evidence: [evidence/verification.md](evidence/verification.md). Run by opening index.html in a modern local browser.
- Budget used: 0 app repairs; one test-runner invocation adjustment. Additional agents: 0. Protected actions performed: none. No material scope changes.
- Exact next action: the project owner traces the Add flow in app.js using README.md. No further M1 implementation is needed.


