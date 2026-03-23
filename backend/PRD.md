# Feature: Backend API

## Overview

FastAPI backend providing transaction access, configuration management, CSV export, and automated backup for the offline-first budgeting application.

## Functionality

### Authentication

Password-protected access control for the frontend. Successful authentication returns the credentials needed to connect to the database and make further requests.

### Configuration Management

Tracks when the server-side database was last changed so the frontend can detect a reset and trigger a full resync.

### Data Export

On-demand CSV export of all transactions, sorted newest first, with human-readable account and bucket names.

### Backup & Restore

Full database snapshot (all transactions and settings) can be downloaded as a ZIP, restored from a previously downloaded ZIP, and optionally uploaded to Google Drive. Daily automated backups run at a configurable time.
