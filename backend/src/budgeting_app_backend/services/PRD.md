# Feature: Backend Services

## Overview

Cloud storage integration enabling the application to upload files to Google Drive.

## Features

### Google Drive File Upload

The application can upload files to a designated Google Drive folder. This supports two user-facing needs:

- **Pre-import backup**: Before importing transactions from CSV, a copy is uploaded to Google Drive as a safety net.
- **Scheduled archive backup**: The system periodically uploads ZIP archives of application data to Google Drive for disaster recovery.

## Integration Points

- **[Transactions Module](../transactions/PRD.md)**: triggers a Drive upload before each CSV import
- **[Backup Module](../backup/PRD.md)**: uses Drive upload for scheduled cloud backups
