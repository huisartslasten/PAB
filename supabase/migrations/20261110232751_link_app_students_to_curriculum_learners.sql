-- Explicitly link stable PacoGO roster identities to opaque curriculum learner profiles.
-- TEST-first. This migration does not infer identity from display names and must not
-- be applied to LIVE without a separate deployment decision.

begin;

create table public.learner_profile_links (
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  app_student_key text not null
    check (app_student_key ~ '^[a-z][a-z0-9-]{1,63}$'),
  learner_key text not null
    references public.learner_profiles(learner_key) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (owner_user_id, app_student_key),
  unique (learner_key)
);

create index learner_profile_links_owner_idx
  on public.learner_profile_links (owner_user_id);

alter table public.learner_profile_links enable row level security;
revoke all on public.learner_profile_links from public, anon, authenticated;
grant select, insert on public.learner_profile_links to authenticated;

create policy learner_profile_links_select_owner
  on public.learner_profile_links
  for select to authenticated
  using (owner_user_id = (select auth.uid()));

create policy learner_profile_links_insert_owner
  on public.learner_profile_links
  for insert to authenticated
  with check (
    owner_user_id = (select auth.uid())
    and exists (
      select 1
      from public.learner_profiles p
      where p.learner_key = learner_profile_links.learner_key
        and p.owner_user_id = (select auth.uid())
    )
  );

-- Link an already-existing profile. The mapping is explicit; names are never used
-- as identity. One curriculum profile can be linked to only one PacoGO roster key.
create or replace function public.link_app_learner_profile(
  p_app_student_key text,
  p_learner_key text
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_existing text;
begin
  if (select auth.uid()) is null then
    raise insufficient_privilege using message = 'authentication is required';
  end if;
  if p_app_student_key is null or p_app_student_key !~ '^[a-z][a-z0-9-]{1,63}$' then
    raise invalid_parameter_value using message = 'a stable PacoGO student key is required';
  end if;
  if not exists (
    select 1 from public.learner_profiles p
    where p.learner_key = p_learner_key
      and p.owner_user_id = (select auth.uid())
  ) then
    raise insufficient_privilege using message = 'only your own learner profile can be linked';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended((select auth.uid())::text || ':' || p_app_student_key, 0)
  );

  select l.learner_key into v_existing
  from public.learner_profile_links l
  where l.owner_user_id = (select auth.uid())
    and l.app_student_key = p_app_student_key;

  if v_existing is not null then
    if v_existing <> p_learner_key then
      raise unique_violation using message = 'this PacoGO student already has a different curriculum profile';
    end if;
    return v_existing;
  end if;

  insert into public.learner_profile_links (owner_user_id, app_student_key, learner_key)
  values ((select auth.uid()), p_app_student_key, p_learner_key);

  return p_learner_key;
end;
$$;

revoke all on function public.link_app_learner_profile(text, text) from public, anon;
grant execute on function public.link_app_learner_profile(text, text) to authenticated;

-- Provisioning is idempotent per authenticated parent + stable roster key.
-- The advisory lock prevents two simultaneous clicks from creating duplicate profiles.
create or replace function public.create_app_learner_profile(
  p_app_student_key text,
  p_display_name text
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_existing text;
  v_learner_key text;
begin
  if (select auth.uid()) is null then
    raise insufficient_privilege using message = 'authentication is required';
  end if;
  if p_app_student_key is null or p_app_student_key !~ '^[a-z][a-z0-9-]{1,63}$' then
    raise invalid_parameter_value using message = 'a stable PacoGO student key is required';
  end if;
  if p_display_name is null or length(btrim(p_display_name)) = 0 then
    raise invalid_parameter_value using message = 'display name must not be empty';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended((select auth.uid())::text || ':' || p_app_student_key, 0)
  );

  select l.learner_key into v_existing
  from public.learner_profile_links l
  where l.owner_user_id = (select auth.uid())
    and l.app_student_key = p_app_student_key;

  if v_existing is not null then
    return v_existing;
  end if;

  v_learner_key := public.create_learner_profile(btrim(p_display_name));

  insert into public.learner_profile_links (owner_user_id, app_student_key, learner_key)
  values ((select auth.uid()), p_app_student_key, v_learner_key);

  return v_learner_key;
end;
$$;

revoke all on function public.create_app_learner_profile(text, text) from public, anon;
grant execute on function public.create_app_learner_profile(text, text) to authenticated;

comment on table public.learner_profile_links is
  'Explicit owner-scoped mapping from immutable PacoGO roster keys to opaque curriculum learner profiles. Display names are not identity.';
comment on function public.create_app_learner_profile(text, text) is
  'Idempotently creates and links one curriculum learner profile for an existing PacoGO roster identity under the authenticated guardian.';

commit;
