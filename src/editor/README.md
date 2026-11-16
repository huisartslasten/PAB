# Central Editor Framework

This directory is the canonical home for editor infrastructure shared by PacoGO content editors.

The framework owns editor mechanics and contracts, not domain meaning or persistence.

## Ownership

- `src/editor/` — generic editor infrastructure and contracts.
- `src/features/lessons/` — lesson-specific elements and lesson-domain behavior.
- `src/features/learning-material/` — learning-material-specific elements and learning-material persistence.
- Page runtimes — composition and navigation.

Domain registries must consume the central contracts rather than reimplement editor infrastructure locally.
