# Transactions Module

Two adapters that bridge external storage systems for transaction data.

## Components

### DbSource

Connects to CouchDB via `pycouchdb` and retrieves all documents from the `budgeting` database. Unwraps CouchDB's document envelope, returning a flat list of dicts. Used by `State.transactions()` to serve the `GET /transactions` endpoint.

### GoogleDriveDump

Thin facade over `GoogleDriveService` that uploads CSV bytes to Google Drive with the correct MIME type. Used by `State.importing()` to back up the current dataset before a full database replace.

## Public API

```python
from budgeting_app_backend.transactions import DbSource, GoogleDriveDump

source = DbSource(url="http://...")
docs = source.all()  # list[dict]

dump = GoogleDriveDump(credentials_path="...", folder_id="...")
dump.put(csv_bytes)  # uploads to Google Drive
```

## Related Modules

- `../services/` — `GoogleDriveService` used internally by `GoogleDriveDump`
- `../exporting/` — produces the CSV content passed to `GoogleDriveDump`
- `../state.py` — wires both components into the application
