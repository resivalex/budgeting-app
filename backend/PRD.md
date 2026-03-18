# Feature: Backend API

## Overview

FastAPI backend providing transaction access, configuration management, CSV import/export, and automated backup for the offline-first budgeting application.

## Functionality

### API Endpoints

- **`GET /config`** (password-authenticated): Returns bearer token and CouchDB URL for frontend initialization
- **`GET /settings`**: Returns `transactionsUploadedAt` timestamp for frontend database reset detection
- **`POST /importing`**: Accepts CSV file upload; replaces the CouchDB database with the uploaded CSV contents
- **`GET /exporting`**: Returns all transactions as a CSV file with standard columns
- **`GET /backup`**: Download a ZIP archive containing CouchDB dumps
- **`POST /restore`**: Upload a backup ZIP to restore the database
- **`POST /trigger-backup`**: Create a backup and upload it to Google Drive
- **`GET /health`**: Returns scheduler running status and next scheduled backup time

### Configuration Management

- **Upload Timestamp**: Tracks the last CSV import time; frontend compares this to detect a server-side database reset and trigger a full resync

### Data Import/Export

- **CSV Export**: Exports all CouchDB transactions as CSV with columns: `datetime, account, category, type, amount, currency, payee, comment, budget_name`, sorted newest first
- **CSV Import**: Replaces the entire CouchDB database with contents of uploaded CSV
- **`budget_name` field**: Present in both import and export CSV; missing values become empty string (`""`)

### Backup & Restore

- **Full ZIP Backup**: Creates a ZIP with `couchdb/budgeting.json` containing all documents (transactions and settings)
- **Full ZIP Restore**: Extracts ZIP and restores the CouchDB database; updates `transactionsUploadedAt`
- **Scheduled Backups**: Daily automated backup at configurable time (default 3:00 AM UTC), optionally uploaded to Google Drive
- **Manual Trigger**: On-demand backup via `POST /trigger-backup`

### Authentication

- Bearer token authentication for all state-mutating and data endpoints
- Password-only authentication for `/config` endpoint to obtain the token
