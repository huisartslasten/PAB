alter table public.learning_topics
  add column if not exists archived boolean not null default false,
  add column if not exists deleted boolean not null default false;

create index if not exists learning_topics_active_idx
  on public.learning_topics (student, subject, subvak)
  where archived = false and deleted = false;

create index if not exists learning_topics_recovery_idx
  on public.learning_topics (student, subject, subvak)
  where archived = true or deleted = true;
