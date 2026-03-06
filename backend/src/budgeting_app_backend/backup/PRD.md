# Feature: Backend Backup Module

## Overview

Full-database backup and restore system. Creates ZIP archives containing consistent snapshots of both SQLite (settings) and CouchDB (transactions) databases. Supports manual download, API-driven restore, and optional scheduled uploads to Google Drive.

## Functionality

### BackupService

- **Full ZIP Backup**: Creates a ZIP archive with `sqlite/budgeting-app.sqlite3` (via `sqlite3.backup()`) and `couchdb/budgeting.json` (all documents as JSON)
- **Full ZIP Restore**: Extracts a ZIP archive and restores both databases — replaces SQLite file and recreates CouchDB with bulk insert
- **Consistent SQLite Snapshots**: Uses Python's `sqlite3.Connection.backup()` API for safe, atomic copies even with concurrent reads/writes
- **CouchDB Document Dump**: Fetches all documents via `pycouchdb`, strips `_rev` fields for clean restoration

### BackupScheduler

- **Automated Scheduling**: Daily backup scheduling using APScheduler with configurable time (default 3:00 AM UTC)
- **Google Drive Upload**: Optionally uploads the ZIP archive to Google Drive when credentials are configured
- **Manual Triggers**: On-demand backup via API endpoint
- **Scheduler Lifecycle**: Start, shutdown, and health status monitoring

## ZIP Archive Structure

```
backup.zip
├── sqlite/budgeting-app.sqlite3   # Full SQLite database copy
└── couchdb/budgeting.json          # JSON dump of all CouchDB documents
```

`couchdb/budgeting.json` format:

```json
{
  "database": "budgeting",
  "exported_at": "2026-03-01T12:00:00+00:00",
  "doc_count": 1234,
  "docs": [{"_id": "...", ...}, ...]
}
```

## API Endpoints

- `GET /backup` — Download backup ZIP
- `POST /restore` — Upload backup ZIP to restore both databases
- `POST /trigger-backup` — Create backup and upload to Google Drive

## Component References

- **[Services Module](../services/PRD.md)**: GoogleDriveService for optional cloud backup uploads
- **[Main API](../../main.py)**: FastAPI application exposing backup/restore endpoints
