# Budgeting App Backend

FastAPI backend for personal budgeting and expense tracking.

## Architecture

**State Pattern**: The `State` class aggregates all services and is created via factory pattern in `main.py`. This provides clean dependency injection and testability.

**CouchDB Storage**:

- **`budgeting` database**: All documents — transactions (`tx:`-prefixed, `kind: "transaction"`) and settings (`cfg:`-prefixed, `kind: "setting"`), synced with frontend's PouchDB. Transactions use `account_from`/`account_to` fields referencing account IDs, with `counterparty`, `bucket_from`/`bucket_to` fields. External accounts (used to derive income/expense type) are identified by `owner == "external"` in the `cfg:account_properties` settings document.
- **SQLite**: Legacy storage, kept for backward-compatible backup/restore

**Module Structure**:

- `protocols/`: Type interfaces defining contracts between modules
- `state.py`: Central service aggregator
- `main.py`: FastAPI app with endpoint definitions
- `*/__init__.py`: Public API for each module

## Setup 🚀

1. Navigate to backend: `cd backend`
2. Install: `poetry install`
3. Configure environment variables:
   - `TOKEN` — bearer token for API authentication
   - `PASSWORD` — password for the `/config` endpoint
   - `DB_URL` — CouchDB connection URL
4. Set up Google Drive credentials (see below)
5. Run: `poetry run uvicorn main:app --reload`
6. API docs: `http://localhost:8000/api`

## Docker Setup 🐳

### Development

```bash
docker-compose -f docker-compose.dev.yml up
```

### Production

```bash
docker-compose up
```

## Backup & Restore

**ZIP structure:**

```
backup.zip
└── couchdb/budgeting.json    # All documents (transactions + settings) as JSON
```

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

## Development 💻

### Dependencies

Managed with Poetry (`pyproject.toml`):

- FastAPI for web framework
- Pydantic for data validation
- Alembic for SQLite migrations
- APScheduler for backup scheduling
- Google API client for Drive integration

### Database Migrations

```bash
# Create migration
poetry run alembic revision --autogenerate -m "description"

# Apply migrations
poetry run alembic upgrade head
```

### Project Structure

- `main.py`: FastAPI application entry point
- `src/budgeting_app_backend/`: Core application code
  - `state.py`: Service aggregator (State pattern)
  - `protocols/`: Interface definitions
  - `couchdb_settings.py`: Settings backed by CouchDB `budgeting` database (`cfg:`-prefixed keys)
  - `settings/`: Configuration management (Pydantic models)
  - `backup/`: Full backup/restore (ZIP with CouchDB databases)
  - `exporting/`: CSV export with transaction type derivation from account IDs and account ID-to-name resolution

### Testing

API documentation with interactive testing: `http://localhost:8000/api`

## Module Documentation

- **[Services](./src/budgeting_app_backend/services/PRD.md)**: GoogleDriveService for optional cloud backup uploads
- **[Settings](./src/budgeting_app_backend/settings/PRD.md)**: Application configuration management
- **[Exporting](./src/budgeting_app_backend/exporting/PRD.md)**: CSV generation from CouchDB transactions
- **[Backup](./src/budgeting_app_backend/backup/PRD.md)**: ZIP backup and restore of the `budgeting` database

## License 📝

[MIT License](LICENSE)
