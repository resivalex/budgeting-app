# Feature: Backend API

## Overview

FastAPI backend providing transaction access, configuration management, CSV export, and automated backup for the offline-first budgeting application.

## Functionality

### Authentication

Returns database connection credentials on successful login, enabling direct PouchDB↔CouchDB sync from the frontend.

### Configuration Management

Tracks when the server-side database was last changed so the frontend can detect a reset and trigger a full resync.

### Data Export

On-demand CSV export of all transactions with resolved human-readable names. Transaction types derived from account ownership — see [Transaction Domain PRD](../web/src/domain/PRD.md) for derivation rules.

### Backup & Restore

Full database snapshot as a ZIP, with restore and optional Google Drive upload. Daily automated backups at a configurable time.
