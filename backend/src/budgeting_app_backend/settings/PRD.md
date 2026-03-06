# Feature: Backend Settings Module

## Overview

Persistent application configuration covering budget limits, category display names, account visual properties, and upload state tracking.

## Features

### Spending Limits

Users can define named budgets, each with a color, a set of categories, and per-month spending limits with associated currencies. Per-month currency conversion rates are also configurable, enabling multi-currency budget comparisons.

### Category Expansions

Short internal category codes can be mapped to human-readable display names shown in the UI.

### Account Properties

Each account can have a display color assigned, used for visual differentiation in the UI.

### Upload State

Tracks when the last CSV import occurred. The frontend compares this timestamp against its local state to detect server-side database resets and trigger a full resync.

## Default States

When a setting has never been written, each service returns a safe empty default:

- **Category Expansions** — empty expansions list (no mappings applied)
- **Account Properties** — empty accounts list (no colors assigned)
- **Upload Details** — epoch date `1970-01-01` (signals no import has occurred)

