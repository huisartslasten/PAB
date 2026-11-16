# OEFENEN feature

This feature owns the practice-mode structure that sits alongside Lessons and Tests.

## Current structure
- Lessons remain the single source of learning content, including extra lessons.
- Oefenen is the umbrella for ways to practice lesson content.
- Flashcards is an active practice mode.
- Spelletjes are active practice modes built from shared practice services and game-specific runtimes.
- Tests remain a separate application capability.

## Shared question ownership
`question-session.js` is the canonical owner for exercise-question sequencing in practice games.

Its rules are shared across practice games that consume lesson questions:
- every question is presented in the current cycle;
- a wrong answer returns the question to the end of the queue;
- a correct answer removes the question from the current cycle;
- after every question is correct, a new cycle can start when the game itself continues;
- game-specific runtimes remain responsible for game rules, scoring, turns and win conditions.

## Authority
The administrator decides which practice modes are allowed for a lesson. AI may suggest suitability, but it does not decide availability.

## Architectural boundary
Practice does not introduce a second lesson/content system and does not change the Supabase schema. Page runtimes own presentation and interaction; practice runtimes own game/domain behavior; the shared question session owns reusable exercise-question flow.
