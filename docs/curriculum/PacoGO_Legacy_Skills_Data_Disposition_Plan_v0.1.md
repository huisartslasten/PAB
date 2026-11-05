# PacoGO Legacy Skills Data Disposition Plan v0.1

## Status

Design proposal only. No production or TEST data has been modified. This document does not authorize a database migration, deletion, archival write, or service removal.

## 1. Decision summary

The old Skills persistence contract is retired from the active learner-facing product, but its stored data is not empty and must not be conflated with the new curriculum engine.

The safe default is **dormant preservation**:

1. Keep `skill_definitions` and `skill_assignments` and all current rows unchanged.
2. Do not expose these rows through the new curriculum Skills interface.
3. Do not map legacy IDs to A1, B1, FR2 or any new curriculum skill without a separately reviewed semantic mapping.
4. Do not delete the three orphan `math-mixed` assignments as a cleanup side effect.
5. Keep historical Supabase migrations as immutable schema history.
6. Remove legacy application code only after a complete branch-specific dependency scan and a verified, access-controlled backup/export plan.

Dormant preservation is sufficient to retire an unused application path. A destructive data migration is not a prerequisite for the new Skills experience.

## 2. Verified TEST inventory (read-only snapshot)

Environment: PacoGO TEST Supabase project `btnhhvtpmuvrpbnkyjnm`. Snapshot observed 2026-11-05. Production was not queried or changed.

| Object | Observed state | Disposition |
|---|---:|---|
| `skill_definitions` | 13 rows; all enabled; none archived or trashed | Preserve in place |
| `skill_assignments` | 37 rows; 28 enabled, 9 disabled | Preserve in place |
| `game_results` | 5 rows across three game keys | Preserve; shared game history |
| `game_access_state` | 4 distinct game keys: lexo, memory, rock-paper-scissors, word-chase | Preserve; separate shared subsystem |
| Curriculum evidence/state tables | Have their own `skill_id` columns | Preserve; separate identifiers/contracts |

The 13 definition rows comprise the seeded arithmetic catalog plus two custom definitions:
- `math-abbf44aa-639b-445d-9c70-caab257c31a3`: “optellen tot 30”.
- `math-eac58ac1-4f29-47da-8f76-8d8ba7d46e2c`: “Breuken”.

The custom addition definition currently has no assignment. The custom fraction definition has an assignment for Zenith. This is a factual inventory only; it is not an approved curriculum mapping.

Three enabled assignment rows (one each for Zyon, Zenith and Zephon) reference `math-mixed`, but no definition with that ID exists. The definition was removed by historical migration `20261025070000_refine_skill_math_definitions.sql`; the assignment rows remained because `skill_assignments` has no foreign key to `skill_definitions`.

The 36 seeded assignments are 12 legacy catalog keys per learner. One additional assignment is the custom Breuken assignment. All 37 rows currently have empty `settings` objects. This snapshot must be rechecked immediately before any future operation; it is not a live guarantee.

## 3. Identifier boundary

Legacy identifiers such as `addition-100`, `math-mixed` and UUID-like custom IDs belong to the old Skill catalog.

The curriculum engine uses registry-owned identifiers and separate contracts. A matching subject label (for example, addition or fractions) does not establish equivalence of:
- construct or development;
- claim and evidence target;
- task model and task variation;
- mastery semantics;
- learner state or next-action semantics.

Therefore:
- no ID rewrite;
- no implicit alias table;
- no automatic assignment transfer;
- no reuse of legacy assignment state as curriculum mastery;
- no conversion of an enabled flag into learner progress.

Any future mapping must be a separately reviewed, explicit mapping record with rationale, source version, reviewer and a reversible migration plan. Unknown or partial matches remain unmapped.

## 4. Data classes and required handling

### 4.1 Definitions

Preserve every definition row exactly, including JSONB definition, enabled flag, order, lifecycle timestamps and creation/update timestamps.

Custom definitions must remain distinguishable from seeded catalog definitions. Do not overwrite a custom definition with a new curriculum definition even if the titles appear similar.

### 4.2 Assignments

Preserve every assignment row exactly, including primary key, learner key, legacy skill key, enabled flag, settings and timestamps.

Disabled assignments are meaningful configuration history and must not be dropped. Orphan assignments must be retained and explicitly labelled unresolved in any export/report.

### 4.3 Timed math runtime

