# Feature: Database (CouchDB)

## Overview

Containerized CouchDB database providing document storage and bidirectional replication for the offline-first budgeting application.

## Features

### Transaction Storage

- Stores financial transactions as JSON documents in the `budgeting` database
- Schemaless design: new fields can be added without migrations; the frontend defaults missing fields on read (e.g., `budget_name` defaults to `""`)

### Offline-First Sync

- Frontend syncs directly with CouchDB without a backend intermediary
- Handles concurrent edits from multiple devices with automatic conflict detection
- Real-time change feed drives sync updates in the frontend

### Browser Access

- The web app accesses the database directly from the browser via CouchDB's HTTP API
- CORS is enabled to allow cross-origin requests from the frontend

### Multi-Environment Support

- Development: database accessible directly for inspection and debugging
- Production: isolated to internal network, accessible only via reverse proxy

## Integration

- **[Frontend](../web/PRD.md)**: PouchDB sync target
- **[Backend](../backend/PRD.md)**: Reads transactions for export; overwrites database during CSV import
