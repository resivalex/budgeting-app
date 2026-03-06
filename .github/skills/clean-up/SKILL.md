---
name: clean-up
description: Removes dead code, unused variables, redundant comments, and awkward naming from code files while preserving all functionality and public interfaces. Use when asked to clean, tidy, refactor, or simplify code.
---

# Code Clean-Up Skill

This skill refactors code files to improve readability and reduce noise — removing useless variables, dead methods, redundant comments, and awkward naming — without altering functionality or breaking public interfaces. Each file is processed in an isolated subagent.

## When to Use This Skill

Use this skill when:

- Cleaning up or tidying code in specific files or directories
- Removing dead code, unused variables, or leftover debug statements
- Simplifying overly complex constructions without changing behaviour
- Improving naming clarity for internal symbols

## What Clean-Up Means

**Remove or fix:**

- Unused variables, parameters, and imports
- Dead methods or functions that are never called (private / internal only — never remove public API)
- Redundant or misleading comments (especially commented-out code)
- Overly verbose constructions that have simpler equivalents
- Awkward or unclear names for internal (non-public) symbols

**Always preserve:**

- All observable behaviour and logic
- Public interfaces: function signatures, class names, module-level exports
- Any comment that explains _why_ (not just _what_)

## Step-by-Step Workflow

### Step 1: Collect Target Files

1. If a directory is given, list all code files in it recursively.
2. Filter to relevant source files (`.py`, `.ts`, `.js`, `.go`, etc.) — skip binaries, lock files, and generated files.
3. Present the list to the user for confirmation if the scope is large (> 10 files).

### Step 2: Launch One Subagent Per File

For each file, launch a **separate subagent** with the following prompt template:

```
You are a code clean-up agent. Your task is to clean up the file: <absolute_path>

Rules:
1. Read the entire file first.
2. Apply ONLY the following changes:
   - Remove unused variables, imports, and parameters
   - Remove dead code (unreachable or never-called private functions/methods)
   - Delete redundant or misleading comments and commented-out code
   - Simplify overly complex constructions to clearer equivalents
   - Rename awkward internal (non-public) symbols to clearer names
3. NEVER change public interfaces (exported functions, class names, public method signatures).
4. NEVER alter logic or behaviour.
5. NEVER add new functionality.
6. If a change would affect a public interface, skip it entirely.
7. Apply the changes directly to the file using the available edit tools.
8. Return a brief summary of what was changed.
```

Run all subagents in parallel when the agent framework supports it.

### Step 3: Collect and Report Results

After all subagents finish:

- Summarise which files were changed and what categories of issues were fixed.
- Mention any files that were skipped (no issues found or too risky to change).

## Examples

### Input

> Clean up `src/utils.py`

### Expected output

- Unused imports removed
- Dead helper function `_old_parse()` deleted
- Commented-out block from 2022 removed
- Variable `tmp2` renamed to `parsed_value`

### Input

> Clean up everything in `notebooks/dups-code/src/`

### Expected output

- Each `.py` file processed by its own subagent in parallel
- Summary table of changes per file

## Edge Cases

- **Test files:** Apply the same rules but be extra conservative — do not remove anything that looks like a test fixture or intentional stub.
- **`__init__.py` files:** Treat all exports as public; only remove truly internal dead code.
- **Auto-generated files:** Skip entirely (look for generation headers or comments).
- **Files with no changes needed:** Subagent should report "no changes needed" and leave the file untouched.
