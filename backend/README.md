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

## Google Drive Backup 🔄

1. Create a Google Cloud Project with Drive API and Service Account
2. Save JSON key to `credentials/google-drive-credentials.json`
3. Create & share Drive folder with service account
4. Add to `.env`:

```dotenv
GOOGLE_DRIVE_CREDENTIALS_PATH=credentials/google-drive-credentials.json
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
```

Trigger manual backup: `/trigger-backup` endpoint

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
  - `backup/`: Automated Google Drive backups
  - `importing/`, `exporting/`: CSV data transfer

### Testing

API documentation with interactive testing: `http://localhost:8000/api`

## License 📝

[MIT License](LICENSE)
