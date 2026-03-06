---
name: readme-sync
description: Keep README.md files synchronized with code changes. When code is going to be modified, this skill identifies affected directories, locates their README files, reads them completely, then updates them to reflect new architectural decisions, features, and usage patterns - focusing on high-level documentation (what/why) while avoiding implementation details (how).
---

# README Synchronization Skill

This skill keeps README.md files in sync with code changes through a systematic workflow: identify affected directories → locate and read existing README files → update documentation to reflect changes while maintaining focus on high-level concepts over implementation details.

## When to Use This Skill

Use this skill whenever:

- Making changes to code that affect project structure or features
- Adding new functionality or components
- Modifying architectural decisions or design patterns
- Changing public APIs or usage patterns

## How This Skill Works

This skill keeps documentation synchronized with code through a three-step workflow:

### Step 1: Identify Affected Directories

- Analyze the code modification context to determine which directories contain changed files
- List these directories to the user for transparency

### Step 2: Locate and Read README Files

- Check each affected directory for a README.md file
- Confirm which README files exist
- **Critical:** Read each README file completely before making any changes
- This ensures updates preserve existing structure and context

### Step 3: Update Documentation

Update README files to reflect code changes, focusing on:

- **High-level overview and purpose** - what the code accomplishes
- **Key innovations and architectural decisions** - notable design choices
- **Rationale and trade-offs** - why this approach was chosen
- **Usage examples and API surface** - how users interact with the code
- **Feature descriptions** - what the code does (not how it does it)

## Documentation Guidelines

### What to Include in README Files

✅ **DO include:**

- High-level overview and purpose
- Key innovations and architectural decisions
- Rationale and trade-offs (why this approach was chosen)
- Usage examples and API surface
- Feature descriptions (what the code does)

❌ **DO NOT include:**

- Specific method names or internal function signatures
- Line-by-line code explanations
- Low-level algorithmic steps
- Class attribute listings
- Implementation details (how the code works internally)

### Code Quality Standards

When making code changes that affect documentation:

- Prefer self-documenting code over comments
- Use single-line docstrings only (module/class level)
- Skip method docstrings unless logic is non-obvious
- Clean up redundant comments after changes

## Example

When adding a new feature:

1. Make the code changes
2. Identify which directories are affected (e.g., `src/nn_scorer/`)
3. Check if `src/nn_scorer/README.md` exists
4. Update the README to describe:
   - What the new feature does (not how it's implemented)
   - Why this approach was chosen
   - How to use the new feature (with examples)
   - Any architectural implications

## Best Practices

- **Keep README files concise** - focus on high-level concepts
- **Ensure documentation matches implementation** - verify accuracy
- **Update incrementally** - sync README with each meaningful change
- **Think like a user** - document what users need to know, not internal details
