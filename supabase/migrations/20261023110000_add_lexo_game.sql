-- Register LEXO difficulty variants in the central game catalog.
-- LEXO uses a higher-is-better score: longer/more words earn more points.
insert into public.games (key, name, score_direction)
values
  ('lexo_rookie', 'LEXO Rookie', 'high'),
  ('lexo_goat', 'LEXO GOAT', 'high')
on conflict (key) do update
set name = excluded.name,
    score_direction = excluded.score_direction,
    active = true;
