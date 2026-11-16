alter table public.lesson_items
  add column if not exists content_data jsonb;
