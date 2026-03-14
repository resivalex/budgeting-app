# Feature: Backend Backup Module

## Overview

Full-database backup and restore system. Captures consistent snapshots of the settings database (CouchDB `budgeting-settings`) and the transactions database (CouchDB `budgeting`) in a single ZIP archive. Supports manual download, API-driven restore, and optional automated uploads to Google Drive.

## Features

- **Full backup**: Captures both CouchDB databases in one archive so they are always in sync with each other.
- **Full restore**: Uploading a backup archive replaces both CouchDB databases, rolling the system back to the archived state.
- **Automated daily backups**: Scheduler runs a backup once per day (configurable time, default 3:00 AM UTC) and uploads to Google Drive when credentials are present.
- **Manual trigger**: On-demand backup and upload via API without waiting for the schedule.
- **Optional cloud storage**: Google Drive upload is activated only when credentials and a target folder ID are configured; backups still succeed without it.

## User Workflows

1. **Download a backup** — call `GET /backup` to receive a ZIP archive of the current database state.
2. **Restore from backup** — call `POST /restore` with a previously downloaded ZIP to roll back both databases to that snapshot.
3. **Trigger an immediate cloud backup** — call `POST /trigger-backup` to create a backup and push it to Google Drive.

## API Endpoints

- `GET /backup` — Download backup ZIP
- `POST /restore` — Upload backup ZIP to restore both databases
- `POST /trigger-backup` — Create backup and upload to Google Drive

## Integrations

- **Google Drive** — optional cloud destination for scheduled and manual backups; activated by providing credentials and folder ID in configuration
