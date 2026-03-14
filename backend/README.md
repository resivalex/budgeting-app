# Budgeting App Backend

FastAPI backend for personal budgeting and expense tracking.

## Architecture

**State Pattern**: The `State` class aggregates all services and is created via factory pattern in `main.py`. This provides clean dependency injection and testability.

**CouchDB Storage**:

- **`budgeting` database**: Transaction data (synced with frontend's PouchDB)
- **`budgeting-settings` database**: Configuration data (spending limits, account properties, category expansions)
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
├── couchdb/budgeting.json                # All transaction documents as JSON
└── couchdb/budgeting-settings.json       # All settings documents as JSON
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
  - `couchdb_settings.py`: Settings backed by CouchDB `budgeting-settings` database
  - `settings/`: Configuration management (Pydantic models)
  - `transactions/`: Transaction data access (CouchDB)
  - `backup/`: Full backup/restore (ZIP with CouchDB databases)
  - `importing/`, `exporting/`: CSV data transfer

### Testing

API documentation with interactive testing: `http://localhost:8000/api`

## Module Documentation

- **[Services](./src/budgeting_app_backend/services/PRD.md)**: GoogleDriveService for optional cloud backup uploads
- **[Settings](./src/budgeting_app_backend/settings/PRD.md)**: Application configuration management
- **[Transactions](./src/budgeting_app_backend/transactions/PRD.md)**: CouchDB access and Google Drive dump
- **[Exporting](./src/budgeting_app_backend/exporting/PRD.md)**: CSV generation from CouchDB transactions
- **[Importing](./src/budgeting_app_backend/importing/PRD.md)**: CSV-based full database replacement
- **[Backup](./src/budgeting_app_backend/backup/PRD.md)**: ZIP backup and restore of both databases

## License 📝

[MIT License](LICENSE)
