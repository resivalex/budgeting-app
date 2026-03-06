# Exporting Module

Exports all CouchDB transaction data as a CSV string.

## Key Class

**`CsvExporting`** — takes a CouchDB URL, fetches all documents from the `budgeting` database, strips system fields, sorts by `datetime` descending, and returns a CSV string via pandas + StringIO (no temp files).

## Usage

```python
from budgeting_app_backend.exporting import CsvExporting

csv_data = CsvExporting(couchdb_url).perform()  # returns str
```

Exposed via `State.exporting()` for the `GET /exporting` endpoint and called by the importing module to create a pre-import backup.
