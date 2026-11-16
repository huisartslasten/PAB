alter table public.skill_definitions
  add column if not exists archived_at timestamptz,
  add column if not exists trashed_at timestamptz;

create index if not exists skill_definitions_active_idx
  on public.skill_definitions (category, sort_order, id)
  where archived_at is null and trashed_at is null and enabled = true;

create index if not exists skill_definitions_archive_idx
  on public.skill_definitions (archived_at, sort_order, id)
  where archived_at is not null and trashed_at is null;

create index if not exists skill_definitions_trash_idx
  on public.skill_definitions (trashed_at, sort_order, id)
  where trashed_at is not null;
