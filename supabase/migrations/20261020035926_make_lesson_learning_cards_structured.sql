alter table public.lesson_learning_cards
  add column if not exists document jsonb not null default '{"version":1,"elements":[]}'::jsonb;

update public.lesson_learning_cards
set document = jsonb_build_object(
  'version', 1,
  'elements',
    (case
      when nullif(btrim(content), '') is not null then
        jsonb_build_array(
          jsonb_build_object(
            'id', 'text-' || id::text,
            'type', 'text',
            'html', content
          )
        )
      else '[]'::jsonb
    end)
    ||
    (case
      when image_id is not null then
        jsonb_build_array(
          jsonb_build_object(
            'id', 'image-' || id::text,
            'type', 'image',
            'media_id', image_id,
            'width', 100
          )
        )
      else '[]'::jsonb
    end)
)
where document = '{"version":1,"elements":[]}'::jsonb
  and (nullif(btrim(content), '') is not null or image_id is not null);

alter table public.lesson_learning_cards
  drop column if exists content,
  drop column if exists image_id;
