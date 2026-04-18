# Settings Module

Persistent key-value configuration store backed by CouchDB (`budgeting` database, `cfg:`-prefixed keys).

## Architecture

`UploadDetails` accepts a `SettingsProtocol` in its constructor and serializes/deserializes Pydantic models as JSON strings. This keeps the service storage-agnostic and easy to test with a mock.
