-- Register Word Chase as one lesson game with difficulty-specific score identities.
insert into public.games (key, name, score_direction)
values
  ('word_chase_rookie', 'Word Chase Rookie', 'low'),
  ('word_chase_goat', 'Word Chase GOAT', 'low')
on conflict (key) do update
set name = excluded.name,
    score_direction = excluded.score_direction,
    active = true;
