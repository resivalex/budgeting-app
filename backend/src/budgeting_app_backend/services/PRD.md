# Feature: Backend Services

## Overview

Cloud storage integration enabling the application to durably back up its data to Google Drive.

## Features

### Google Drive File Upload

The application can upload files to a designated Google Drive folder. This satisfies two requirements:

- **Pre-import backup**: Before importing transactions from CSV, a copy of the source file is uploaded to Google Drive as a safety net, allowing recovery if the import produces unexpected results.
- **Scheduled archive backup**: The system periodically uploads ZIP archives of application data to Google Drive for disaster recovery, ensuring data can be restored from cloud storage in case of local data loss.

## Integration Points

- **[Transactions Module](../transactions/PRD.md)**: requires a Drive upload to occur before each CSV import completes
- **[Backup Module](../backup/PRD.md)**: requires scheduled cloud uploads of full data archives
