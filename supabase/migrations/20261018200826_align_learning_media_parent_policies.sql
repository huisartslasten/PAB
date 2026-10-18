drop policy if exists "learning cards writable by authenticated users" on public.lesson_learning_cards;
create policy "learning cards writable by parents"
  on public.lesson_learning_cards for all
  to authenticated
  using (auth.uid() = any(array[
    '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
    '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid,
    'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid
  ]))
  with check (auth.uid() = any(array[
    '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
    '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid,
    'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid
  ]));

drop policy if exists "lesson_photos_storage_insert" on storage.objects;
drop policy if exists "lesson_photos_storage_delete" on storage.objects;
drop policy if exists "lesson_photos_storage_select" on storage.objects;
create policy "lesson_photos_storage_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'lesson-photos' and auth.uid() = any(array[
    '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
    '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid,
    'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid
  ]));
create policy "lesson_photos_storage_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'lesson-photos' and auth.uid() = any(array[
    '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
    '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid,
    'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid
  ]));
create policy "lesson_photos_storage_select" on storage.objects for select to authenticated
  using (bucket_id = 'lesson-photos');
