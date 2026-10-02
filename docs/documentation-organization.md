# Documentation organization, 2026-10-02

## Authorized scope

the project owner requested milestone grouping, reference repair, preserved history, and relevant verification. Risk is STANDARD; task shape is a documentation refactor. One execution owner and writer, Codex. No app/test changes, deletion, push, or publication are authorized for this work.

The canonical manual was resolved through `~/.codex/AI_ENGINEERING_OS_PATH`. Its documentation convention assigns current navigation/status to state, execution contracts to packets, and test/runtime facts to evidence. Its continuity and verification rules require preserving accepted history, repairing affected paths, and distinguishing simulated tests from native behavior.

## Layout and preservation

- Root `state.md`, `checkpoint.md`, `AGENTS.md`, and `README.md` remain the current entry points.
- Each M1–M4 packet is `docs/milestones/mN/run-packet.md`; its evidence is `evidence/verification.md` beneath the same milestone.
- Existing M1–M3 snapshots are `docs/milestones/mN/baseline/`, preserving source/test relative layout. No M4 snapshot existed.
- The [milestone index](milestones/README.md) lists the records without replacing canonical state.
- The [file manifest](organization-manifest.json) records every original file's old/new path, byte count, and SHA-256 fingerprint. A fingerprint identifies exact file bytes. All 31 original files matched their fingerprints immediately after relocation, before reference edits.
- References were repaired in root records, milestone records, and snapshot READMEs. Historical approvals, results, and unresolved native-browser limitations were retained. Recorded baseline commands now use current destinations; the manifest retains original path names.
- Empty root `evidence/` and `baselines/` directories were retained. No files or directories were deleted; no destination was overwritten.

## Acceptance and verification

Required: every original file is accounted for; all app and test bytes remain identical; every local Markdown link resolves; affected paths and commands use current destinations; current tests and all relocated snapshot tests pass. Browser verification must remain honestly labeled.

Post-move checks on 2026-10-02:

| Check | Actual result |
| --- | --- |
| Original-file manifest and directory mapping | All 31 original files accounted for; all 9 original directories preserved or mapped to their relocated equivalents |
| Source/test SHA-256 comparison | All 16 current and snapshot HTML/CSS/JS/test files unchanged |
| `node --check app.js` | Passed |
| `node --check tests/app.test.cjs` | Passed |
| `node tests/app.test.cjs` | 33 passed, 0 failed |
| `node docs/milestones/m1/baseline/tests/app.test.cjs` | 6 passed, 0 failed |
| `node docs/milestones/m2/baseline/tests/app.test.cjs` | 17 passed, 0 failed |
| `node docs/milestones/m3/baseline/tests/app.test.cjs` | 25 passed, 0 failed |
| Documentation references and command paths | Local Markdown links resolve; referenced Node script paths exist in the documented working directories; no stale active milestone/baseline paths |
| Root app static checks | Unique HTML IDs, matching JavaScript references, local assets present; no external URLs/network calls, innerHTML assignment, or storage-wide clear |

The four suites execute actual current/snapshot JavaScript with simulated browser elements and storage, totaling 81 passing checks. No native browser was driven or browser storage changed. Previous file-URL policy restrictions remain in force, without retries or workarounds. M4's existing native-browser acceptance boundary is independent of this completed documentation task.

Documentation result: VERIFIED for relocation, reference repair, file preservation, and relevant commands. The app retains its existing SANDBOX_BOUNDARY_BLOCKED result only at native M4 acceptance. No additional scope, protected action, or model/agent change occurred.

## Next action

After relocation checks, resume the project owner's sample-only [M4 browser verification](milestones/m4/evidence/verification.md). No additional feature scope is approved by this organization work.
