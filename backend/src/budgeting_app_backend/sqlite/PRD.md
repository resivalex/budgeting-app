# Feature: SQLite Storage Backend

## Overview

Provides persistent local storage for application configuration, enabling the backend to retain settings across restarts without an external database.

## Requirements

- Must support reading multiple records from persistent storage
- Must support reading a single record, returning nothing when absent
- Must support writing (insert/update) with guaranteed durability (auto-commit)
- All queries must be safe against SQL injection
- Storage location must be configurable per environment

## Integration Points

- Serves as the storage backend for the settings subsystem (`SqlSettings`)
- Storage path is supplied via the `SQLITE_PATH` environment variable
