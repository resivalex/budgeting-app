# Feature: SQLite Database Module

## Overview

Thin wrapper around the standard library `sqlite3` module providing a clean dict-based interface for SQL operations, used by `SqlSettings` for configuration storage.

## Functionality

- **Read operations**: `read()` returns a list of dicts; `read_one()` returns a single dict or `None`
- **Write operation**: `write()` executes SQL with parameter binding and auto-commits
- **Dictionary rows**: `sqlite3.Row` factory configured so all results are plain dicts
- **Resource management**: Connection opened on construction, closed in destructor
- **SQL injection safety**: All operations use parameter binding

## Integration Points

- Instantiated as `SqliteConnection` and passed to `SqlSettings` as the storage backend
- Backed by a single SQLite file configured via `SQLITE_PATH` environment variable

## Component References

- **[Protocols](../protocols/)**: Implements `SqlConnectionProtocol`
- **[Backend State](../state.py)**: `SqliteConnection` created in `create_state()` factory
