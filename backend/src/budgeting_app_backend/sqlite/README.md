# SQLite Module

Thin wrapper around Python's `sqlite3` that exposes a dict-based interface, used as the storage backend for `SqlSettings`.

## Key Class

`Connection` (exported as `SqliteConnection`) wraps a single SQLite file. It uses `sqlite3.Row` as the row factory so query results are returned as plain `dict` objects.

## Interface

- `read(sql, params)` — executes a SELECT and returns a list of dicts
- `read_one(sql, params)` — executes a SELECT and returns one dict or `None`
- `write(sql, params)` — executes a DML statement and auto-commits

All methods use parameter binding, delegating SQL-injection prevention to `sqlite3`.

## Architecture

- Implements `SqlConnectionProtocol` (see [`../protocols/`](../protocols/))
- Instantiated in `create_state()` ([`../state.py`](../state.py)) using the `SQLITE_PATH` environment variable, then injected into `SqlSettings`
