# Feature: Backend Backup Module

## Overview

Full-database backup and restore system. Captures a consistent snapshot of the unified `budgeting` CouchDB database (containing both transactions and settings) in a single ZIP archive. Supports manual download, API-driven restore, and optional automated uploads to Google Drive.

## Key Behaviors

- **Full restore is destructive**: Uploading a backup archive replaces the entire `budgeting` database
- **Graceful degradation**: Google Drive upload is optional; backups succeed without credentials
- **Scheduled backups**: Daily at configurable time (default 3:00 AM UTC)

## User Workflows

1. **Download a backup** — Download a ZIP archive of the current database state.
2. **Restore from backup** — Upload a previously downloaded ZIP to roll back the database to that snapshot.
3. **Trigger an immediate cloud backup** — Create a backup and push it to Google Drive on demand.

## Integrations

- **Google Drive** — optional cloud destination for scheduled and manual backups; activated by providing credentials and folder ID in configuration
