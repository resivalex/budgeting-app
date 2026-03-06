# Feature: Backend Services

## Overview

External service integrations for the budgeting application backend.

## Components

### GoogleDriveService

- **Authentication**: Service account credentials (JSON file) with Google Drive API v3
- **File Upload**: Uploads binary content to a configured Google Drive folder with a timestamped filename
- **Configurable via environment**: `GOOGLE_DRIVE_CREDENTIALS_PATH` and `GOOGLE_DRIVE_FOLDER_ID`
- **Validation on init**: Raises `ValueError` if credentials file doesn't exist or folder ID is missing
- **Returns**: File metadata dict with `id`, `name`, and `link` (webViewLink)

## Integration Points

- Used by `GoogleDriveDump` in the transactions module for pre-import CSV backups
- Used by `BackupScheduler` in the backup module for scheduled ZIP archive uploads

## Component References

- **[Transactions Module](../transactions/PRD.md)**: `GoogleDriveDump` wraps this service
- **[Backup Module](../backup/PRD.md)**: `BackupScheduler` uses this service for cloud uploads
