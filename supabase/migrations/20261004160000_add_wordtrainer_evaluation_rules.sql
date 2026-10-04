-- PacoGO TEST — WOORDENTRAINER evaluation rules
-- Keeps answer evaluation explicit and teacher-controlled.
ALTER TABLE lesson_items
  ADD COLUMN IF NOT EXISTS hint text,
  ADD COLUMN IF NOT EXISTS min_words integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS required_terms text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN lesson_items.hint IS 'Fixed teacher-authored hint shown to the learner on request.';
COMMENT ON COLUMN lesson_items.min_words IS 'Minimum number of words required in a free-text answer; 0 means no minimum.';
COMMENT ON COLUMN lesson_items.required_terms IS 'Optional terms that must occur in the learner answer; empty means no required terms.';
