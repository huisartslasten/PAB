# Agenda feature

Owns the professional Agenda application boundary: deterministic display/composition, custom agenda items, test-calendar integration, lesson matching, and the separate media/AI import-review pipeline.

V4.78 remains the behavioral parity baseline. The professional runtime is now integrated and the legacy Agenda runtime is no longer an owner.

AI/media import follows candidate → review → storage and is kept out of the deterministic read path.

No Supabase schema changes are introduced by this structural refactor.
