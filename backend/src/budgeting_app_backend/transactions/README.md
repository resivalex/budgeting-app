# Transactions Module

CouchDB adapter for reading transaction data.

## Components

### DbSource

Connects to CouchDB and retrieves all documents from the `budgeting` database as a flat list. Used by `State.transactions()` to serve the `GET /transactions` endpoint.

## Related Modules

- `../state.py` — wires the component into the application
