# Feature: Budgets

## Overview

Budget management system providing visual tracking of spending limits across categories with multi-currency support and progress visualization.

## Business Rules

### Spending Calculation

Spending is computed from `bucket_from`/`bucket_to` fields — see [Domain PRD](../../domain/PRD.md) for canonical rules. Budget-specific: transfer transactions are excluded to avoid double-counting, and each transaction falls into exactly one named bucket or the uncategorized pool.

### Budget Categories

- **Named budgets**: User-defined with editable amounts and currencies
- **"Другое" (Rest)**: Auto-generated, collects all transactions not assigned to any named budget
- **"ОБЩИЙ" (Total)**: Auto-generated summary of spending across all named budgets; read-only

### Progress Visualization

- Multi-segment progress bar: spent / remaining / overdraft / profit — normalized to never exceed 100%
- Common expectation ratio: visual marker showing expected spending progress based on current date within the month

### Multi-Currency Support

Per-month currency configurations define a main currency and conversion rates. All budget totals are converted to the month's main currency for comparison.
