# Feature: Backend Settings Module

## Overview

Persistent application configuration management backed by SQLite, covering budget limits, category display names, account visual properties, and upload state tracking.

## Components

### SpendingLimits

- Stores and retrieves the full budget configuration as a Pydantic model (`SpendingLimitsValue`)
- Supports named budgets with color, category list, and per-month limit amounts + currencies
- Supports per-month currency conversion configuration (`MonthCurrencyConfig`)
- Provides month-scoped read/write operations (`get_month_budget`, `set_month_budget`, `set_month_budget_item`)

### CategoryExpansions

- Stores a mapping from short category codes to expanded display names
- Default: empty mapping when not yet configured

### AccountProperties

- Stores per-account visual properties (color)
- Default: empty config when not yet configured

### UploadDetails

- Tracks the timestamp of the last successful CSV import (`transactionsUploadedAt`)
- Frontend uses this timestamp to detect when a server-side database reset has occurred
- Default: epoch timestamp (`1970-01-01`) when no upload has occurred yet

## Integration Points

All settings components depend on `SettingsProtocol` for storage, allowing the SQLite-backed `SqlSettings` to be swapped for testing. The `State` class composes all four components.

## Component References

- **[Protocols](../protocols/)**: `SettingsProtocol` defines the storage interface
- **[SQLite Module](../sqlite/PRD.md)**: Provides the `Connection` used by `SqlSettings`
- **[Backend State](../state.py)**: Composes all settings components
