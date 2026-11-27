begin;

-- LIVE-only additive runtime contract and authorization alignment.
-- Apply only to Supabase LIVE after backup and migration validation.
-- Do not replay this migration as part of the TEST migration chain.

do $preflight$
begin
  if to_regclass('public.lesson_items') is null
     or to_regclass('public.skill_assignments') is null
     or to_regclass('public.game_results') is null
     or to_regclass('public.lesson_order') is null
     or to_regclass('public.challenge_configurations') is null
     or to_regclass('public.skill_definitions') is null then
    raise exception 'LIVE runtime contract target tables are missing; stop and reconcile the schema';
  end if;

  if exists (
    select 1
    from public.skill_assignments
    group by student, skill_id
    having count(*) > 1
  ) then
    raise exception 'LIVE contains duplicate student/skill assignments; do not create the unique index until reconciled';
  end if;
end;
$preflight$;

-- The current lesson writer persists this additive JSON model.
-- Existing LIVE-only columns (min_words, required_terms, explanation,
-- ai_instruction and editor_labels) are deliberately untouched.
alter table public.lesson_items
  add column if not exists content_data jsonb;

-- Required by the current Skill configuration service's upsert conflict target.
create unique index if not exists skill_assignments_student_skill_id_key
  on public.skill_assignments (student, skill_id);

-- Game results are readable by both actual LIVE parent accounts.
drop policy if exists "Parents can view game results" on public.game_results;
create policy "Parents can view game results"
  on public.game_results
  for select
  to authenticated
  using (
    (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

-- Lesson order is readable by learners and writable by either LIVE parent.
drop policy if exists "Public can read lesson order" on public.lesson_order;
create policy "Public can read lesson order"
  on public.lesson_order
  for select
  to anon, authenticated
  using (true);

drop policy if exists "parents manage lesson order" on public.lesson_order;
create policy "parents manage lesson order"
  on public.lesson_order
  for all
  to authenticated
  using (
    (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  )
  with check (
    (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

-- Skill assignment writes are restricted to the LIVE main administrator.
drop policy if exists "Main administrator can insert Skill assignments" on public.skill_assignments;
create policy "Main administrator can insert Skill assignments"
  on public.skill_assignments
  for insert
  to authenticated
  with check ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

drop policy if exists "Main administrator can update Skill assignments" on public.skill_assignments;
create policy "Main administrator can update Skill assignments"
  on public.skill_assignments
  for update
  to authenticated
  using ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid)
  with check ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

drop policy if exists "Main administrator can delete Skill assignments" on public.skill_assignments;
create policy "Main administrator can delete Skill assignments"
  on public.skill_assignments
  for delete
  to authenticated
  using ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

-- Challenge configuration is readable by LIVE parents, but writable only by the main administrator.
drop policy if exists "Parents can manage challenge configurations" on public.challenge_configurations;
create policy "Parents can read challenge configurations"
  on public.challenge_configurations
  for select
  to authenticated
  using (
    (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

create policy "Main administrator can manage challenge configurations"
  on public.challenge_configurations
  for all
  to authenticated
  using ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid)
  with check ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

-- Skill definitions remain publicly readable as before; only the main administrator may write them.
drop policy if exists "Parents can manage skill definitions" on public.skill_definitions;
create policy "Main administrator can manage skill definitions"
  on public.skill_definitions
  for all
  to authenticated
  using ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid)
  with check ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

-- The learning-topic media service requires a private bucket. No TEST media objects
-- are copied; the 19 TEST objects belong to placeholder topics.
do $bucket$
declare
  existing_bucket storage.buckets%rowtype;
  expected_mime_types text[] := array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]::text[];
begin
  select * into existing_bucket
  from storage.buckets
  where id = 'lesson-photos';

  if not found then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('lesson-photos', 'lesson-photos', false, 5242880, expected_mime_types);
  elsif existing_bucket.public is distinct from false
     or existing_bucket.file_size_limit is distinct from 5242880
     or existing_bucket.allowed_mime_types is distinct from expected_mime_types then
    raise exception 'LIVE lesson-photos bucket exists with an unexpected configuration; stop and reconcile';
  end if;
end;
$bucket$;

drop policy if exists lesson_photos_storage_select on storage.objects;
create policy lesson_photos_storage_select
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'lesson-photos');

drop policy if exists lesson_photos_storage_insert on storage.objects;
create policy lesson_photos_storage_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'lesson-photos'
    and (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

drop policy if exists lesson_photos_storage_delete on storage.objects;
create policy lesson_photos_storage_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'lesson-photos'
    and (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

do $verify$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'lesson_items'
      and column_name = 'content_data'
      and data_type = 'jsonb'
  ) then
    raise exception 'LIVE content_data column verification failed';
  end if;

  if to_regclass('public.skill_assignments_student_skill_id_key') is null then
    raise exception 'LIVE Skill assignment unique-index verification failed';
  end if;

  if not exists (
    select 1 from storage.buckets
    where id = 'lesson-photos'
      and public = false
      and file_size_limit = 5242880
  ) then
    raise exception 'LIVE private lesson-photos bucket verification failed';
  end if;
end;
$verify$;

commit;
