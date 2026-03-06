# Feature: Database (CouchDB)

## Overview

Containerized CouchDB database providing document storage and bidirectional replication for the offline-first budgeting application.

## Functionality

### Document Storage

- **Transaction Documents**: Stores financial transactions as JSON documents in the `budgeting` database
- **Schemaless Design**: New fields (e.g., `budget_name`) can be added without migrations; the frontend defaults missing fields on read (`budget_name` defaults to `""`)
- **Revision Tracking**: CouchDB manages `_rev` for conflict detection across replicas

### Bidirectional Replication

- **PouchDB Sync**: Frontend PouchDB syncs directly with CouchDB without backend intermediary
- **Conflict Resolution**: CouchDB handles concurrent edits from multiple devices
- **Change Feed**: Real-time change notifications drive sync in the frontend

### CORS Configuration

- **Browser Access**: CORS configured automatically on startup to allow frontend browser access
- **Environment-Driven**: CORS origins, methods, and headers controlled via `.env`

### Multi-Environment Deployment

- **Development**: Exposed on port 9002 for direct browser access
- **Production**: No exposed ports; internal network only via reverse proxy

## Component References

- **[Frontend](../web/PRD.md)**: PouchDB sync target
- **[Backend](../backend/PRD.md)**: Reads transactions for export; overwrites database during CSV import
