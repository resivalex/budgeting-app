# Backup Module

## Architecture

Two classes with clear separation of concerns:

- **`BackupService`** — creates and restores ZIP archives containing both databases
- **`BackupScheduler`** — wraps `BackupService` with APScheduler cron scheduling and Google Drive upload

## How It Works

### ZIP Archive Structure

```
backup.zip
├── sqlite/budgeting-app.sqlite3   # Full SQLite database copy
└── couchdb/budgeting.json          # JSON dump of all CouchDB documents
```

`couchdb/budgeting.json` format:

```json
{
  "database": "budgeting",
  "exported_at": "2026-03-01T12:00:00+00:00",
  "doc_count": 1234,
  "docs": [{"_id": "...", ...}, ...]
}
```

### Key Design Decisions

- **Atomic SQLite snapshots**: uses `sqlite3.Connection.backup()` via a temp file — safe under concurrent reads/writes
- **Clean CouchDB restore**: `_rev` fields are stripped on export so documents can be bulk-inserted without conflicts
- **Atomic file replacement**: SQLite restore writes to `.tmp` then `os.replace()` to avoid partial writes
- **Optional Google Drive**: scheduler skips upload gracefully when credentials are not configured

## Dependencies

- `pycouchdb` — CouchDB document dump and bulk restore
- `apscheduler` — background cron scheduling (default 03:00 UTC daily)
- `budgeting_app_backend.services.GoogleDriveService` — lazy import for optional Drive upload

## Public API

```python
BackupService(sqlite_path, db_url)
    .create_backup_zip() -> bytes
    .restore_from_zip(zip_bytes) -> dict

BackupScheduler(backup_service, hour, minute, google_drive_credentials_path, google_drive_folder_id)
    .start()
    .shutdown()
    .trigger_backup_now() -> dict
```

Integrated in `main.py`: FastAPI exposes `GET /backup`, `POST /restore`, and `POST /trigger-backup`.
