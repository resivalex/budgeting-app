# Budgeting App Backend

FastAPI backend for personal budgeting and expense tracking.

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

See [Docker documentation](../DOCKER.md) for full stack details.

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

- Dependencies: `poetry`
- Migrations: `poetry run alembic revision --autogenerate -m "description"`
- Core code: `src/budgeting_app_backend/`
- Entry point: `main.py`

## License 📝

[MIT License](LICENSE)
