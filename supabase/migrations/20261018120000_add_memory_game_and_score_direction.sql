-- Extend the shared game catalog with score direction.
-- Memory measures performance by fewer turns, while existing games can remain high-score games.

alter table public.games
  add column score_direction text not null default 'high'
  check (score_direction in ('high', 'low'));

update public.games
set score_direction = 'high'
where score_direction is null;

insert into public.games (key, name, score_direction)
values ('memory', 'Memory', 'low')
on conflict (key) do update
set name = excluded.name,
    score_direction = excluded.score_direction,
    active = true;
