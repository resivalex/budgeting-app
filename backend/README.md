# Budgeting App Backend

FastAPI backend for personal budgeting and expense tracking.

- [Setup](#setup-)
- [Docker Setup](#docker-setup-)
- [Google Drive Backup](#google-drive-backup-)
- [API](#api-)
- [Development](#development-)
- [License](#license-)

## Setup 🚀

1.  Clone: Navigate to the backend directory: `cd backend`
2.  Install: `poetry install`
3.  Configure: Copy `.env.example` to `.env` and fill in values.
4.  Google Drive: Set up credentials (see [Google Drive Backup](#google-drive-backup-)).
5.  Migrate DB: `poetry run alembic upgrade head`
6.  Run: `poetry run uvicorn main:app --reload` (Access API docs at `http://localhost:8000/api`)

## Docker Setup 🐳

This project can also be run using Docker Compose:

### Development Environment

```bash
docker-compose -f docker-compose.dev.yml up
```

This will start the backend service in development mode with:
- Hot reloading enabled
- The entire backend directory mounted to `/app` in the container
- Port 8000 exposed to the host

### Production Environment

```bash
docker-compose up
```

This will start the backend service in production mode with:
- Only data and credential directories mounted to the container
- Automatic database migration on startup

For more details on the Docker setup and how to run the full stack, see the project's [Docker documentation](../DOCKER.md).

## Google Drive Backup 🔄🕒

Automated daily CSV backups to Google Drive.

**Setup:**

1.  Create a Google Cloud Project, enable the Drive API, and create a Service Account with Drive File Creator role. Download its JSON key.
2.  Save the key to `credentials/google-drive-credentials.json`.
3.  Create a Drive folder, share it with the service account email, and note the folder ID.
4.  Add to `.env`:
    ```dotenv
    GOOGLE_DRIVE_CREDENTIALS_PATH=credentials/google-drive-credentials.json
    GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
    # Optional: Backup time (UTC, default 03:00)
    # DAILY_DUMP_HOUR=3
    # DAILY_DUMP_MINUTE=0
    ```

Manual backup trigger: `/trigger-backup` API endpoint.

## API 🌐

Explore interactive API documentation available at `/api` when the server is running.

## Development 💻

-   Use `poetry` for dependency management.
-   Run `poetry run alembic revision --autogenerate -m "description"` to create new migrations.
-   Core logic is in `src/budgeting_app_backend/`.
-   `main.py` is the FastAPI entry point.
-   `alembic/` contains database migrations.

## License 📝

[MIT License](LICENSE).
