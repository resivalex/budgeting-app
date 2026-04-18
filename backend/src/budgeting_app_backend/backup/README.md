# Backup Module

Creates and restores ZIP archives of the `budgeting` database, with optional scheduled uploads to Google Drive.

## ZIP Archive Structure

```
backup.zip
└── couchdb/budgeting.json    # JSON dump of all documents (transactions + settings)
```

## Key Design Decisions

- **Clean CouchDB restore**: `_rev` fields are stripped on export so documents can be bulk-inserted without conflicts
- **Optional Google Drive**: scheduler skips upload gracefully when credentials are not configured
- **Scheduling**: APScheduler cron job runs daily (default 03:00 UTC)
