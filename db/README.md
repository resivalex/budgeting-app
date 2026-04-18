# Database (CouchDB)

Containerized CouchDB instance providing document storage and sync for the budgeting app.

## Architecture

**Why CouchDB?**

- Document-based storage for JSON transaction data
- Built-in bidirectional replication for offline-first sync with PouchDB
- Optimistic concurrency via `_rev` revision field — conflicts detected automatically across replicas
- HTTP/REST API — frontend PouchDB syncs directly without a backend intermediary

**Data model**: A single `budgeting` database stores all documents. Transactions have `_id` prefixed with `tx:` and `kind: "transaction"`. Settings have `_id` prefixed with `cfg:` and `kind: "setting"`. Each document has a `_rev` revision for conflict detection. New fields are added without schema migrations.

**Startup**: `start-and-configure.sh` wraps the default CouchDB entrypoint, waits for the API to become available, then applies CORS configuration via the CouchDB HTTP API using environment variable values.

**Environments**:

- Development: port 9002 exposed for direct browser access
- Production: no exposed ports, internal network only via reverse proxy

## Environment Variables

Create `.env` from `.env.example` and configure:

```plaintext
COUCHDB_USER=admin
COUCHDB_PASSWORD=your_secure_password

COUCHDB_CORS_ORIGINS=*
COUCHDB_CORS_CREDENTIALS=true
COUCHDB_CORS_METHODS=GET,PUT,POST,HEAD,DELETE,OPTIONS
COUCHDB_CORS_HEADERS=accept,authorization,content-type,origin,referer,x-csrf-token
PORT=9002
```

See [root README](../README.md) for build/run commands.

## CORS

CORS is configured automatically by `start-and-configure.sh` on container startup using `.env` values. All CORS settings (origins, credentials, methods, headers) are controlled via environment variables.

Verify CORS:

```shell
curl -i -X OPTIONS -H "Origin: http://localhost:3000" http://localhost:9002/
```
