-- Security follow-up for central game access functions.
alter function public.get_game_access(text) set search_path = public;
revoke execute on function public.admin_set_game_access(text, text, boolean) from anon;
revoke execute on function public.admin_set_game_access_settings(text, integer, integer) from anon;
