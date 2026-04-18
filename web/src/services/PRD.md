# Feature: Services

## Overview

Infrastructure service layer providing backend API communication, offline-first local storage, data aggregation, and user configuration persistence.

## Key Behaviors

### Database Reset Recovery

When the server signals a data reset, the local database is automatically rebuilt from the remote source.

### Transaction Analytics

Derives account balances, category rankings, and autocomplete suggestions from transactions. Transfer transactions are handled correctly — amounts are not double-counted when computing balances.

### Settings

Bucket definitions, spending limits, currency configs, and account properties are stored in CouchDB — see [db README](../../../db/README.md) for document structure.
