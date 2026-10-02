# Milestone documentation

[Project state](../../state.md) owns current status and the next action. [Checkpoint](../../checkpoint.md) owns session continuity. The current app remains [index.html](../../index.html); its source and tests remain at the project root.

| Milestone | Scope | Run Packet | Evidence | Existing baseline |
| --- | --- | --- | --- | --- |
| M1 | Add, list, complete/undo, delete, persistence | [Packet](m1/run-packet.md) | [Verification](m1/evidence/verification.md) | [M1 snapshot](m1/baseline/) |
| M2 | Edit title/category, combined filters | [Packet](m2/run-packet.md) | [Verification](m2/evidence/verification.md) | [M2 snapshot](m2/baseline/) |
| M3 | Custom categories and category persistence | [Packet](m3/run-packet.md) | [Verification](m3/evidence/verification.md) | [M3 snapshot](m3/baseline/) |
| M4 | Priorities, optional due dates, Overdue text | [Packet](m4/run-packet.md) | [Verification](m4/evidence/verification.md) | None existed; none created |

A baseline is a saved source/test copy of that milestone. Later packets can refer to an earlier baseline, such as M4 referring to M3. Snapshot code and tests are unchanged; snapshot README links were repaired. Use the current root page for sample tasks, since older code cannot safely manage newer saved formats.

Documentation was organized on 2026-10-02. Original milestone identities, approvals, dates, results, and limitations remain intact. File references and baseline command paths now use relocated destinations. Markdown links resolve from their containing document; plain paths and milestone-evidence commands use the project root. Snapshot README commands use the snapshot folder as their working directory.

From the project root, the relevant commands are:

```powershell
node --check app.js
node --check tests/app.test.cjs
node tests/app.test.cjs
node docs/milestones/m1/baseline/tests/app.test.cjs
node docs/milestones/m2/baseline/tests/app.test.cjs
node docs/milestones/m3/baseline/tests/app.test.cjs
```

These tests simulate browser elements and storage. Native M4 browser acceptance remains pending. See the [organization record](../documentation-organization.md) for relocation checks and the old-to-new file mapping.
