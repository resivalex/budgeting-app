---
name: readme-sync
description: Keep README.md and prd.md files synchronized with code changes. Identifies affected directories, reads existing docs, then updates README (technical/developer focus) and PRD (requirements/feature focus) files to reflect changes.
---

# README & PRD Synchronization Skill

This skill keeps README.md and prd.md files in sync with code changes. Always read both before updating either.

## When to Use This Skill

Use this skill whenever:

- Making changes to code that affect project structure or features
- Adding new functionality or components
- Modifying architectural decisions or design patterns
- Changing public APIs or usage patterns

## Workflow

### Step 1: Identify Affected Directories

- Determine which directories contain modified files
- Apply updates to README and PRD files in each affected directory

### Step 2: Read Existing Documentation

- **Critical:** Fully read both README.md and prd.md in each affected directory before making any changes
- This ensures updates preserve existing structure and context

### Step 3: Update README Files (Developer-focused)

**Audience**: Developers setting up, running, or modifying the code

✅ **DO include:**

- Setup instructions, commands, architecture decisions, technical workflows
- High-level architecture, key innovations, design rationale
- Usage examples and API surface

❌ **DO NOT include:**

- Specific method signatures, line-by-line explanations, low-level algorithms
- Implementation details (how the code works internally)

### Step 4: Update PRD Files (Requirement-focused)

**Audience**: Understanding what features do and why they exist

✅ **DO include:**

- Feature descriptions, user workflows, business logic, data flows
- Integration points and system interactions
- "What" and "why" — requirements without implementation details

❌ **DO NOT include:**

- Technical implementation, code structure, deployment details
- Architectural decisions (those belong in README)

## Key Files in This Project

- Root: `README.md`, `prd.md`
- Backend: `backend/README.md`, `backend/prd.md`, module-level `prd.md` files
- Frontend: `web/README.md`, `web/prd.md`, component-level `prd.md` files
- Database: `db/README.md`, `db/prd.md`

## Best Practices

- **Keep docs concise** - focus on high-level concepts
- **Ensure documentation matches implementation** - verify accuracy
- **Update incrementally** - sync docs with each meaningful change
- **Think like the audience** - README for developers, PRD for requirements
