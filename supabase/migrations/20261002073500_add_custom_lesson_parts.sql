-- PacoGO custom lesson items
-- Stores the editable question/answer structure while keeping
-- question/answer text columns compatible with the existing app.
alter table public.lesson_items
  add column if not exists question_parts jsonb,
  add column if not exists answer_parts jsonb;
