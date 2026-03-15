# Feature: Services

## Overview

Infrastructure service layer providing backend API communication, offline-first local storage, data aggregation, and user configuration persistence.

## Features

### User Configuration Persistence

User credentials (backend URL, token, database URL) and sync timestamps are persisted locally so settings survive page reloads without re-authenticating.

### Backend Integration

- **Authentication**: User logs in with a backend URL and password to obtain a session token.
- **CSV Export**: Requests a transaction export from the backend for download.

### Settings from CouchDB

- **Spending Limits**: Read and written directly from CouchDB `budgeting-settings` database via PouchDB — no backend API involved.
- **Category & Account Data**: Category display name mappings and per-account visual properties are loaded directly from CouchDB.

### Offline-First Transaction Storage

Transactions are stored locally and remain accessible without network connectivity. Changes are synchronized with the remote database on demand. When the server signals a data reset, the local database is rebuilt from the remote.

### Transaction Analytics

Derives account balances, category frequency rankings, active currencies, and payee/comment suggestions from the current transaction set, powering autocomplete and summary views. Transfer transactions are handled correctly — amounts are not double-counted when computing balances.
