# Exporting Module

Exports all CouchDB transactions as an in-memory CSV string — no temp files.

## Architecture

Fetches all documents from the `budgeting` database, loads `cfg:account_properties` to build an ID-to-name map, replaces account/bucket IDs with human-readable names, and drops CouchDB system fields (`_id`, `_rev`). Uses pandas and StringIO for CSV generation.

## External Account Resolution

Reads the `owner` field from the `cfg:account_properties` CouchDB document and selects accounts where `owner == "external"` to build the set of external account IDs. The backend independently resolves account ownership for CSV export.
