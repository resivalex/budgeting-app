# Settings Module

Persistent key-value configuration store backed by CouchDB (`budgeting` database, `cfg:`-prefixed keys).

## Architecture

`UploadDetails` accepts a `SettingsProtocol` in its constructor and serializes/deserializes Pydantic models as JSON strings. This keeps the service storage-agnostic and easy to test with a mock.

## Public API

All value types and service classes are re-exported from `__init__.py`. Import from the package root:

```python
from budgeting_app_backend.settings import UploadDetails
```

## Dependencies

- `SettingsProtocol` (in `protocols/`) — storage interface implemented by `CouchDbSettings`
- Composed and wired by `State` in `state.py`
