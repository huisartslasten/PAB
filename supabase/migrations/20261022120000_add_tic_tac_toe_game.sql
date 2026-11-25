insert into public.games (key, name, active, score_direction)
values ('tic_tac_toe', 'Tic-Tac-Toe', true, 'high')
on conflict (key) do update
set name = excluded.name,
    active = excluded.active,
    score_direction = excluded.score_direction;
