drop policy if exists "Parents can delete test attempts" on public.test_attempts;

create policy "Parents can delete test attempts"
on public.test_attempts
for delete
to authenticated
using (auth.uid() = 'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid);
