# SQLite Module

Thin wrapper around Python's `sqlite3` exposing a dict-based interface, used as the persistent storage backend for `SqlSettings`.

## Architecture

- `SqliteConnection` implements `SqlConnectionProtocol` (see [`../protocols/`](../protocols/))
- Instantiated in `create_state()` ([`../state.py`](../state.py)) via the `SQLITE_PATH` environment variable, then injected into `SqlSettings`
- Uses `sqlite3.Row` as the row factory so all query results are returned as plain `dict` objects; parameter binding delegates SQL-injection prevention to `sqlite3`
