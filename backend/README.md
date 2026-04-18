# Budgeting App Backend

FastAPI backend for personal budgeting and expense tracking.

## Architecture

**State Pattern**: The `State` class aggregates all services and is created via factory pattern in `main.py`. This provides clean dependency injection and testability.

**Storage**: Uses CouchDB as primary storage — see [db/README.md](../db/README.md) for database schema and document structure. SQLite is kept as legacy storage for backward-compatible backup/restore.

## Setup

Configure environment variables:

- `TOKEN` — bearer token for API authentication
- `PASSWORD` — password for the `/config` endpoint
- `DB_URL` — CouchDB connection URL

Google Drive credentials are optional (see Backup section). See [root README](../README.md) for build/run commands.

### Database Migrations

```bash
poetry run alembic revision --autogenerate -m "description"
poetry run alembic upgrade head
```

## Backup & Restore

See [backup/README.md](./src/budgeting_app_backend/backup/README.md) for ZIP structure details.

**Google Drive (optional):** scheduled backups upload the ZIP to Google Drive when credentials are configured:

```dotenv
GOOGLE_DRIVE_CREDENTIALS_PATH=credentials/google-drive-credentials.json
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
```

**Scheduler configuration:**

```dotenv
DAILY_DUMP_HOUR=3    # Hour (UTC) for daily automated backup
DAILY_DUMP_MINUTE=0  # Minute for daily automated backup
```


