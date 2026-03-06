# Services Module

External service integrations for the budgeting application backend.

## Components

### GoogleDriveService

Wraps the Google Drive API v3 for file uploads using service account authentication.

**Configuration** (via constructor args or environment variables):

- `GOOGLE_DRIVE_CREDENTIALS_PATH` — path to the service account JSON credentials file
- `GOOGLE_DRIVE_FOLDER_ID` — target Google Drive folder for uploads

**Design rationale**: Both values are validated at construction time, raising `ValueError` immediately rather than failing silently at upload time.

**API**: `upload_file(file_content, mime_type, filename=None)` — uploads raw binary content and returns a dict with `id`, `name`, and `link` (webViewLink). If `filename` is omitted, a UTC-timestamped name is generated automatically.

## Usage

```python
from budgeting_app_backend.services import GoogleDriveService

service = GoogleDriveService()  # reads config from env
result = service.upload_file(csv_bytes, mime_type="text/csv", filename="backup.csv")
print(result["link"])
```

## Architecture

Consumers within the backend:

- `GoogleDriveDump` (transactions module) — calls `upload_file` before each CSV import
- `BackupScheduler` (backup module) — calls `upload_file` for scheduled ZIP archive uploads
