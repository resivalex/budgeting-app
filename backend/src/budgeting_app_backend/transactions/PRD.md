# Feature: Backend Transactions Module

## Overview

CouchDB access components for reading transaction data and uploading CSV dumps to Google Drive.

## Components

### DbSource

- Connects to CouchDB and retrieves all documents from the `budgeting` database
- Returns a flat list of document dicts (unwraps CouchDB's document envelope)
- Used by `State.transactions()` to serve the `GET /transactions` endpoint

### GoogleDriveDump

- Wraps `GoogleDriveService` to upload CSV byte content to Google Drive
- Simple facade: delegates file upload to the service with default CSV MIME type
- Used by `State.importing()` to back up transaction data before a full database replace

## Integration Points

- `DbSource` feeds transaction data to the exporting pipeline and the transactions API endpoint
- `GoogleDriveDump` is triggered automatically during CSV import to preserve the previous dataset

## Component References

- **[Services Module](../services/PRD.md)**: `GoogleDriveService` used by `GoogleDriveDump`
- **[Exporting Module](../exporting/PRD.md)**: Provides the CSV content that gets uploaded via `GoogleDriveDump`
- **[Backend State](../state.py)**: Orchestrates both components
