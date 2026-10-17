-- Canonical lesson persistence flags for archive and recycle-bin management.
alter table public.lessons
  add column if not exists archived boolean not null default false,
  add column if not exists deleted boolean not null default false;

comment on column public.lessons.archived is 'Whether the lesson is archived and excluded from the active lesson list.';
comment on column public.lessons.deleted is 'Whether the lesson is in the recycle bin and excluded from active and archived lists.';
