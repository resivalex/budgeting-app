# Importing Module

CSV-based full-database import for the budgeting app backend.

## Architecture

Single class `CsvImporting` (exported from `__init__.py`) encapsulates the entire import flow:

1. **Database recreation** — drops and recreates the `budgeting` CouchDB database to eliminate revision conflicts
2. **CSV parsing** — uses pandas with `dtype=str` and `fillna("")` so all fields stay as strings with no NaN values
3. **Bulk insert** — `save_bulk(..., transaction=True)` inserts all records atomically
4. **Compaction** — compacts the database after import to reclaim storage

## Usage

```python
from budgeting_app_backend.importing import CsvImporting

importer = CsvImporting(couchdb_url)
importer.perform(csv_bytes)
```

Exposed via `POST /importing` (multipart file upload). Orchestrated by `State.importing()`, which runs a pre-import backup and updates the upload timestamp around this call.

## Design Rationale

Recreating the database (delete + create) rather than diffing/merging avoids CouchDB revision conflicts entirely and keeps the import logic simple and predictable.
