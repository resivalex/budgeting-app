# Backup Module

## Architecture

Two classes with clear separation of concerns:

- **`BackupService`** — creates and restores ZIP archives containing both databases
- **`BackupScheduler`** — wraps `BackupService` with APScheduler cron scheduling and Google Drive upload

## ZIP Archive Structure

```
backup.zip
├── sqlite/budgeting-app.sqlite3   # Full SQLite database copy
└── couchdb/budgeting.json          # JSON dump of all CouchDB documents
```

## Key Design Decisions

- **Atomic SQLite snapshots**: uses `sqlite3.Connection.backup()` via a temp file — safe under concurrent reads/writes
- **Clean CouchDB restore**: `_rev` fields are stripped on export so documents can be bulk-inserted without conflicts
- **Atomic file replacement**: SQLite restore writes to `.tmp` then `os.replace()` to avoid partial writes
- **Optional Google Drive**: scheduler skips upload gracefully when credentials are not configured

## Dependencies

- `pycouchdb` — CouchDB document dump and bulk restore
- `apscheduler` — background cron scheduling (default 03:00 UTC daily)
- `budgeting_app_backend.services.GoogleDriveService` — lazy import for optional Drive upload

## Integration

Instantiated in `main.py`. FastAPI routes delegate to `BackupService` and `BackupScheduler` for all backup operations.
