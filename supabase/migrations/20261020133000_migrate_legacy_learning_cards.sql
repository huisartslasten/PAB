insert into public.learning_topic_media (id, learning_topic_id, storage_path, original_name, mime_type, size_bytes, created_by, created_at)
select distinct p.id, l.learning_topic_id, p.storage_path, p.original_name, p.mime_type, p.size_bytes, p.created_by, p.created_at
from public.lesson_photos p
join public.lessons l on l.id = p.lesson_id
join public.lesson_learning_cards c on c.lesson_id = l.id
cross join lateral jsonb_array_elements(c.document->'elements') element
where l.learning_topic_id is not null
  and element->>'type' = 'image'
  and (element->>'media_id')::bigint = p.id
on conflict (id) do nothing;

select setval(
  pg_get_serial_sequence('public.learning_topic_media', 'id'),
  greatest(coalesce((select max(id) from public.learning_topic_media), 0), 1),
  true
);

insert into public.learning_material_cards (id, learning_topic_id, title, document, sort_order, created_at)
select c.id, l.learning_topic_id, c.title, c.document, c.sort_order, c.created_at
from public.lesson_learning_cards c
join public.lessons l on l.id = c.lesson_id
where l.learning_topic_id is not null
on conflict (id) do nothing;

select setval(
  pg_get_serial_sequence('public.learning_material_cards', 'id'),
  greatest(coalesce((select max(id) from public.learning_material_cards), 0), 1),
  true
);

-- Learning cards are now owned by learning topics; the lesson-owned table is retired.
drop table if exists public.lesson_learning_cards;
