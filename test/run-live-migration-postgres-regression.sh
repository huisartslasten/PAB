#!/usr/bin/env bash
set -euo pipefail

container_id="$(docker ps -q --filter 'ancestor=postgres:17' | head -n 1)"
if [[ -z "$container_id" ]]; then
  echo "PostgreSQL 17 service container was not found." >&2
  docker ps -a
  exit 1
fi

run_sql() {
  docker exec -i "$container_id" psql -X -v ON_ERROR_STOP=1 -U postgres -d pacogo_migration_test
}

run_sql < test/fixtures/live-migration-postgres-schema.sql

for migration in \
  supabase/migrations/20261125180000_add_curriculum_persistence_and_ownership_live.sql \
  supabase/migrations/20261127100000_live_runtime_contract_and_authorization.sql \
  supabase/migrations/20261127110000_live_millionaire_unlock_policy.sql \
  supabase/migrations/20261127120000_live_additive_test_content_history_transfer.sql
do
  echo "Applying disposable PostgreSQL validation: $migration"
  run_sql < "$migration"
done

run_sql < test/fixtures/live-migration-postgres-assertions.sql
echo "LIVE migration PostgreSQL regression passed."
