# Services Module

External service integrations for the budgeting application backend.

## Design Rationale

Configuration values (credentials path, folder ID) are validated at construction time, raising `ValueError` immediately rather than failing silently at upload time.

## Configuration

Google Drive integration uploads backup archives to a configurable folder using service account authentication. Environment variables:

- `GOOGLE_DRIVE_CREDENTIALS_PATH` — path to the service account JSON credentials file
- `GOOGLE_DRIVE_FOLDER_ID` — target Google Drive folder for uploads
