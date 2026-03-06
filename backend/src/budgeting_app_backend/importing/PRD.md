# Feature: Backend Importing Module

## Overview

CSV-based full-database import that replaces all CouchDB transaction data with the contents of an uploaded CSV file.

## Functionality

- **CSV Upload Processing**: Accepts a CSV file upload and parses it into transaction records; all fields treated as strings, missing values become empty strings
- **Database Reconstruction**: Replaces the entire CouchDB `budgeting` database, eliminating merge conflicts — this is a destructive operation
- **Bulk Atomic Insert**: All records inserted in a single transactional bulk save
- **Post-Import Compaction**: Compacts the database after import for storage efficiency

## Integration Points

- Called by `State.importing()`, which exports a backup to Google Drive before importing and updates the upload timestamp
- Exposed via `POST /importing` API endpoint (file upload)

## Component References

- **[Exporting Module](../exporting/PRD.md)**: Pre-import backup created via `CsvExporting`
- **[Backend State](../state.py)**: Orchestrates pre-import backup and timestamp update
