# Exporting Module

Exports all CouchDB transactions as an in-memory CSV string — no temp files.

## Architecture

**`CsvExporting`** — accepts a CouchDB URL, fetches all documents from the `budgeting` database, drops CouchDB system fields (`_id`, `_rev`), and returns a CSV string via pandas and StringIO.

## Usage

```python
from budgeting_app_backend.exporting import CsvExporting

csv_data = CsvExporting(couchdb_url).perform()  # returns str
```

## Integration

Exposed via `State.exporting()`. Called by the `GET /exporting` endpoint.
