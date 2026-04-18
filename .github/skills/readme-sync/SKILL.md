---
name: readme-sync
description: Keep README.md and PRD.md files synchronized with code changes. Reads existing docs, then updates only what changed.
---

# README & PRD Synchronization Skill

Keep documentation in sync with code. Always read both README.md and PRD.md in affected directories before editing either.

## What Goes Where

**README.md** — For developers modifying the code. Answers "how does this work and why was it built this way?"

Write:

- Design decision rationale and tradeoffs (e.g. "why CouchDB", "why one-shot sync instead of live")
- Non-obvious technical patterns not self-evident from reading code (concurrency control, UTC/local conversion strategy, viewport API workarounds)
- Setup steps only when non-trivial (custom env vars, credentials, migrations)

Skip:

- File/directory listings (visible from file tree)
- Module or class enumerations with one-line summaries (that's what code navigation is for)
- Anything already documented elsewhere — link instead

**PRD.md** — For understanding what the feature does. Answers "what does the user get and what are the rules?"

Write:

- User workflows (what the user does step by step)
- Business rules that are hard to reverse-engineer from code (transaction type derivation, budget calculation, field visibility by type)
- Edge cases and special behavior (error recovery, empty states, fallback logic)
- Field mappings and transformation rules when non-obvious

Skip:

- Implementation details, architecture, code structure (belongs in README)
- Simple feature lists that just mirror UI element names
- Anything already documented elsewhere — link instead

## Single Source of Truth

Each fact lives in exactly one file. Other files reference it with a brief mention and a link.

Canonical locations:

- **Database schema and document structure** → `db/README.md`
- **Transaction type derivation rules** → `web/src/domain/PRD.md`
- **Architecture overview** → root `README.md`
- **Setup and dev commands** → root `README.md`

## Core Principles

1. **Don't document the obvious** — if reading the code answers the question, skip it
2. **Always preserve "why"** — rationale and reasoning survive even when "what" is clear
3. **No duplication** — one canonical source, everything else links to it
4. **Keep it short** — every sentence must earn its place
