# PacoGO Learner Ownership and Persistence Contract v0.1

Status: design candidate only. No database changes are authorized by this document.

## Core proposal

Each learner receives a stable random UUID key. The curriculum engine continues to receive a string student key, but persistence uses this opaque UUID rather than a display name. A separate profile stores the display name for the guardian interface.

An explicit learner-to-guardian membership relation ties learner access to the authenticated account identity. Database row-level policies must check that membership. The browser-side parent allowlist and static roster are not security boundaries.

## Data access

- Learner profiles are readable only by linked guardians.
- Guardian memberships are visible only to their member and cannot be freely inserted by clients.
- Evidence and decision traces are append-only for normal sessions and readable/insertable only for linked guardians.
- Longitudinal state is readable and writable only for linked guardians.
- Shared curriculum registry configuration remains readable to authenticated users.
- Do not add a global administrator bypass to learner-data policies.

## Provisioning and persistence

Create the profile and initial owner membership atomically using the authenticated account identity. Any additional guardian must join through a separate, one-time, expiring invitation flow. Persist evidence, longitudinal state and decision trace in one atomic transaction, preserving existing curriculum and mastery contracts.

## Migration safeguards

Before adding foreign keys from the existing student_key columns, inspect all existing keys. If any key lacks an explicit learner profile, stop and design a mapping; never infer profiles from names. Replace broad learner-table policies in the same reviewed migration. Apply changes to PacoGO TEST only after repository tests pass. LIVE is out of scope.

## Required verification

Use two synthetic guardian accounts and two synthetic learners. Prove cross-guardian reads and writes are denied, anonymous access is denied, direct membership self-enrollment is denied, state cannot be reassigned to another learner, duplicate events are idempotent, and a failed learning-cycle transaction leaves no partial records. Remove synthetic records after testing.

## Privacy and open decisions

Do not put display names in evidence, events, provenance, logs or analytics. Define correction, deletion and retention procedures before production use. The current TEST database had zero learner rows at inspection, but this must be rechecked before migration. Existing broad RLS policies remain a blocker; no Supabase writes or policy changes have been made.

## Scope exclusions

This proposal does not change the SLO curriculum, B1 task/evidence contracts, C3 multi-target observation design, mastery criteria, pilot task set or scientific-validation status. It does not authorize a LIVE change or immediate TEST migration.