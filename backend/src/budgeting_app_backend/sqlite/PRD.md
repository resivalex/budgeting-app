# Feature: SQLite Database Module

## Overview

Thin wrapper around SQLite providing a dict-based interface for SQL operations, used by `SqlSettings` for configuration storage.

## Functionality

- **Read operations**: `read()` returns a list of dicts; `read_one()` returns a single dict or `None`
- **Write operation**: `write()` executes SQL and auto-commits
- **Parameterized queries**: All operations use parameter binding to prevent SQL injection

## Integration Points

- Instantiated as `SqliteConnection` and passed to `SqlSettings` as the storage backend
- Backed by a single SQLite file configured via `SQLITE_PATH` environment variable

## Component References

- **[Protocols](../protocols/)**: Implements `SqlConnectionProtocol`
- **[Backend State](../state.py)**: `SqliteConnection` created in `create_state()` factory
