# Services Module

External service integrations for the budgeting application backend.

## Components

### GoogleDriveService

Wraps the Google Drive API v3 for file uploads using service account authentication.

**Configuration** (via constructor args or environment variables):

- `GOOGLE_DRIVE_CREDENTIALS_PATH` — path to the service account JSON credentials file
- `GOOGLE_DRIVE_FOLDER_ID` — target Google Drive folder for uploads

Both values are validated at construction time; missing or invalid paths raise `ValueError` immediately rather than failing at upload time.

**Upload behavior**: accepts raw binary content and an optional filename. If no filename is provided, one is auto-generated with a UTC timestamp (`budget_transactions_dump_<timestamp>.csv`). Returns a dict with `id`, `name`, and `link` (webViewLink).

## Usage

```python
from budgeting_app_backend.services import GoogleDriveService

service = GoogleDriveService()  # reads config from env
result = service.upload_file(csv_bytes, mime_type="text/csv", filename="backup.csv")
print(result["link"])
```

## Consumers

- `GoogleDriveDump` (transactions module) — pre-import CSV backups
- `BackupScheduler` (backup module) — scheduled ZIP archive uploads
