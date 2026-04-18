# Feature: Database (CouchDB)

## Overview

Containerized CouchDB database providing document storage and bidirectional replication for the offline-first budgeting application.

## Features

### Offline-First Sync

- Bidirectional replication between the browser and the remote server enables offline usage with automatic reconciliation on reconnect
- Handles concurrent edits from multiple devices with automatic conflict detection

## Integration

- **[Frontend](../web/PRD.md)**: PouchDB sync target
- **[Backend](../backend/PRD.md)**: Reads transactions for export and backup/restore
