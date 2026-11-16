# PacoGO Learner Ownership and Persistence Contract v0.1

Status: database ownership and persistence are implemented in the repository and applied to PacoGO TEST only. The authenticated B1 learner adapter is now implemented in the repository and verified by Full Regression #2937. No real learner profiles or activity records have been created in TEST; LIVE remains untouched.

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

Do not put display names in evidence, events, provenance, logs or analytics. Define correction, deletion and retention procedures before production use. Multi-guardian invitation and membership management remain deferred. The TEST integration suite uses synthetic identities inside a rolled-back transaction; the learner tables contain zero rows after testing. The authenticated B1 adapter now exists in the repository, but no real parent has created a learner profile and no real learner activity has been connected.

## Scope exclusions

This proposal does not change the SLO curriculum, B1 task/evidence contracts, C3 multi-target observation design, mastery criteria, pilot task set or scientific-validation status. It does not authorize a LIVE change or immediate TEST migration.

## Implementation and TEST verification

Implemented in these repository migrations:

- `supabase/migrations/20261105024754_add_learner_ownership_and_rls.sql`
- `supabase/migrations/20261105030000_switch_learning_cycle_to_invoker.sql`
- `supabase/migrations/20261105040000_clear_learning_cycle_capability_on_error.sql`
- `supabase/migrations/20261105030001_factor_learner_write_context_policy.sql`

Applied to PacoGO TEST as migration history versions:

- `20261105024754` — `add_learner_ownership_and_rls`
- `20261105025422` — `switch_learning_cycle_to_invoker`
- `20261105025725` — `clear_learning_cycle_capability_on_error`
- `20261105030018` — `factor_learner_write_context_policy`

The implementation keeps `student_key` as a string at the engine boundary while requiring an opaque UUID string in persistence. Profile creation creates the authenticated owner membership in the same transaction. Clients cannot insert or alter membership records. Additional guardians require a future invitation flow.

The three learner data tables now reference learner profiles. Their RLS policies scope reads to linked guardians. Evidence and decision traces are append-only to normal clients; longitudinal state can be changed only through the atomic persistence RPC. The public `persist_curriculum_learning_cycle` RPC is `SECURITY INVOKER`; its transaction-local write context is cleared on both success and error. Direct table writes without that context are denied by RLS. Narrow SECURITY DEFINER helpers are in the non-exposed `private` schema and are not callable through the public Data API.

Integration test: `supabase/tests/learner_ownership_rls.test.sql`. It passed against PacoGO TEST with two synthetic parent accounts and two synthetic learners. It verifies cross-account read/write denial, membership self-enrollment denial, direct-write denial, anonymous privilege denial, event idempotency, atomic rollback and blocked learner-key reassignment. The test transaction rolled back all fixtures; post-test counts are zero for synthetic auth users, learner profiles, guardian memberships, evidence, longitudinal state and decision traces.

Full Regression #2932 / ID `41958684853` on repository commit `bf08558b4ec02ce1b5f787008db3cfe0ae4ca0c3`: **GREEN**. The migration and SQL integration test were applied/run against TEST after the repository regression. No LIVE changes were made.


## Application adapter implementation

The authenticated learner application adapter is implemented in the repository:

- `src/services/learner-curriculum-service.js` owns profile listing/creation, curriculum registry lookup, learner evidence/state restoration and the RPC payload for atomic persistence.
- `src/app/bootstrap.js` exposes the service through the canonical application composition root.
- `curriculum-b1-learner.html`, `curriculum-b2-learner.html` and `curriculum-b3-learner.html` require a parent session, let the parent create/select a profile, use its opaque UUID as the engine student key, restore skill-specific evidence/state, and persist each completed answer through `persist_curriculum_learning_cycle`.
- `auth.html` supports fixed, allowlisted returns to the B1, B2 and B3 routes after login.
- Failed persistence can be retried using the same source event ID. The database RPC's existing idempotency contract prevents duplicate evidence/trace records if a response is lost after a successful write.
- The routes preserve direct-answer practice and do not introduce a countdown timer or alter SLO claims/mastery criteria. They do not display a mastery verdict to the learner; the engine still stores prototype-only candidate inference in longitudinal state, which is not empirically validated and must not be presented as validated mastery.

Tests:
- `test/learner-curriculum-service.test.js` covers service contract and data mapping.
- `test/browser/curriculum-b1-learner.browser.test.js` covers the B1 parent/profile/practice/persistence flow and retry using a synthetic Supabase test double. `test/browser/curriculum-b2-learner.browser.test.js` covers all fourteen B2 practice tasks and persistence using a synthetic Supabase test double. `test/browser/curriculum-b3-learner.browser.test.js` covers all fourteen B3 practice tasks, Quantity Representation rendering and persistence using a synthetic Supabase test double.
- Full Regression #2937 / ID `41960343382` on commit `2238de47355bbbed4817252603c070242236ca17`: **GREEN**.

The TEST registry rows `pacogo-curriculum@0.3.0-candidate` and `pacogo-curriculum@0.4.0-candidate` were inserted and verified. Version 0.4 supersedes 0.3, includes B3, and is sourced from `docs/curriculum/PacoGO_Curriculum_Registry_v0.4.json`. These were registry-data inserts only; no schema migration was required. Learner profiles, guardian links, evidence, longitudinal state and decision traces remain at zero rows. LIVE was not touched.

The B1 catalogue remains a three-task operational practice slice. B2 and B3 each have a fourteen-task operational practice catalogue across seven candidate developments. The reusable Quantity Representation interface separates its pedagogical model from its visual renderer; the current first slice is display-only. These catalogues and interface are not empirical validation or a complete grade-six recovery curriculum. The SLO mapping remains the source of truth; the executable registry currently contains A1, B1, B2, B3 and FR2. Continue implementing the remaining mapped skills along their full developmental lines.
