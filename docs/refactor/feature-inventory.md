# PacoGO V4.78 feature inventory — migration checklist

This is a preservation checklist, not a redesign specification. Every item must remain available after the refactor unless explicitly changed later.

## Application shell and navigation

- PacoGO branding and Paco mascot/banner presentation
- Student selection and student-specific navigation
- Parent/admin navigation
- Left sidebar (LB), middle content area (MV), right sidebar (RB), and top/banner areas (BB)
- Greeting and page navigation
- Login/session handling
- Logout
- Responsive/mobile layouts

## Student/learning experience

- Dashboard/home
- Subject/lesson navigation
- Lesson listing and lesson cards
- Lesson player/execution
- Test/practice state and result handling
- Wordtrainer
- Eigen Les / custom lessons
- Spelling, dictation, question/answer and mathematics-related lesson flows
- Lesson progress/history where currently present

## Lesson management

- Create lesson
- Edit lesson
- Delete/archive lesson
- Recovery/restore archived lessons
- Student assignment/selection
- Lesson type selection
- Subvak handling
- Test-date handling
- Drag/drop behavior where currently present
- Existing deterministic lesson-editor behavior
- Existing editor labels, fields and validation

## Agenda and tests

- Agenda display
- Week navigation
- Upcoming tests
- Test dates linked to practice/lessons where currently present
- Calendar/import behavior already implemented
- Existing date normalization and matching behavior

## Photo lessons and storage

- Photo upload / lesson-from-photo flow
- OCR integration where currently present
- Existing photo/storage helpers
- Preservation of original uploaded material where already implemented

## Parent/admin functionality

- Parent/admin dashboard
- Student switching
- Lesson management
- Archived/recovery views
- Feedback functionality where currently present
- Existing management controls

## External/runtime dependencies

- Supabase JavaScript client
- Supabase authentication/data access
- Supabase Storage where used
- QRCodeJS where used
- Tesseract.js where used
- Existing Supabase migrations remain unchanged during structural refactor

## Visual preservation checklist

- Existing Paco artwork/assets
- Existing Aruba hero/banner
- Existing colors, typography and spacing system
- Existing LB/MV/RB/BB proportions and placement
- Existing buttons and labels
- Existing lesson-editor appearance
- Existing responsive behavior

## Refactor rule

Before deleting or replacing any old implementation, identify its callers/dependencies and confirm the replacement covers the same behavior. If uncertain, retain the old implementation until verification is complete.
