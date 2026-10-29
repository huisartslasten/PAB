-- Canonical game-access persistence.
-- The PacoGO frontend game registry owns the playable game catalog.
-- Supabase stores stable game keys, learner progression state and access state.

alter table public.game_results
  add column game_key text;

update public.game_results gr
set game_key = g.key
from public.games g
where g.id = gr.game_id;

alter table public.game_results
  alter column game_key set not null;

alter table public.game_results
  drop constraint if exists game_results_game_id_fkey;

alter table public.game_results
  drop column game_id;

create index if not exists game_results_game_key_lesson_student_idx
  on public.game_results (game_key, lesson_id, student);

drop table public.games;

create table public.game_access_settings (
  student text primary key,
  required_tests integer not null default 10 check (required_tests >= 1),
  minimum_score integer not null default 9 check (minimum_score >= 0),
  updated_at timestamptz not null default now()
);

create table public.game_access_state (
  student text not null,
  game_key text not null,
  unlocked boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (student, game_key)
);

create table public.game_access_cycles (
  student text primary key,
  cycle integer not null default 1 check (cycle >= 1),
  updated_at timestamptz not null default now()
);

create table public.game_access_cycle_tests (
  student text not null,
  cycle integer not null check (cycle >= 1),
  lesson_id bigint not null references public.lessons(id) on delete restrict,
  qualifying_score numeric(4,2) not null check (qualifying_score >= 0),
  credited_at timestamptz not null default now(),
  primary key (student, cycle, lesson_id)
);

create index game_access_state_student_idx
  on public.game_access_state (student, unlocked);

create index game_access_cycle_tests_student_cycle_idx
  on public.game_access_cycle_tests (student, cycle);

create unique index game_access_one_normal_game_idx
  on public.game_access_state (student)
  where unlocked = true and game_key <> 'double-or-nothing';

alter table public.game_access_settings enable row level security;
alter table public.game_access_state enable row level security;
alter table public.game_access_cycles enable row level security;
alter table public.game_access_cycle_tests enable row level security;

create policy "Public can read game access settings"
  on public.game_access_settings
  for select
  to anon, authenticated
  using (true);

create policy "Public can read game access state"
  on public.game_access_state
  for select
  to anon, authenticated
  using (true);

create policy "Public can read game access cycles"
  on public.game_access_cycles
  for select
  to anon, authenticated
  using (true);

create policy "Public can read credited game access tests"
  on public.game_access_cycle_tests
  for select
  to anon, authenticated
  using (true);

create or replace function public.get_game_access(p_student text)
returns table (
  game_key text,
  unlocked boolean,
  cycle integer,
  required_tests integer,
  minimum_score integer,
  credited_tests integer
)
language sql
stable
as $$
  with settings as (
    select
      coalesce(nullif(trim(p_student), ''), '') as student,
      coalesce(s.required_tests, 10) as required_tests,
      coalesce(s.minimum_score, 9) as minimum_score,
      coalesce(c.cycle, 1) as cycle
    from (select 1) seed
    left join public.game_access_settings s on s.student = trim(p_student)
    left join public.game_access_cycles c on c.student = trim(p_student)
  ),
  credited as (
    select count(*)::integer as credited_tests
    from public.game_access_cycle_tests ct
    where ct.student = trim(p_student)
      and ct.cycle = (select cycle from settings)
  ),
  games as (
    select game_key, unlocked
    from public.game_access_state
    where student = trim(p_student)
  )
  select
    catalog.game_key,
    case when catalog.game_key = 'double-or-nothing' then true else coalesce(g.unlocked, false) end,
    settings.cycle,
    settings.required_tests,
    settings.minimum_score,
    credited.credited_tests
  from (
    values
      ('double-or-nothing'),
      ('memory'),
      ('flash-question'),
      ('tic-tac-toe'),
      ('drop4'),
      ('connect-the-dots'),
      ('word-reveal'),
      ('word-chase'),
      ('lexo')
  ) as catalog(game_key)
  cross join settings
  cross join credited
  left join games g on g.game_key = catalog.game_key;
$$;

