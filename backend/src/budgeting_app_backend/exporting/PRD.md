# Feature: Backend Exporting Module

## Overview

Exports all CouchDB transaction data as a CSV file with a standard column set and chronological ordering.

## Functionality

- **Column Standardization**: Fixed output columns in order: `datetime`, `account`, `category`, `type`, `amount`, `currency`, `payee`, `comment`, `budget_name`
- **Metadata Stripping**: Removes CouchDB system fields (`_id`, `_rev`) from output
- **Chronological Sorting**: Sorts records by `datetime` descending (newest first)
- **Empty Dataset Handling**: Returns a properly headed CSV with no rows when the database is empty
- **In-Memory Generation**: Uses pandas + StringIO for efficient CSV generation without temporary files

## Output Format

CSV string with columns: `datetime, account, category, type, amount, currency, payee, comment, budget_name`

## Integration Points

- Called by `State.exporting()` for the `GET /exporting` API endpoint
- Called by `State.importing()` to create a pre-import backup before overwriting the database

## Component References

- **[Importing Module](../importing/PRD.md)**: Uses exporting as a pre-import backup step
- **[Backend State](../state.py)**: Exposes exporting result as bytes