The old math-domain modules generate questions and timed sessions. Their existence does not prove that historical learner attempts are persisted in those modules. The current TEST audit found no math/legacy-skill rows in `game_results` and no legacy math keys in `game_access_state`. Do not infer that no other historical record exists until the full repository and database dependency scan is complete.

### 4.4 Shared game data

`game_results`, `game_access_state`, `game_access_settings` and `game_access_cycles` are outside the legacy Skills deletion scope. Their schemas and rows must not be changed as part of Skills cleanup.

### 4.5 Curriculum engine data

`student_evidence`, `student_longitudinal_state` and `curriculum_decision_trace` are separate curriculum contracts even though they contain a `skill_id` column. No legacy Skills cleanup may alter those tables or values.

## 5. Backup/export protocol before any later destructive action

No export has yet been created. If a future approved action requires one:

1. Re-query exact source rows in a read-only transaction/snapshot where supported.
2. Export definitions and assignments as separate datasets, preserving native types and timestamps.
3. Include a manifest with environment identifier, export timestamp, schema/migration version, row counts, orphan counts and a cryptographic checksum for each export.
4. Verify counts and checksums after export; independently re-import into an isolated temporary database and compare canonicalized rows.
5. Store the export in an approved access-controlled backup location, not in the public repository, source tree, test fixtures or ordinary Git history. Learner-linked data must not be committed to Git.
6. Record the backup location, access owner, retention period and restore procedure in the restricted operational record. Do not put credentials or sensitive backup URLs in this document.
7. Keep source tables unchanged until restore verification and explicit approval are complete.

A CSV export alone is insufficient if it loses JSONB types, null semantics, identifiers or timestamps. Prefer a lossless JSON/SQL backup with a manifest.

## 6. Proposed retirement sequence

This is the proposed order; each stage requires its own regression gate.

### Stage A — complete dependency proof (no code/data changes)

- Scan the entire current feature branch, not the default branch, for imports, dynamic imports, route references, string-based service construction, HTML references, test references and SQL/RPC references.
- Classify each old service/module/test as active, test-only, historical contract, shared or unreachable.
- Inspect all database objects, triggers, policies, views, functions and foreign keys that refer to the legacy tables.
- Resolve the three orphan assignments as retained unresolved records, not as implicit deletions.
- Confirm whether any old learner attempt/result data exists outside `game_results`.

### Stage B — non-destructive application retirement

- Remove only code proven unreachable from the active app and not needed for an approved export/restore procedure.
- Retain tests only when they validate a still-supported contract; otherwise move the relevant contract assertions to migration/data-integrity tests before removing the old service.
- Keep the central `skills.html` route and curriculum-driven runtime.
- Do not change Supabase schema, policies, rows or migrations.
- Run Full Regression on the exact resulting commit.

### Stage C — optional database disposition (separate approval required)

The default remains dormant preservation. If the owner later explicitly chooses physical archival or deletion:
- first approve the exact table/row scope;
- produce and verify the export in Stage 5;
- check dependencies and retention requirements again;
- write a forward-only, reviewable migration with explicit preconditions and rollback/restore instructions;
- test against a disposable copy of TEST data;
- compare before/after counts and checksums;
- only then consider applying it to TEST. Production requires a separate decision and verification plan.

No DDL/DML is authorized by this design document.

## 7. Acceptance criteria

The legacy Skills data disposition is safe only when all are true:

- all 13 definitions and 37 assignments are accounted for;
- custom definitions remain separately identifiable;
- the three `math-mixed` assignments are retained or receive an explicitly approved disposition;
- no legacy identifier is silently treated as a curriculum identifier;
- shared game records and access tables are unchanged;
- curriculum evidence, learner state and decision trace are unchanged;
- backup restore has been tested before any destructive operation;
- all active-branch dependencies are proven, not inferred from default-branch code search;
- Full Regression is green on the exact implementation commit;
- handoff records the exact branch, commit, regression run and remaining decisions.

## 8. Open decisions

1. Should legacy tables remain indefinitely as dormant historical data, or is there a future retention/deletion requirement?
2. Is a restricted backup export required if no data is deleted and the tables remain in TEST?
3. Should custom legacy Skills be retained only as historical records, or should a future manual curriculum review consider them as input? No automatic mapping is proposed.
4. Who/what policy determines retention and deletion of learner-linked operational data?

Until these are answered, dormant preservation is the only approved default.
