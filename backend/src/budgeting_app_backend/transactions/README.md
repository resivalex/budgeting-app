# Transactions Module

Two adapters that bridge external storage systems for transaction data.

## Components

### DbSource

Connects to CouchDB and retrieves all documents from the `budgeting` database as a flat list. Used by `State.transactions()` to serve the `GET /transactions` endpoint.

### GoogleDriveDump

Thin facade over `GoogleDriveService` that uploads CSV bytes to Google Drive. Used by `State.importing()` to back up the current dataset before a full database replace.

## Configuration

`GoogleDriveDump` requires a Google Drive credentials path and folder ID, supplied through `GoogleDriveService`.

## Related Modules

- `../services/` — `GoogleDriveService` used internally by `GoogleDriveDump`
- `../exporting/` — produces the CSV content passed to `GoogleDriveDump`
- `../state.py` — wires both components into the application
