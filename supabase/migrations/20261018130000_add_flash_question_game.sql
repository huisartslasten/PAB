-- Register Flash Question in the shared game catalog.
-- It is a high-score game: one point is earned for each correct answer.

insert into public.games (key, name, score_direction)
values ('flash_question', 'Flitsvraag', 'high')
on conflict (key) do update
set name = excluded.name,
    score_direction = excluded.score_direction,
    active = true;
