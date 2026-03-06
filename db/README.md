# Database (CouchDB)

Containerized CouchDB instance providing document storage and sync for the budgeting app.

## Architecture

**Why CouchDB?**

- Document-based storage for JSON transaction data
- Built-in bidirectional replication for offline-first sync with PouchDB
- Native conflict resolution for concurrent edits across devices
- HTTP/REST API — frontend PouchDB syncs directly without a backend intermediary

**Data model**: Each transaction is a JSON document with `_id` (UUID), `_rev` (revision), and domain fields. Schemaless — new fields are added without migrations; the frontend defaults missing fields on read.

**Environments**:

- Development: port 9002 exposed for direct browser access
- Production: no exposed ports, internal network only via reverse proxy

## Prerequisites

- [Docker](https://www.docker.com/get-started)

## Setup

1. Navigate to the database directory:

   ```shell
   cd db
   ```

2. Create an `.env` file:

   ```shell
   cp .env.example .env
   ```

   Configure with your settings:

   ```plaintext
   COUCHDB_USER=admin
   COUCHDB_PASSWORD=your_secure_password

   COUCHDB_CORS_ORIGINS=*
   COUCHDB_CORS_CREDENTIALS=true
   COUCHDB_CORS_METHODS=GET,PUT,POST,HEAD,DELETE,OPTIONS
   COUCHDB_CORS_HEADERS=accept,authorization,content-type,origin,referer,x-csrf-token
   PORT=9002
   ```

3. Start the container:

   ```shell
   # Development
   docker-compose -f docker-compose.dev.yml up -d

   # Production
   docker-compose up -d
   ```

4. Access CouchDB at [http://localhost:9002](http://localhost:9002)

## Configuration Files

- `docker-compose.base.yml` — shared base configuration
- `docker-compose.dev.yml` — development (port 9002 exposed)
- `docker-compose.yml` — production (no exposed ports)

## CORS

CORS is configured automatically by `start-and-configure.sh` on container startup using `.env` values.

Verify CORS:

```shell
curl -i -X OPTIONS -H "Origin: http://localhost:3000" http://localhost:9002/
```
