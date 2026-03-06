# Feature: Backend Importing Module

## Overview

CSV-based full-database import that replaces all CouchDB transaction data with the contents of an uploaded CSV file.

## Functionality

- **CSV Upload Processing**: Accepts raw byte content, decodes as UTF-8, parses with pandas (all columns as strings, NaN replaced with empty strings); `budget_name` is a required column
- **Database Reconstruction**: Deletes and recreates the CouchDB `budgeting` database, eliminating merge conflicts
- **Bulk Atomic Insert**: All records inserted in a single transactional bulk save
- **Post-Import Compaction**: Compacts the database after import for storage efficiency

## Data Import Pipeline

1. Decode bytes and parse CSV with pandas
2. Delete and recreate `budgeting` database
3. Bulk-save all records atomically
4. Compact database

## Integration Points

- Called by `State.importing()`, which exports a backup to Google Drive before importing and updates the upload timestamp
- Exposed via `POST /importing` API endpoint (file upload)

## Component References

- **[Exporting Module](../exporting/PRD.md)**: Pre-import backup created via `CsvExporting`
- **[Backend State](../state.py)**: Orchestrates pre-import backup and timestamp update
