# Budgeting App Backend

FastAPI backend for personal budgeting and expense tracking.

## Architecture

**State Pattern**: The `State` class aggregates all services and is created via factory pattern in `main.py`. This provides clean dependency injection and testability.

**Dual Storage Strategy**:

- **CouchDB**: Transaction data (synced with frontend's PouchDB)
- **SQLite**: Configuration data (spending limits, account properties, category expansions)

**Why separate databases?**

- CouchDB excels at bidirectional sync for offline-first transactions
- SQLite is simpler for backend-only configuration that doesn't need sync

**Module Structure**:

- `protocols/`: Type interfaces defining contracts between modules
- `state.py`: Central service aggregator
- `main.py`: FastAPI app with endpoint definitions
- `*/__init__.py`: Public API for each module

## Setup 🚀

1. Navigate to backend: `cd backend`
2. Install: `poetry install`
3. Configure: Copy `.env.example` to `.env`
4. Set up Google Drive credentials (see below)
5. Migrate DB: `poetry run alembic upgrade head`
6. Run: `poetry run uvicorn main:app --reload`
7. API docs: `http://localhost:8000/api`

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

Full-database backup as a ZIP archive containing both SQLite and CouchDB data.

**ZIP structure:**

```
backup.zip
├── sqlite/budgeting-app.sqlite3   # Full SQLite database copy
└── couchdb/budgeting.json          # All CouchDB documents as JSON
```

**Google Drive (optional):** scheduled backups upload the ZIP to Google Drive when credentials are configured:

```dotenv
GOOGLE_DRIVE_CREDENTIALS_PATH=credentials/google-drive-credentials.json
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
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
  - `settings/`: Configuration management (SQLite)
  - `transactions/`: Transaction data access (CouchDB)
  - `backup/`: Full backup/restore (ZIP with SQLite + CouchDB)
  - `importing/`, `exporting/`: CSV data transfer

### Testing

API documentation with interactive testing: `http://localhost:8000/api`

## Module Documentation

- **[Services](./src/budgeting_app_backend/services/PRD.md)**: GoogleDriveService for optional cloud backup uploads
- **[Settings](./src/budgeting_app_backend/settings/PRD.md)**: Application configuration management
- **[SQLite](./src/budgeting_app_backend/sqlite/PRD.md)**: SQLite abstraction for settings storage
- **[Transactions](./src/budgeting_app_backend/transactions/PRD.md)**: CouchDB access and Google Drive dump
- **[Exporting](./src/budgeting_app_backend/exporting/PRD.md)**: CSV generation from CouchDB transactions
- **[Importing](./src/budgeting_app_backend/importing/PRD.md)**: CSV-based full database replacement
- **[Backup](./src/budgeting_app_backend/backup/PRD.md)**: ZIP backup and restore of both databases

## License 📝

[MIT License](LICENSE)
