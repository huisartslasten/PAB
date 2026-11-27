begin;

-- LIVE-only, narrowly scoped Millionaire configuration transfer.
-- Preserve enabled state, AI settings, question count and lifelines; change only
-- the two unlock-policy fields explicitly approved for LIVE.

do $preflight$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.challenge_configurations
  where challenge_key = 'millionaire';

  if v_count <> 1 then
    raise exception 'Expected exactly one LIVE Millionaire configuration; found %', v_count;
  end if;

  if not exists (
    select 1
    from public.challenge_configurations
    where challenge_key = 'millionaire'
      and enabled is true
      and game_settings ->> 'questionCount' = '11'
      and game_settings -> 'lifelines' = '{"askSomeone":true,"fiftyFifty":true,"askAudience":true}'::jsonb
      and unlock_policy ->> 'type' = 'assessment-score'
      and (
        (unlock_policy ->> 'minimumScore' = '10'
          and unlock_policy -> 'allowedLessonTypes' = '["dictation"]'::jsonb)
        or
        (unlock_policy ->> 'minimumScore' = '4'
          and unlock_policy -> 'allowedLessonTypes' = '["*"]'::jsonb)
      )
  ) then
    raise exception 'LIVE Millionaire configuration differs from the inspected source/target contract; stop and reconcile before changing it';
  end if;
end;
$preflight$;

update public.challenge_configurations
set unlock_policy = jsonb_set(
  jsonb_set(coalesce(unlock_policy, '{}'::jsonb), '{minimumScore}', '4'::jsonb, true),
  '{allowedLessonTypes}', '["*"]'::jsonb, true
),
updated_at = now()
where challenge_key = 'millionaire'
  and not (
    unlock_policy ->> 'minimumScore' = '4'
    and unlock_policy -> 'allowedLessonTypes' = '["*"]'::jsonb
  );

do $verify$
begin
  if not exists (
    select 1
    from public.challenge_configurations
    where challenge_key = 'millionaire'
      and enabled is true
      and unlock_policy ->> 'type' = 'assessment-score'
      and unlock_policy ->> 'minimumScore' = '4'
      and unlock_policy -> 'allowedLessonTypes' = '["*"]'::jsonb
      and game_settings ->> 'questionCount' = '11'
      and game_settings -> 'lifelines' = '{"askSomeone":true,"fiftyFifty":true,"askAudience":true}'::jsonb
  ) then
    raise exception 'LIVE Millionaire unlock-policy verification failed';
  end if;
end;
$verify$;

commit;
