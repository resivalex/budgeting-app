# Feature: Backend API

## Overview

FastAPI backend providing transaction access, configuration management, CSV import/export, and automated backup for the offline-first budgeting application.

## Functionality

### API Endpoints

- **`GET /config`** (password-authenticated): Returns bearer token and CouchDB URL for frontend initialization
- **`GET /settings`**: Returns `transactionsUploadedAt` timestamp for frontend database reset detection
- **`GET /transactions`**: Returns all transaction documents from CouchDB
- **`POST /importing`**: Accepts CSV file upload; replaces the CouchDB database with the uploaded CSV contents
- **`GET /exporting`**: Returns all transactions as a CSV file with standard columns
- **`GET /spending-limits`** / **`POST /spending-limits`**: Read/write full spending limits configuration
- **`GET /spending-limits/month-budget`**: Read a single month's budget slice
- **`POST /spending-limits/month-budget`** and **`POST /spending-limits/month-budget-item`**: Partial budget updates by month
- **`GET /category-expansions`** / **`POST /category-expansions`**: Read/write category display name mappings
- **`GET /account-properties`** / **`POST /account-properties`**: Read/write per-account visual properties (colors)
- **`GET /backup`**: Download a ZIP archive containing both SQLite and CouchDB dumps
- **`POST /restore`**: Upload a backup ZIP to restore both databases
- **`POST /trigger-backup`**: Create a backup and upload it to Google Drive
- **`GET /health`**: Returns scheduler running status and next scheduled backup time

### Configuration Management

- **Spending Limits**: Named budgets with per-month limits, currencies, category lists, and color; supports multi-currency conversion configuration
- **Category Expansions**: Maps short category codes to expanded display names shown in the frontend
- **Account Properties**: Per-account color configuration for frontend visual display
- **Upload Timestamp**: Tracks the last CSV import time; frontend compares this to detect a server-side database reset

### Data Import/Export

- **CSV Export**: Exports all CouchDB transactions as CSV with columns: `datetime, account, category, type, amount, currency, payee, comment, budget_name`, sorted newest first
- **CSV Import**: Replaces the entire CouchDB database with contents of uploaded CSV
- **`budget_name` field**: Present in both import and export CSV; missing values become empty string (`""`)

### Backup & Restore

- **Full ZIP Backup**: Creates a ZIP with `sqlite/budgeting-app.sqlite3` and `couchdb/budgeting.json` (all documents)
- **Full ZIP Restore**: Extracts ZIP and restores both databases; updates `transactionsUploadedAt`
- **Scheduled Backups**: Daily automated backup at configurable time (default 3:00 AM UTC), optionally uploaded to Google Drive
- **Manual Trigger**: On-demand backup via `POST /trigger-backup`

### Authentication

- Bearer token authentication for all state-mutating and data endpoints
- Password-only authentication for `/config` endpoint to obtain the token