create or replace function public.claim_game_unlock(p_student text, p_game_key text)
returns table (
  game_key text,
  unlocked boolean,
  cycle integer,
  required_tests integer,
  minimum_score integer,
  credited_tests integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student text := trim(coalesce(p_student, ''));
  v_game_key text := trim(coalesce(p_game_key, ''));
  v_cycle integer;
  v_required integer;
  v_minimum integer;
  v_credited integer;
begin
  if v_student = '' then raise exception 'A student is required.'; end if;
  if v_game_key not in ('memory','flash-question','tic-tac-toe','drop4','connect-the-dots','word-reveal','word-chase','lexo') then
    raise exception 'Game is not unlockable.';
  end if;

  insert into public.game_access_settings (student) values (v_student) on conflict (student) do nothing;
  insert into public.game_access_cycles (student) values (v_student) on conflict (student) do nothing;

  select c.cycle into v_cycle from public.game_access_cycles c where c.student = v_student for update;
  select s.required_tests, s.minimum_score into v_required, v_minimum from public.game_access_settings s where s.student = v_student;

  insert into public.game_access_cycle_tests (student, cycle, lesson_id, qualifying_score)
  select v_student, v_cycle, q.lesson_id, q.score
  from (
    select ta.lesson_id,
      max(round((ta.score::numeric / nullif(ta.total_questions, 0)) * 10, 2)) as score
    from public.test_attempts ta
    where ta.student = v_student
      and ta.is_test = true
      and ta.completed_at is not null
      and ta.total_questions > 0
    group by ta.lesson_id
  ) q
  where q.score >= v_minimum
    and not exists (
      select 1 from public.game_access_cycle_tests existing
      where existing.student = v_student and existing.cycle = v_cycle and existing.lesson_id = q.lesson_id
    )
  on conflict (student, cycle, lesson_id) do update
    set qualifying_score = greatest(public.game_access_cycle_tests.qualifying_score, excluded.qualifying_score);

  select count(*)::integer into v_credited from public.game_access_cycle_tests ct where ct.student = v_student and ct.cycle = v_cycle;
  if v_credited < v_required then raise exception 'Not enough qualifying tests: % of %.', v_credited, v_required; end if;

  insert into public.game_access_state (student, game_key, unlocked)
  values (v_student, 'double-or-nothing', true)
  on conflict (student, game_key) do update set unlocked = true, updated_at = now();

  update public.game_access_state set unlocked = false, updated_at = now()
  where student = v_student and game_key <> 'double-or-nothing';

  insert into public.game_access_state (student, game_key, unlocked)
  values (v_student, v_game_key, true)
  on conflict (student, game_key) do update set unlocked = true, updated_at = now();

  update public.game_access_cycles set cycle = v_cycle + 1, updated_at = now() where student = v_student;
  return query select * from public.get_game_access(v_student);
end;
$$;

grant execute on function public.get_game_access(text) to anon, authenticated;
grant execute on function public.claim_game_unlock(text, text) to anon, authenticated;

create or replace function public.admin_set_game_access(p_student text, p_game_key text, p_unlocked boolean)
returns table (game_key text, unlocked boolean, cycle integer, required_tests integer, minimum_score integer, credited_tests integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student text := trim(coalesce(p_student, ''));
  v_game_key text := trim(coalesce(p_game_key, ''));
  v_cycle integer;
begin
  if auth.uid() is null or auth.uid() <> 'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid then raise exception 'Not authorized.'; end if;
  if v_student = '' then raise exception 'A student is required.'; end if;
  if v_game_key not in ('double-or-nothing','memory','flash-question','tic-tac-toe','drop4','connect-the-dots','word-reveal','word-chase','lexo') then raise exception 'Game is not available.'; end if;

  insert into public.game_access_settings (student) values (v_student) on conflict (student) do nothing;
  insert into public.game_access_cycles (student) values (v_student) on conflict (student) do nothing;
  select c.cycle into v_cycle from public.game_access_cycles c where c.student = v_student for update;

  if p_unlocked then
    update public.game_access_state set unlocked = false, updated_at = now()
    where student = v_student and game_key <> 'double-or-nothing';
    insert into public.game_access_state (student, game_key, unlocked)
    values (v_student, v_game_key, true)
    on conflict (student, game_key) do update set unlocked = true, updated_at = now();
    update public.game_access_cycles set cycle = v_cycle + 1, updated_at = now() where student = v_student;
  elsif v_game_key <> 'double-or-nothing' then
    update public.game_access_state set unlocked = false, updated_at = now()
    where student = v_student and game_key = v_game_key;
  end if;

  return query select * from public.get_game_access(v_student);
end;
$$;

grant execute on function public.admin_set_game_access(text, text, boolean) to authenticated;

create or replace function public.admin_set_game_access_settings(p_student text, p_required_tests integer, p_minimum_score integer)
returns table (required_tests integer, minimum_score integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.uid() <> 'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid then raise exception 'Not authorized.'; end if;
  if trim(coalesce(p_student, '')) = '' then raise exception 'A student is required.'; end if;
  if p_required_tests is null or p_required_tests < 1 then raise exception 'Required tests must be at least 1.'; end if;
  if p_minimum_score is null or p_minimum_score < 0 or p_minimum_score > 10 then raise exception 'Minimum score must be between 0 and 10.'; end if;
  insert into public.game_access_settings (student, required_tests, minimum_score)
  values (trim(p_student), p_required_tests, p_minimum_score)
  on conflict (student) do update set required_tests = excluded.required_tests, minimum_score = excluded.minimum_score, updated_at = now();
  return query select s.required_tests, s.minimum_score from public.game_access_settings s where s.student = trim(p_student);
end;
$$;

grant execute on function public.admin_set_game_access_settings(text, integer, integer) to authenticated;
