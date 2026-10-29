-- Admin game-access RPCs are protected by auth.uid() internally.
-- Remove implicit PUBLIC/anon execution so only signed-in callers can reach them.

revoke execute on function public.admin_set_game_access(text, text, boolean) from public;
revoke execute on function public.admin_set_game_access(text, text, boolean) from anon;
grant execute on function public.admin_set_game_access(text, text, boolean) to authenticated;

revoke execute on function public.admin_set_game_access_settings(text, integer, integer) from public;
revoke execute on function public.admin_set_game_access_settings(text, integer, integer) from anon;
grant execute on function public.admin_set_game_access_settings(text, integer, integer) to authenticated;
