# Feature: Database (CouchDB)

## Overview

Containerized CouchDB database providing document storage and bidirectional replication for the offline-first budgeting application.

## Features

### Document Storage

- Stores all transactions and configuration documents in a single database
- Schemaless design: new fields can be added without migrations; the frontend provides safe defaults for any missing fields

### Offline-First Sync

- Bidirectional replication between the browser and the remote server enables offline usage with automatic reconciliation on reconnect
- Handles concurrent edits from multiple devices with automatic conflict detection

### Browser Access

- The web app accesses the database directly from the browser, enabling offline-first functionality
- Cross-origin access is configured for browser connectivity

### Multi-Environment Support

- Development: database accessible directly for inspection and debugging
- Production: isolated to internal network, accessible only via reverse proxy

## Integration

- **[Frontend](../web/PRD.md)**: PouchDB sync target
- **[Backend](../backend/PRD.md)**: Reads transactions for export and backup/restore
