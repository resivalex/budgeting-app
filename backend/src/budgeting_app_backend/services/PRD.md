# Feature: Backend Services

## Overview

Cloud storage integration enabling the application to durably back up its data to Google Drive.

## Features

### Google Drive File Upload

The application uploads ZIP database archives to a designated Google Drive folder on a configurable schedule, ensuring data can be restored from cloud storage in case of local data loss.

## Integration Points

- **[Backup Module](../backup/PRD.md)**: requires scheduled cloud uploads of full data archives
