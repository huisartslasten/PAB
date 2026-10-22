-- Register the lesson-specific word-reveal practice game in the central game catalog.
insert into public.games (key, name, score_direction)
values ('word_reveal', 'Woordonthuller', 'low')
on conflict (key) do update
set name = excluded.name,
    score_direction = excluded.score_direction,
    active = true;
