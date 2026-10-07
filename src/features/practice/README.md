# OEFENEN feature

This feature owns the practice-mode structure that sits alongside Lessons and Tests.

## Current structure
- Lessons remain the single source of learning content, including extra lessons.
- Oefenen is the umbrella for ways to practice lesson content.
- Flashcards is the first active practice mode.
- Spelletjes is reserved as a future practice-mode slot; its behavior is intentionally not defined yet.
- Tests remain a separate application capability.

## Authority
The administrator decides which practice modes are allowed for a lesson. AI may suggest suitability, but it does not decide availability.

## Architectural boundary
This feature does not introduce a second lesson/content system and does not change the Supabase schema.
