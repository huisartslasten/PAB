-- Normalize legacy Supabase game-result keys to the canonical PacoGO Game Registry keys.
-- The frontend Game Registry is the sole catalog owner; persisted results must use its stable ids.

update public.game_results
set game_key = case game_key
  when 'double_or_nothing' then 'double-or-nothing'
  when 'flash_question' then 'flash-question'
  when 'tic_tac_toe' then 'tic-tac-toe'
  when 'word_reveal' then 'word-reveal'
  when 'word_chase_rookie' then 'word-chase'
  when 'word_chase_goat' then 'word-chase'
  when 'lexo_rookie' then 'lexo'
  when 'lexo_goat' then 'lexo'
  else game_key
end
where game_key in (
  'double_or_nothing',
  'flash_question',
  'tic_tac_toe',
  'word_reveal',
  'word_chase_rookie',
  'word_chase_goat',
  'lexo_rookie',
  'lexo_goat'
);

alter table public.game_results
  add constraint game_results_game_key_canonical_check
  check (game_key in (
    'double-or-nothing',
    'memory',
    'flash-question',
    'tic-tac-toe',
    'drop4',
    'connect-the-dots',
    'word-reveal',
    'word-chase',
    'lexo'
  ));
