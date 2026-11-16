drop policy if exists "Parents can view test attempts" on public.test_attempts;
create policy "Parents can view test attempts"
on public.test_attempts
for select
to authenticated
using (auth.uid() in (
  '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
  '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
));

drop policy if exists "Parents can view test answers" on public.test_attempt_answers;
create policy "Parents can view test answers"
on public.test_attempt_answers
for select
to authenticated
using (exists (
  select 1 from public.test_attempts a
  where a.id = test_attempt_answers.attempt_id
    and auth.uid() in (
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    )
));